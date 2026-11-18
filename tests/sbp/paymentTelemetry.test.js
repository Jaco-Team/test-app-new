import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('axios', () => ({ default: { post: vi.fn() } }));
vi.mock('js-cookie', () => ({ default: { get: vi.fn() } }));
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }));
vi.mock('@/utils/clientMonitoring', () => ({
  emitInternetIssue: vi.fn(),
  getClientNetworkContext: vi.fn(),
  isCustomSentryMonitoringEnabled: vi.fn(),
}));

import axios from 'axios';
import Cookies from 'js-cookie';
import { trackPaymentClientEvent } from '../../components/api.js';

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

function sentPayload() {
  return Object.fromEntries(
    new URLSearchParams(axios.post.mock.calls.at(-1)[1])
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  Cookies.get.mockReturnValue(undefined);
  axios.post.mockResolvedValue({});
  vi.stubGlobal('window', {
    localStorage: storage(),
    sessionStorage: storage(),
    navigator: { onLine: true, connection: { effectiveType: '4g' } },
    location: { pathname: '/togliatti/cart' },
  });
});

afterEach(() => vi.unstubAllGlobals());

describe('доставка платёжной диагностики', () => {
  it('передаёт актуальный токен cookie для серверной привязки клиента', () => {
    Cookies.get.mockReturnValue('current-session');
    window.localStorage.setItem('token', 'old-session');
    trackPaymentClientEvent('widget_script_failed', {
      payment_flow_id: 'payment-flow',
      point_id: 6,
      order_id: 123,
      script_host: 'yookassa.ru',
      script_path: '/checkout-widget/v1/checkout-widget.js',
      duration_ms: 12000,
      reason: 'script_error',
      outcome: 'error',
    });
    expect(axios.post.mock.calls[0][0]).toMatch(/\/cart$/);
    expect(sentPayload()).toMatchObject({
      type: 'payment_event',
      token: 'current-session',
      payment_flow_id: 'payment-flow',
      client_stage: 'widget_script_failed',
      point_id: '6',
      order_id: '123',
      script_host: 'yookassa.ru',
      script_path: '/checkout-widget/v1/checkout-widget.js',
      duration_ms: '12000',
      online: 'true',
      effective_type: '4g',
      path: '/togliatti/cart',
      city_id: 'togliatti',
    });
  });

  it('передаёт тип устройства', () => {
    window.navigator.userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148 Safari/604.1';
    trackPaymentClientEvent('checkout_started', {
      payment_flow_id: 'payment-flow',
    });
    expect(sentPayload().device_type).toBe('mobile');
  });

  it('событие перед уходом на страницу оплаты отправляет через sendBeacon, а без него — обычным запросом', async () => {
    const sendBeacon = vi.fn(() => true);
    window.navigator.sendBeacon = sendBeacon;
    trackPaymentClientEvent(
      'payment_redirect_started',
      { payment_flow_id: 'payment-flow', payment_method: 'sbp' },
      { beacon: true }
    );
    expect(axios.post).not.toHaveBeenCalled();
    expect(sendBeacon.mock.calls[0][0]).toMatch(/\/cart$/);
    const sent = Object.fromEntries(
      new URLSearchParams(await sendBeacon.mock.calls[0][1].text())
    );
    expect(sent).toMatchObject({
      type: 'payment_event',
      client_stage: 'payment_redirect_started',
      payment_method: 'sbp',
    });

    // Браузер отказал в beacon — событие уходит обычным запросом.
    sendBeacon.mockReturnValue(false);
    trackPaymentClientEvent(
      'payment_redirect_started',
      { payment_flow_id: 'payment-flow' },
      { beacon: true }
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('использует localStorage, если cookie отсутствует', () => {
    window.localStorage.setItem('token', 'stored-session');
    trackPaymentClientEvent('widget_rendered');
    expect(sentPayload().token).toBe('stored-session');
  });

  it('оставляет гостевое событие без токена', () => {
    trackPaymentClientEvent('widget_script_started');
    expect(sentPayload()).not.toHaveProperty('token');
    expect(sentPayload().client_stage).toBe('widget_script_started');
  });

  it.each([
    ['/samara/cart', 'samara'],
    ['/togliatti/cart', 'togliatti'],
    ['/samara/only_pay_page', 'samara'],
    ['/togliatti/only_pay_page', 'togliatti'],
  ])('привязывает событие к городу канонического маршрута %s', (path, city) => {
    window.location.pathname = path;
    trackPaymentClientEvent('widget_script_started');
    expect(sentPayload().city_id).toBe(city);
  });

  it.each(['/', '/feedback/stars/private', '/unknown/cart'])(
    'не выдумывает город маршрута %s',
    (path) => {
      window.location.pathname = path;
      trackPaymentClientEvent('widget_script_started');
      expect(sentPayload()).not.toHaveProperty('city_id');
    }
  );

  it.each([1, 2, 'samara', 'togliatti'])(
    'сохраняет допустимый город события %s',
    (city) => {
      trackPaymentClientEvent('widget_script_started', { city_id: city });
      expect(sentPayload().city_id).toBe(String(city));
    }
  );

  it.each([0, -1, 1.5, 'unknown', {}, '2?token=private'])(
    'игнорирует недопустимый город события %s',
    (city) => {
      trackPaymentClientEvent('widget_script_started', { city_id: city });
      expect(sentPayload().city_id).toBe('togliatti');
      expect(JSON.stringify(sentPayload())).not.toContain('private');
    }
  );

  it('недоступные cookie и storage не ломают оформление', () => {
    Cookies.get.mockImplementation(() => {
      throw new Error('cookie blocked');
    });
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('storage blocked');
      },
    });
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new Error('storage blocked');
      },
    });
    expect(() => trackPaymentClientEvent('widget_script_failed')).not.toThrow();
    expect(sentPayload()).not.toHaveProperty('token');
  });

  it('ограничивает коды провайдера и не отправляет платёжные секреты', () => {
    trackPaymentClientEvent('widget_error', {
      provider_error_code: 'invalid_token',
      confirmation_token: 'private-payment-token',
      error: { message: 'private-error' },
      script_host: 'unknown.example',
      script_path: '/checkout.js?token=private',
    });
    expect(sentPayload().provider_error_code).toBe('invalid_token');
    expect(sentPayload()).not.toHaveProperty('script_host');
    expect(sentPayload()).not.toHaveProperty('script_path');
    expect(axios.post.mock.calls[0][1]).not.toContain('private');
    trackPaymentClientEvent('widget_error', {
      provider_error_code: 'raw-private-error',
    });
    expect(sentPayload().provider_error_code).toBe('unknown');
  });

  it('передаёт только известный способ подтверждения платежа', () => {
    trackPaymentClientEvent('hosted_payment_selected', {
      payment_confirmation: 'redirect',
    });
    expect(sentPayload().payment_confirmation).toBe('redirect');
    trackPaymentClientEvent('checkout_started', {
      payment_confirmation: 'private-error',
    });
    expect(sentPayload()).not.toHaveProperty('payment_confirmation');
  });

  it('ошибка доставки не создаёт необработанное отклонение', async () => {
    axios.post.mockRejectedValue(new Error('network unavailable'));
    expect(() => trackPaymentClientEvent('widget_error')).not.toThrow();
    await Promise.resolve();
  });

  it('синхронный сбой браузера или транспорта не ломает оплату', () => {
    axios.post.mockImplementation(() => {
      throw new Error('transport unavailable');
    });
    expect(() =>
      trackPaymentClientEvent('widget_script_started')
    ).not.toThrow();
    Object.defineProperty(window, 'navigator', {
      get() {
        throw new Error('browser context blocked');
      },
    });
    expect(() => trackPaymentClientEvent('widget_script_failed')).not.toThrow();
  });

  it('на сервере не отправляет браузерную диагностику', () => {
    vi.stubGlobal('window', undefined);
    trackPaymentClientEvent('widget_script_started');
    expect(axios.post).not.toHaveBeenCalled();
  });
});
