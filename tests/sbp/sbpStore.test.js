import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('js-cookie', () => ({
  default: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
}));
vi.mock('../../components/api.js', () => ({
  api: vi.fn(),
  apiAddress: vi.fn(),
  beginPaymentFlow: vi.fn(),
  endPaymentFlow: vi.fn(),
  getPaymentFlowId: vi.fn(),
  trackPaymentClientEvent: vi.fn(),
}));
vi.mock('../../components/useYandexMetrika', () => ({ default: vi.fn() }));
vi.mock('@sentry/nextjs', () => ({ captureMessage: vi.fn() }));
vi.mock('@/utils/metrika', () => ({
  reachGoal: vi.fn(),
  setUserIdAll: vi.fn(),
}));
vi.mock('@/utils/clientMonitoring', () => ({
  getClientNetworkContext: vi.fn(),
}));
vi.mock('zustand/middleware', async (importOriginal) => ({
  ...(await importOriginal()),
  persist: (initializer) => initializer,
}));

import { api } from '../../components/api.js';
import { useCartStore, useHeaderStoreNew, useProfileStore } from '../../components/store.js';
import {
  clearPendingSbpOrder,
  savePendingSbpOrder,
} from '../../utils/sbpPayment.js';

const pending = {
  orderId: 123,
  pointId: 5,
  city: 'samara',
  retryToken: 'signed-token',
  check: { order: { order_id: 123, point_id: 5 } },
};

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

const redirect = vi.fn();
const widgets = [];
class FakeWidget {
  constructor(options) {
    this.options = options;
    this.render = vi.fn().mockResolvedValue(undefined);
    this.destroy = vi.fn();
    this.on = vi.fn();
    widgets.push(this);
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  widgets.length = 0;
  vi.stubGlobal('window', {
    localStorage: storage(),
    sessionStorage: storage(),
    YooMoneyCheckoutWidget: FakeWidget,
    location: {
      origin: 'https://example.test',
      href: 'https://example.test/samara/cart',
      assign: redirect,
    },
  });
  vi.stubGlobal('document', {
    getElementById: (id) => (id === 'payment-form-confirm' ? {} : null),
  });
  useHeaderStoreNew.setState({ setActiveModalAlert: vi.fn() });
  useCartStore.setState({
    pendingSbpOrder: null,
    sbpPaymentState: 'idle',
    global_checkout: null,
    openConfirmForm: false,
    DBClick: false,
  });
});

