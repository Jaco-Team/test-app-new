import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearPendingSbpOrder,
  getPendingSbpOrder,
  isSbpEnabled,
  isSbpPaymentConfirmed,
  savePendingSbpOrder,
  sbpConfirmationUrl,
} from '@/utils/sbpPayment';

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe('СБП на фронтенде', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      localStorage: storage(),
      sessionStorage: storage(),
    });
    vi.stubEnv('NEXT_PUBLIC_SBP_ENABLED', 'false');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('остаётся скрытой, пока флаг не включён при сборке', () => {
    expect(isSbpEnabled()).toBe(false);
    vi.stubEnv('NEXT_PUBLIC_SBP_ENABLED', 'true');
    expect(isSbpEnabled()).toBe(true);
  });

  it('разрешает только HTTPS-ссылку ЮKassa для оплаты СБП', () => {
    const paymentUrl =
      'https://yoomoney.ru/payments/external/confirmation?orderId=123';
    expect(sbpConfirmationUrl(paymentUrl)).toBe(paymentUrl);
    expect(sbpConfirmationUrl('https://checkout.yookassa.ru/pay/123')).toBe(
      'https://checkout.yookassa.ru/pay/123'
    );
    expect(sbpConfirmationUrl('http://yoomoney.ru/pay/123')).toBeNull();
    expect(
      sbpConfirmationUrl('https://yoomoney.ru.evil.example/pay/123')
    ).toBeNull();
    expect(sbpConfirmationUrl('javascript:alert(1)')).toBeNull();
  });

  it('не признаёт заказ оплаченным до ответа сервера', () => {
    expect(isSbpPaymentConfirmed({ st: true, status: 'pending' })).toBe(false);
    expect(isSbpPaymentConfirmed({ st: true, status: 'processing' })).toBe(
      false
    );
    expect(isSbpPaymentConfirmed({ st: false, status: 'succeeded' })).toBe(
      false
    );
    expect(isSbpPaymentConfirmed({ st: true, status: 'succeeded' })).toBe(true);
  });

  it('сохраняет тот же заказ для оплаты после закрытия или перезагрузки', () => {
    savePendingSbpOrder({
      orderId: 123,
      pointId: 5,
      city: 'samara',
      retryToken: 'signed',
    });
    expect(getPendingSbpOrder()).toMatchObject({
      orderId: 123,
      pointId: 5,
      city: 'samara',
      retryToken: 'signed',
    });
    clearPendingSbpOrder();
    expect(getPendingSbpOrder()).toBeNull();
  });

  it('удаляет устаревшую или повреждённую попытку', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-23T10:00:00Z'));
    savePendingSbpOrder({
      orderId: 123,
      pointId: 5,
      city: 'samara',
      retryToken: 'signed',
    });
    vi.advanceTimersByTime(16 * 60 * 1000);
    expect(getPendingSbpOrder()).toBeNull();
    window.localStorage.setItem('jaco_pending_sbp_order', '{broken');
    expect(getPendingSbpOrder()).toBeNull();
  });

  it('не ломает оформление при недоступном localStorage', () => {
    const fallback = storage();
    vi.stubGlobal('window', {
      get localStorage() {
        throw new Error('blocked');
      },
      sessionStorage: fallback,
    });
    expect(
      savePendingSbpOrder({
        orderId: 123,
        pointId: 5,
        city: 'samara',
        retryToken: 'signed',
      })
    ).toMatchObject({ orderId: 123 });
    expect(getPendingSbpOrder()?.orderId).toBe(123);
  });
});
