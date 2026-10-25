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
vi.mock('../../components/useYandexMetrika', () => ({ default: vi.fn(() => vi.fn()) }));
vi.mock('@sentry/nextjs', () => ({ captureMessage: vi.fn() }));
vi.mock('@/utils/metrika', () => ({
  reachGoal: vi.fn(),
  buildPurchasePayload: vi.fn((value) => value),
  trackPurchase: vi.fn(),
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
import { useCartStore, useHeaderStoreNew, useProfileStore, useCitiesStore } from '../../components/store.js';
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
  useCitiesStore.setState({ thisCity: 'samara' });
  useHeaderStoreNew.setState({ token: 'user-token', setActiveModalAlert: vi.fn() });
  useCartStore.getState().resetPaidConfirmation();
  useCartStore.setState({
    pendingSbpOrder: null,
    sbpPaymentState: 'idle',
    global_checkout: null,
    openConfirmForm: false,
    DBClick: false,
  });
});

afterEach(() => {
  useCartStore.getState().resetPaidConfirmation();
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
      .mockResolvedValueOnce({ st: true, status: 'pending' })
      .mockResolvedValueOnce({ st: true, status: 'confirmed' });
    expect(
      await useCartStore
        .getState()
        .checkSbpPaymentStatus('user-token', onSuccess)
    ).toBe('pending');
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
      expect(useCartStore.getState()).toMatchObject({ cardPaymentState: 'confirming', retryCardPayment: null, cardRenderTimer: null });
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

describe('подтверждение онлайн-заказа после виджета', () => {
  it('восстановление только по URL не очищает корзину и не повторяет аналитику покупки', async () => {
    const { trackPurchase } = await import('@/utils/metrika');
    useCartStore.setState({ items: [{ item_id: 999, count: 2 }], checkNewOrder: null });
    useCartStore.getState().registerPaidOrder({ orderId: 123, pointId: 5, city: 'samara', method: 'sbp', trackPurchase: false }, 'user-token');
    useCartStore.setState({ pendingPaidOrder: null });
    useCartStore.getState().restorePaidOrder('samara');
    api.mockImplementation(async (module, data) => data.type === 'confirm_paid_order' ? { st: true, status: 'confirmed' } :
      data.type === 'get_my_orders_new_' ? { order_list: [{ order_id: 123 }] } : { count_orders: 1, count_promo: 0 });
    await useCartStore.getState().startPaidConfirmation();
    expect(useCartStore.getState().paidConfirmationState).toBe('confirmed');
    expect(useCartStore.getState().items).toEqual([{ item_id: 999, count: 2 }]);
    expect(trackPurchase).not.toHaveBeenCalled();
    expect(api.mock.calls.some(([, data]) => data.type === 'get_order' || data.type === 'create_order_pre')).toBe(false);
  });
  async function openCard({ restore = false } = {}) {
    window.localStorage.setItem('setCart', JSON.stringify({ updatedAt: Date.now() }));
    useCartStore.setState({ typeOrder: 'pic', orderPic: { id: 5 }, typePay: { id: 'online', name: 'Картой на сайте' }, items: [{ item_id: 1, count: 1 }] });
    let confirmed = false;
    api.mockImplementation(async (module, data) => {
      if (data.type === 'create_order_pre') return { st: true, order_id: 123, check: { order: { order_id: 123, point_id: 5, type_order_: 2, sum_order: 100 }, items: [{ id: 1, name: 'Товар', count: 1, price: 100 }] }, pay: { pay: { confirmation: { confirmation_token: 'card-token' } } } };
      if (data.type === 'confirm_paid_order') return { st: true, status: confirmed ? 'confirmed' : 'pending' };
      if (data.type === 'get_my_orders_new_') return { order_list: [{ order_id: 123 }] };
      if (data.type === 'get_my_count_orders_promos') return { count_orders: 1, count_promo: 0 };
      if (data.type === 'get_order') return { order: { order_id: 123, type_order_: 2, sum_order: 100 }, order_items: [{ id: 888, item_id: 1, name: 'Товар', count: 1, price: 100 }] };
      return { st: true };
    });
    const callback = vi.fn();
    await useCartStore.getState().createOrder('user-token', 'samara', callback);
    const success = widgets[0].on.mock.calls.find(([event]) => event === 'success')[1];
    success(); await vi.advanceTimersByTimeAsync(1);
    expect(useCartStore.getState().paidConfirmationState).toBe('checking');
    expect(callback).not.toHaveBeenCalled();
    return { confirm: () => { confirmed = true; }, callback, success };
  }
  it('закрытие модалки продолжает проверку, после confirmed сразу обновляет историю', async () => {
    const h = await openCard();
    useCartStore.getState().setConfirmForm(false);
    h.confirm(); await vi.advanceTimersByTimeAsync(3000);
    expect(useCartStore.getState().paidConfirmationState).toBe('confirmed');
    expect(useProfileStore.getState().orderList).toEqual([{ order_id: 123 }]);
    expect(useProfileStore.getState().count_orders).toBe(1);
    expect(api.mock.calls.filter(([, data]) => data.type === 'create_order_pre')).toHaveLength(1);
  });
  it('позднее подтверждение не удаляет новые товары из корзины', async () => {
    const h = await openCard(); useCartStore.getState().setConfirmForm(false);
    useCartStore.setState({ items: [{ item_id: 999, count: 1 }] });
    h.confirm(); await vi.advanceTimersByTimeAsync(3000);
    expect(useCartStore.getState().items).toEqual([{ item_id: 999, count: 1 }]);
  });
  it('после восстановления читает серверный состав и отправляет аналитику один раз', async () => {
    const { trackPurchase } = await import('@/utils/metrika');
    const h = await openCard(); useCartStore.getState().pausePaidConfirmation();
    useCartStore.setState({ pendingPaidOrder: null, checkNewOrder: null });
    useCartStore.getState().restorePaidOrder('samara'); h.confirm();
    await useCartStore.getState().startPaidConfirmation();
    expect(trackPurchase).toHaveBeenCalledTimes(1);
    expect(trackPurchase).toHaveBeenCalledWith(expect.objectContaining({ items: [expect.objectContaining({ id: 1, name: 'Товар', price: 100, quantity: 1 })] }));
    await useCartStore.getState().checkPaidOrder();
    expect(trackPurchase).toHaveBeenCalledTimes(1);
    expect(useCartStore.getState().items).toEqual([]);
  });
  it('смена аккаунта после виджета отменяет позднее подтверждение и очищает контекст', async () => {
    const h = await openCard(); useHeaderStoreNew.setState({ token: 'another-account' });
    h.confirm(); await vi.advanceTimersByTimeAsync(6000);
    expect(useCartStore.getState().pendingPaidOrder).toBeNull();
    expect(window.sessionStorage.getItem('jaco_pending_paid_order')).toBeNull();
    expect(useProfileStore.getState().orderList).toEqual([]);
  });
});

describe('подтверждение оплаты при получении', () => {
  it.each(['togliatti', 'samara'])('сразу обновляет историю и счётчик в городе %s', async (city) => {
    useCitiesStore.setState({ thisCity: city });
    api.mockImplementation(async (module, data) => {
      if (data.type === 'order_true') return { st: true };
      if (data.type === 'get_my_orders_new_') return { order_list: [{ order_id: 321 }] };
      if (data.type === 'get_my_count_orders_promos') return { count_orders: 1, count_promo: 0 };
      return { st: true };
    });
    expect(await useCartStore.getState().trueOrderCash('user-token', 2, 321)).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    expect(useProfileStore.getState().orderList).toEqual([{ order_id: 321 }]);
    expect(useProfileStore.getState().count_orders).toBe(1);
    expect(api).not.toHaveBeenCalledWith('cart', expect.objectContaining({ type: 'confirm_paid_order' }));
  });
});