afterEach(() => {
  useCartStore.getState().setConfirmForm(false);
  clearPendingSbpOrder();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('оплата СБП с переходом на страницу ЮKassa', () => {
  it('после создания заказа СБП показывает ссылку для подтверждения, не уводя с проверки', async () => {
    const url =
      'https://yoomoney.ru/payments/external/confirmation?orderId=123';
    window.localStorage.setItem(
      'setCart',
      JSON.stringify({ updatedAt: Date.now() })
    );
    useCartStore.setState({
      typeOrder: 'pic',
      orderPic: { id: 5 },
      typePay: { id: 'sbp', name: 'СБП на сайте' },
      items: [{ item_id: 1, count: 1 }],
    });
    api.mockResolvedValueOnce({
      st: true,
      order_id: 123,
      sbp_retry_token: 'signed-token',
      check: pending.check,
      pay: { pay: { confirmation: { confirmation_url: url } } },
    });

    expect(
      await useCartStore.getState().createOrder('user-token', 'samara')
    ).toBe('wait_payment');
    expect(api).toHaveBeenCalledWith(
      'cart',
      expect.objectContaining({
        type: 'create_order_pre',
        typePay: 'sbp',
        point_id: 5,
      })
    );
    expect(redirect).not.toHaveBeenCalled();
    expect(useCartStore.getState().pendingSbpOrder?.orderId).toBe(123);
    expect(useCartStore.getState().sbpPaymentUrl).toBe(url);
    expect(useCartStore.getState().sbpPaymentState).toBe('ready');
    expect(widgets).toHaveLength(0);

    expect(useCartStore.getState().startSbpRedirect()).toBe('pending');
    expect(redirect).toHaveBeenCalledWith(url);
  });

  it('оставляет оплату картой во встроенном виджете', async () => {
    window.localStorage.setItem(
      'setCart',
      JSON.stringify({ updatedAt: Date.now() })
    );
    useCartStore.setState({
      typeOrder: 'pic',
      orderPic: { id: 5 },
      typePay: { id: 'online', name: 'Картой на сайте' },
      items: [{ item_id: 1, count: 1 }],
    });
    api.mockResolvedValueOnce({
      st: true,
      order_id: 123,
      check: pending.check,
      pay: { pay: { confirmation: { confirmation_token: 'card-token' } } },
    });

    expect(
      await useCartStore.getState().createOrder('user-token', 'samara')
    ).toBe('wait_payment');
    await vi.advanceTimersByTimeAsync(301);
    expect(widgets).toHaveLength(1);
    expect(widgets[0].options.confirmation_token).toBe('card-token');
    expect(widgets[0].render).toHaveBeenCalledWith('payment-form-confirm');
    expect(redirect).not.toHaveBeenCalled();
  });

  it.each([390, 1280])('на ширине %i открывает подтверждение СБП', (width) => {
    window.innerWidth = width;
    const url =
      'https://yoomoney.ru/payments/external/confirmation?orderId=123';
    expect(useCartStore.getState().startSbpRedirect(url)).toBe('pending');
    expect(redirect).toHaveBeenCalledWith(url);
    expect(useCartStore.getState().sbpPaymentState).toBe('pending');
  });

  it('отклоняет неподтверждённый адрес и сохраняет заказ', () => {
    savePendingSbpOrder(pending);
    useCartStore.getState().restorePendingSbpOrder('samara');
    expect(
      useCartStore.getState().startSbpRedirect('https://example.test/pay')
    ).toBe('error');
    expect(redirect).not.toHaveBeenCalled();
    expect(useCartStore.getState().pendingSbpOrder?.orderId).toBe(123);
    expect(
      useHeaderStoreNew.getState().setActiveModalAlert
    ).toHaveBeenCalledWith(
      true,
      expect.stringContaining('ссылку на оплату СБП'),
      false
    );
  });

  it('после возврата из банка ждёт подтверждения сервера', async () => {
    savePendingSbpOrder(pending);
    const currentOrder = { order: { order_id: 456, point_id: 7 } };
    useCartStore.setState({
      typePay: { id: 'cash', name: 'Наличными курьеру' },
      checkNewOrder: currentOrder,
    });
    useCartStore.getState().restorePendingSbpOrder('samara');
    expect(useCartStore.getState().typePay?.id).toBe('cash');
    expect(useCartStore.getState().checkNewOrder).toBe(currentOrder);
    const onSuccess = vi.fn();
    api
      .mockResolvedValueOnce({ st: true, status: 'processing' })
      .mockResolvedValueOnce({ st: true, status: 'succeeded' });
    expect(
      await useCartStore
        .getState()
        .checkSbpPaymentStatus('user-token', onSuccess)
    ).toBe('processing');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(
      await useCartStore
        .getState()
        .checkSbpPaymentStatus('user-token', onSuccess)
    ).toBe('succeeded');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(useCartStore.getState().pendingSbpOrder).toBeNull();
    expect(useCartStore.getState().typePay?.id).toBe('cash');
    expect(useCartStore.getState().checkNewOrder).toBe(currentOrder);
  });

  it('позволяет оформить новый заказ при ожидающей оплате старого СБП', async () => {
    savePendingSbpOrder(pending);
    useCartStore.getState().restorePendingSbpOrder('samara');
    window.localStorage.setItem(
      'setCart',
      JSON.stringify({ updatedAt: Date.now() })
    );
    useCartStore.setState({
      DBClick: false,
      typeOrder: 'pic',
      orderPic: { id: 7 },
      typePay: { id: 'cash', name: 'В кафе' },
      items: [{ item_id: 1, count: 1 }],
    });
    api.mockResolvedValue({
      st: false,
      text: 'Тестовый ответ без создания заказа',
    });

    await useCartStore.getState().createOrder('user-token', 'samara');
    await vi.advanceTimersByTimeAsync(301);
    await useCartStore.getState().createOrder('user-token', 'samara');

    expect(api).toHaveBeenCalledTimes(2);
    expect(api).toHaveBeenNthCalledWith(
      1,
      'cart',
      expect.objectContaining({ type: 'create_order_pre' })
    );
    expect(api).toHaveBeenNthCalledWith(
      2,
      'cart',
      expect.objectContaining({ type: 'create_order_pre' })
    );
    expect(useCartStore.getState().pendingSbpOrder?.orderId).toBe(123);
  });

  it('при отказе банка сохраняет заказ для проверки статуса', async () => {
    savePendingSbpOrder(pending);
    useCartStore.getState().restorePendingSbpOrder();
    api.mockResolvedValue({ st: true, status: 'canceled' });
    expect(
      await useCartStore.getState().checkSbpPaymentStatus('user-token')
    ).toBe('canceled');
    expect(useCartStore.getState().pendingSbpOrder?.orderId).toBe(123);
    expect(useCartStore.getState().sbpPaymentState).toBe('canceled');
  });

  it('закрытие формы после возврата сохраняет исходный заказ', () => {
    savePendingSbpOrder(pending);
    useCartStore.getState().restorePendingSbpOrder('samara');
    useCartStore.getState().setConfirmForm(false);
    expect(useCartStore.getState().pendingSbpOrder?.orderId).toBe(123);
  });
});

describe('восстановление встроенной карточной формы', () => {
  it('повторяет render с тем же токеном, не создавая ещё один заказ', async () => {
    window.localStorage.setItem('setCart', JSON.stringify({ updatedAt: Date.now() }));
    useCartStore.setState({
      typeOrder: 'pic', orderPic: { id: 5 },
      typePay: { id: 'online', name: 'Картой на сайте' }, items: [{ item_id: 1, count: 1 }],
    });
    api.mockResolvedValueOnce({ st: true, order_id: 123, check: pending.check, pay: { pay: { confirmation: { confirmation_token: 'same-card-token' } } } });
    await useCartStore.getState().createOrder('user-token', 'samara');
    widgets[0].render.mockRejectedValueOnce(new Error('render failed'));
    await vi.advanceTimersByTimeAsync(301);
    expect(useCartStore.getState().cardPaymentState).toBe('error');
    await useCartStore.getState().retryCardPayment();
    await vi.advanceTimersByTimeAsync(301);
    expect(widgets).toHaveLength(2);
    expect(widgets[1].options.confirmation_token).toBe('same-card-token');
    expect(widgets[0].destroy).toHaveBeenCalled();
    expect(useCartStore.getState().cardPaymentState).toBe('ready');
    expect(api).toHaveBeenCalledTimes(1);
  });
  it('зависший render завершается состоянием ошибки и допускает ручной повтор', async () => {
    await useCartStore.getState().showCardPayment('same-card-token', {});
    widgets[0].render.mockReturnValueOnce(new Promise(() => {}));
    await vi.advanceTimersByTimeAsync(12301);
    expect(useCartStore.getState().cardPaymentState).toBe('error');
    expect(useCartStore.getState().retryCardPayment).toBeTypeOf('function');
    expect(api).not.toHaveBeenCalled();
  });
  it('закрытие формы отменяет отложенный render и удаляет возможность повтора', async () => {
    await useCartStore.getState().showCardPayment('same-card-token', {});
    useCartStore.getState().setConfirmForm(false);
    await vi.advanceTimersByTimeAsync(1000);
    expect(widgets[0].render).not.toHaveBeenCalled();
    expect(useCartStore.getState()).toMatchObject({ cardPaymentState: 'idle', retryCardPayment: null, global_checkout: null });
  });
});

describe('отмена старой платёжной формы', () => {
  it('success до завершения render остаётся окончательным состоянием', async () => {
    const original = useProfileStore.getState().saveUserActions;
    useProfileStore.setState({ saveUserActions: vi.fn() });
    try {
      await useCartStore.getState().showCardPayment('same-card-token', {});
      widgets[0].render.mockReturnValueOnce(new Promise(() => {}));
      await vi.advanceTimersByTimeAsync(301);
      const success = widgets[0].on.mock.calls.find(([event]) => event === 'success')[1];
      success();
      await vi.advanceTimersByTimeAsync(15000);
      expect(useCartStore.getState()).toMatchObject({ cardPaymentState: 'complete', retryCardPayment: null, cardRenderTimer: null });
    } finally {
      useProfileStore.setState({ saveUserActions: original });
    }
  });
  it.each(['clearCheckoutData', 'applyCityCatalog'])('%s отменяет незавершённую загрузку скрипта', async (action) => {
    delete window.YooMoneyCheckoutWidget;
    const script = new EventTarget();
    script.remove = vi.fn();
    document.querySelector = () => script;
    const close = vi.fn();
    const opening = useCartStore.getState().showCardPayment('old-token', {}, close);
    if (action === 'clearCheckoutData') useCartStore.getState().clearCheckoutData();
    else useCartStore.getState().applyCityCatalog({ all_items: [], free_items: [], need_dop: {} });
    window.YooMoneyCheckoutWidget = FakeWidget;
    script.dispatchEvent(new Event('load'));
    await opening;
    expect(widgets).toHaveLength(0);
    expect(useCartStore.getState()).toMatchObject({ cardPaymentState: 'idle', retryCardPayment: null });
    expect(close).not.toHaveBeenCalled();
  });
  it('сброс оформления отменяет поздний success старого виджета', async () => {
    const close = vi.fn();
    await useCartStore.getState().showCardPayment('old-token', {}, close);
    const success = widgets[0].on.mock.calls.find(([event]) => event === 'success')[1];
    useCartStore.getState().clearCheckoutData();
    useCartStore.setState({ items: [{ item_id: 999, count: 1 }] });
    success();
    expect(close).not.toHaveBeenCalled();
    expect(useCartStore.getState().items).toEqual([{ item_id: 999, count: 1 }]);
  });
  it('поздний ответ создания заказа после сброса не открывает виджет', async () => {
    window.localStorage.setItem('setCart', JSON.stringify({ updatedAt: Date.now() }));
    useCartStore.setState({ typeOrder: 'pic', orderPic: { id: 5 }, typePay: { id: 'online' }, items: [{ item_id: 1, count: 1 }] });
    let resolve;
    api.mockReturnValueOnce(new Promise((r) => { resolve = r; }));
    const creating = useCartStore.getState().createOrder('user-token', 'samara');
    useCartStore.getState().clearCheckoutData();
    resolve({ st: true, order_id: 123, check: pending.check, pay: { pay: { confirmation: { confirmation_token: 'old-token' } } } });
    expect(await creating).toBe('nothing');
    expect(widgets).toHaveLength(0);
    expect(useCartStore.getState().typePay).toBe(null);
    expect(api).toHaveBeenCalledTimes(1);
  });
});
