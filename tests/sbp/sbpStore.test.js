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

import { api, trackPaymentClientEvent } from '../../components/api.js';
import { clearCardCheckoutRequest, readCardCheckoutRequest, saveCardCheckoutRequest, cardCheckoutFingerprint } from '@/utils/cardCheckout';
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
  clearCardCheckoutRequest('user-token');
  clearCardCheckoutRequest('another-account');
  useCartStore.getState().resetCardPreflight();
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
    expect(useCartStore.getState().pendingSbpOrder).toBeNull();
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

describe('проверка формы до создания карточного платежа', () => {
  const hostedUrl = 'https://yookassa.ru/payments/hosted-first';
  function checkout() {
    window.localStorage.setItem('setCart', JSON.stringify({ updatedAt: Date.now() }));
    useCartStore.setState({
      typeOrder: 'pic', orderPic: { id: 5 }, typePay: { id: 'online' },
      items: [{ item_id: 1, count: 1 }], allPrice: 100,
    });
  }
  function failingScript() {
    delete window.YooMoneyCheckoutWidget;
    const script = new EventTarget();
    script.remove = vi.fn(); document.querySelector = () => script;
    return script;
  }
  async function failAttempt() {
    const script = failingScript();
    const opening = useCartStore.getState().createOrder('user-token', 'samara');
    script.dispatchEvent(new Event('error'));
    expect(await opening).toBe('wait_payment');
  }
  function successResponse(confirmation = { confirmation_token: 'card-token' }) {
    return { st: true, order_id: 123, check: pending.check, pay: { pay: { confirmation } } };
  }

  it('две ошибки загрузки не создают заказ и разрешают переход на страницу провайдера', async () => {
    checkout(); await failAttempt();
    expect(useCartStore.getState()).toMatchObject({ cardPreflightState: 'error', cardScriptFailures: 1 });
    await failAttempt();
    expect(useCartStore.getState()).toMatchObject({ cardPreflightState: 'error', cardScriptFailures: 2 });
    expect(api).not.toHaveBeenCalled();
    expect(readCardCheckoutRequest('user-token')).toBeNull();
  });

  it('после повторной успешной загрузки создаёт один прежний embedded-платёж', async () => {
    checkout(); await failAttempt(); window.YooMoneyCheckoutWidget = FakeWidget;
    api.mockResolvedValueOnce(successResponse());
    await useCartStore.getState().cardPreflightRetry();
    expect(api).toHaveBeenCalledTimes(1);
    expect(api.mock.calls[0][1]).not.toHaveProperty('payment_confirmation');
    expect(useCartStore.getState().cardPreflightState).toBe('idle');
    expect(widgets).toHaveLength(1);
  });

  it('двойное нажатие hosted создаёт первый платёж один раз и повторно открывает тот же URL', async () => {
    checkout(); await failAttempt(); await failAttempt();
    let resolve;
    api.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const select = useCartStore.getState().cardPreflightHosted;
    const first = select(); const second = select();
    expect(api).toHaveBeenCalledTimes(1);
    expect(api.mock.calls[0][1]).toMatchObject({ typePay: 'online', payment_confirmation: 'redirect' });
    resolve(successResponse({ type: 'redirect', confirmation_url: hostedUrl }));
    await first; await second;
    expect(widgets).toHaveLength(0);
    expect(redirect).toHaveBeenCalledWith(hostedUrl);
    await select();
    expect(api).toHaveBeenCalledTimes(1);
    expect(useCartStore.getState().pendingPaidOrder).toMatchObject({ orderId: 123, pointId: 5, method: 'online' });
  });

  it.each(['отказ', 'отклонённый Promise'])('не повторяет отправленный POST после неоднозначного результата: %s', async (kind) => {
    checkout();
    if (kind === 'отказ') api.mockResolvedValueOnce({ st: false, text: 'Сервис временно недоступен' });
    else api.mockRejectedValueOnce(new Error('network response lost'));
    expect(await useCartStore.getState().createOrder('user-token', 'samara')).toBe('wait_payment');
    expect(useCartStore.getState()).toMatchObject({ DBClick: false, cardPreflightState: 'uncertain' });
    expect(await useCartStore.getState().createOrder('user-token', 'samara')).toBe('wait_payment');
    expect(api).toHaveBeenCalledTimes(1);
  });

  it('из ошибки сервера с payment_order восстанавливает только проверку того же заказа', async () => {
    checkout(); await failAttempt(); await failAttempt();
    api.mockResolvedValueOnce({ st: false, text: 'Не удалось подготовить оплату', payment_order: { point_id: 5, order_id: 123 } });
    await useCartStore.getState().cardPreflightHosted();
    expect(useCartStore.getState()).toMatchObject({ cardPreflightState: 'existing', cardPreflightMessage: 'Не удалось подготовить оплату' });
    expect(useCartStore.getState().pendingPaidOrder).toMatchObject({ pointId: 5, orderId: 123 });
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(api).toHaveBeenCalledTimes(1);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('позволяет исправить данные только при явном подтверждении сервера, что запись не начиналась', async () => {
    checkout(); api.mockResolvedValueOnce({ st: false, text: 'Проверьте email', checkout_attempt: 'not_started' });
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(api.mock.calls[0][1].checkout_guard).toBe(1);
    expect(readCardCheckoutRequest('user-token')).toBeNull();
    expect(useCartStore.getState().cardPreflightState).toBe('rejected');
    useCartStore.getState().setConfirmForm(false);
    api.mockResolvedValueOnce(successResponse());
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(api).toHaveBeenCalledTimes(2);
  });

  it('не создаёт hosted-платёж, если маркер нельзя сохранить для перезагрузки', async () => {
    checkout(); await failAttempt(); await failAttempt();
    window.sessionStorage.setItem = () => { throw new Error('storage blocked'); };
    await useCartStore.getState().cardPreflightHosted();
    expect(useCartStore.getState().cardPreflightState).toBe('storage_error');
    expect(api).not.toHaveBeenCalled();
    expect(readCardCheckoutRequest('user-token')).toBeNull();
  });

  it.each(['account', 'city', 'method', 'address', 'items', 'date'])('поздняя загрузка после изменения %s не отправляет POST', async (change) => {
    checkout(); const script = failingScript();
    const preparing = useCartStore.getState().createOrder('user-token', 'samara');
    if (change === 'account') useHeaderStoreNew.setState({ token: 'another-account' });
    if (change === 'city') useCitiesStore.setState({ thisCity: 'togliatti' });
    if (change === 'method') useCartStore.setState({ typePay: { id: 'cash' } });
    if (change === 'address') useCartStore.setState({ orderPic: { id: 7 } });
    if (change === 'items') useCartStore.setState({ items: [{ item_id: 99, count: 2 }] });
    if (change === 'date') useCartStore.setState({ dateTimeOrder: { date: '2026-12-01' } });
    window.YooMoneyCheckoutWidget = FakeWidget; script.dispatchEvent(new Event('load'));
    expect(await preparing).toBe('nothing');
    expect(api).not.toHaveBeenCalled();
  });

  it('не заменяет уже созданный embedded-платёж hosted-платежом', async () => {
    checkout(); api.mockResolvedValueOnce(successResponse());
    await useCartStore.getState().createOrder('user-token', 'samara');
    await vi.advanceTimersByTimeAsync(301);
    useCartStore.setState({ cardScriptFailures: 2 });
    await useCartStore.getState().createOrder('user-token', 'samara', undefined, { confirmation: 'redirect' });
    expect(api).toHaveBeenCalledTimes(1);
    expect(widgets).toHaveLength(2);
    expect(widgets[1].options.confirmation_token).toBe('card-token');
  });

  it('после закрытия формы новое оформление создаёт новый embedded-платёж', async () => {
    checkout(); api.mockResolvedValueOnce(successResponse());
    await useCartStore.getState().createOrder('user-token', 'samara');
    useCartStore.getState().setConfirmForm(false);
    api.mockResolvedValueOnce({ ...successResponse(), check: { order: { point_id: 5, order_id: 124 } } });
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(api).toHaveBeenCalledTimes(2);
    expect(widgets).toHaveLength(2);
    expect(useCartStore.getState().pendingPaidOrder.orderId).toBe(124);
  });

  it.each(['idle', 'checking', 'timeout', 'canceled'])('старый платёж %s и восстановленный маркер не блокируют новый заказ', async (state) => {
    checkout();
    useCartStore.getState().registerPaidOrder({ ...pending, method: 'online' }, 'user-token');
    useCartStore.setState({ paidConfirmationState: state });
    saveCardCheckoutRequest('user-token', {
      city: 'samara', confirmation: 'embedded',
      fingerprint: cardCheckoutFingerprint(useCartStore.getState(), 'user-token', 'samara'),
      reference: { pointId: 5, orderId: 123 },
    });
    api.mockResolvedValueOnce({ ...successResponse(), check: { order: { point_id: 5, order_id: 124 } } });
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(api).toHaveBeenCalledTimes(1);
    expect(api.mock.calls[0][1].type).toBe('create_order_pre');
    expect(useCartStore.getState().pendingPaidOrder.orderId).toBe(124);
  });

  it.each(['cash', 'sbp'])('старое подтверждение не относится к новому заказу с оплатой %s', async (method) => {
    checkout();
    useCartStore.getState().registerPaidOrder({ ...pending, method: 'online' }, 'user-token');
    useCartStore.setState({ paidConfirmationState: 'timeout', typePay: { id: method } });
    api.mockResolvedValueOnce({ st: true, check: { order: { point_id: 5, order_id: 124 } },
      pay: { pay: { confirmation: { confirmation_url: 'https://yoomoney.ru/checkout/payments/v2/contract?orderId=new' } } } });
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(api).toHaveBeenCalledTimes(1);
    expect(useCartStore.getState().paidConfirmationState).toBe('idle');
    expect(useCartStore.getState().pendingPaidOrder?.orderId ?? null).toBe(method === 'sbp' ? 124 : null);
  });

  it('поздний ответ старой проверки не очищает корзину нового оформления', async () => {
    checkout();
    let finish;
    useCartStore.getState().registerPaidOrder({ ...pending, method: 'online' }, 'user-token');
    api.mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
    const old = useCartStore.getState().startPaidConfirmation();
    await Promise.resolve();
    api.mockResolvedValueOnce({ ...successResponse(), check: { order: { point_id: 5, order_id: 124 } } });
    await useCartStore.getState().createOrder('user-token', 'samara');
    finish({ st: true, status: 'confirmed' }); await old;
    expect(useCartStore.getState().pendingPaidOrder.orderId).toBe(124);
    expect(useCartStore.getState().items).toEqual([{ item_id: 1, count: 1 }]);
    expect(useCartStore.getState().paidConfirmationState).toBe('idle');
  });

  it('сброс оформления не допускает второй запрос, пока первый POST ещё выполняется', async () => {
    checkout(); let finish;
    api.mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
    const first = useCartStore.getState().createOrder('user-token', 'samara');
    await Promise.resolve(); await Promise.resolve();
    expect(api).toHaveBeenCalledTimes(1);
    useCartStore.getState().clearCheckoutData(); checkout();
    expect(await useCartStore.getState().createOrder('user-token', 'samara')).toBe('nothing');
    expect(api).toHaveBeenCalledTimes(1);
    finish(successResponse()); await first;
    api.mockResolvedValueOnce(successResponse());
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(api).toHaveBeenCalledTimes(2);
  });

  it.each([false, true])('повтор из истории отделяет старую попытку оплаты, мобильный режим %s', async (mobile) => {
    checkout(); api.mockResolvedValueOnce(successResponse());
    await useCartStore.getState().createOrder('user-token', 'samara');
    const original = useCartStore.getState();
    const profile = useProfileStore.getState();
    const header = useHeaderStoreNew.getState();
    useCartStore.setState({ allItems: [{ id: 1, price: 100 }], getInfoPromo: vi.fn(), getItems: vi.fn() });
    useProfileStore.setState({ closeOrder: vi.fn(), saveUserActions: vi.fn() });
    useHeaderStoreNew.setState({ matches: mobile, setActiveBasket: vi.fn() });
    try {
      useCartStore.getState().repeatOrder({ order: { order_id: 123, point_id: 5, type_order_: 2, pic_info: { id: 5 } }, order_items: [{ item_id: 1, count: 1 }] });
      expect(useCartStore.getState().cardCheckoutAttemptActive).toBe(false);
      expect(useCartStore.getState().pendingPaidOrder).toBeNull();
      expect(readCardCheckoutRequest('user-token')).toBeNull();
      api.mockResolvedValueOnce({ ...successResponse(), check: { order: { point_id: 5, order_id: 124 } } });
      await useCartStore.getState().createOrder('user-token', 'samara');
      expect(api.mock.calls.filter(([, data]) => data.type === 'create_order_pre')).toHaveLength(2);
      expect(useCartStore.getState().pendingPaidOrder.orderId).toBe(124);
    } finally {
      useCartStore.setState({ getInfoPromo: original.getInfoPromo, getItems: original.getItems });
      useProfileStore.setState({ closeOrder: profile.closeOrder, saveUserActions: profile.saveUserActions });
      useHeaderStoreNew.setState({ matches: header.matches, setActiveBasket: header.setActiveBasket });
    }
  });

  it('старый preflight не снимает блокировку нового аккаунта с выполняющимся POST', async () => {
    checkout(); const script = failingScript();
    const old = useCartStore.getState().createOrder('user-token', 'samara');
    useHeaderStoreNew.setState({ token: 'another-account' });
    checkout(); window.YooMoneyCheckoutWidget = FakeWidget;
    let resolve; api.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const current = useCartStore.getState().createOrder('another-account', 'samara');
    await Promise.resolve(); await Promise.resolve();
    expect(useCartStore.getState()).toMatchObject({ DBClick: true, cardPreflightState: 'creating' });
    script.dispatchEvent(new Event('error')); await old;
    expect(useCartStore.getState()).toMatchObject({ DBClick: true, cardPreflightState: 'creating' });
    resolve(successResponse()); await current;
  });

  it('старый callback после смены аккаунта не подменяет чужой pending-заказ', async () => {
    checkout(); await failAttempt();
    const oldRetry = useCartStore.getState().cardPreflightRetry;
    const oldHosted = useCartStore.getState().cardPreflightHosted;
    useHeaderStoreNew.setState({ token: 'another-account' });
    useCartStore.getState().registerPaidOrder({ orderId: 777, pointId: 7, city: 'samara', method: 'online' }, 'another-account');
    const current = useCartStore.getState().pendingPaidOrder;
    await oldRetry(); await oldHosted();
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(useCartStore.getState().pendingPaidOrder).toBe(current);
    expect(api).not.toHaveBeenCalled();
  });

  it.each(['confirmed', 'canceled'])('после проверенного %s старый pending не блокирует новое оформление', async (state) => {
    checkout(); useCartStore.getState().registerPaidOrder({ ...pending, method: 'online' }, 'user-token');
    useCartStore.setState({ paidConfirmationState: state });
    api.mockResolvedValueOnce(successResponse());
    await useCartStore.getState().createOrder('user-token', 'samara');
    expect(api).toHaveBeenCalledTimes(1);
  });
});

describe('восстановление встроенной карточной формы', () => {
  it('записывает адрес скрипта и время ожидания при ошибке загрузки', async () => {
    delete window.YooMoneyCheckoutWidget;
    const script = new EventTarget();
    script.remove = vi.fn();
    document.querySelector = () => script;
    const opening = useCartStore.getState().showCardPayment('card-token', {
      payment_flow_id: 'payment-flow', point_id: 5, order_id: 123,
    });
    await vi.advanceTimersByTimeAsync(12000);
    await opening;
    expect(trackPaymentClientEvent).toHaveBeenCalledWith('widget_script_failed', expect.objectContaining({
      payment_flow_id: 'payment-flow', point_id: 5, order_id: 123,
      script_host: 'yookassa.ru', script_path: '/checkout-widget/v1/checkout-widget.js',
      duration_ms: 12000, outcome: 'error', reason: 'script_timeout',
    }));
    expect(api).not.toHaveBeenCalled();
  });

  it('передаёт безопасный код callback без сырых данных виджета', async () => {
    await useCartStore.getState().showCardPayment('card-token', { payment_flow_id: 'payment-flow' });
    widgets[0].options.error_callback({ error: { code: 'token_expired' }, confirmation_token: 'private' });
    expect(trackPaymentClientEvent).toHaveBeenCalledWith('widget_error', expect.objectContaining({
      provider_error_code: 'token_expired', outcome: 'error', reason: 'widget_callback',
    }));
    expect(JSON.stringify(trackPaymentClientEvent.mock.calls)).not.toContain('private');
  });

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

describe('страница ЮKassa, когда встроенная форма не открылась', () => {
  const hostedUrl = 'https://yookassa.ru/payments/hosted-after-form';
  const embedded = { st: true, order_id: 123, check: pending.check, pay: { pay: { confirmation: { confirmation_token: 'card-token' } } } };
  const hosted = {
    st: true, order_id: 124, check: { order: { point_id: 5, order_id: 124 } },
    pay: { pay: { confirmation: { type: 'redirect', confirmation_url: hostedUrl } } },
  };
  async function openForm({ hung }) {
    window.localStorage.setItem('setCart', JSON.stringify({ updatedAt: Date.now() }));
    useCartStore.setState({
      typeOrder: 'pic', orderPic: { id: 5 }, typePay: { id: 'online' },
      items: [{ item_id: 1, count: 1 }], allPrice: 100,
    });
    if (hung) {
      window.YooMoneyCheckoutWidget = class extends FakeWidget {
        constructor(options) { super(options); this.render = vi.fn(() => new Promise(() => {})); }
      };
    }
    api.mockResolvedValueOnce(embedded);
    await useCartStore.getState().createOrder('user-token', 'samara');
    await vi.advanceTimersByTimeAsync(hung ? 12301 : 301);
  }

  it('зависшая форма предлагает страницу ЮKassa и создаёт для неё новый заказ', async () => {
    await openForm({ hung: true });
    expect(useCartStore.getState()).toMatchObject({ cardPaymentState: 'error', cardHostedFallback: 'widget_timeout' });
    api.mockResolvedValueOnce(hosted);
    expect(await useCartStore.getState().payCardOnHostedPage()).toBe('wait_payment');
    expect(api).toHaveBeenCalledTimes(2);
    expect(api.mock.calls[0][1]).not.toHaveProperty('payment_confirmation');
    expect(api.mock.calls[1][1]).toMatchObject({ type: 'create_order_pre', typePay: 'online', payment_confirmation: 'redirect' });
    expect(widgets).toHaveLength(1);
    expect(widgets[0].destroy).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(hostedUrl);
    expect(useCartStore.getState().pendingPaidOrder).toMatchObject({ orderId: 124, pointId: 5, method: 'online' });
    expect(trackPaymentClientEvent).toHaveBeenCalledWith('widget_render_timeout', expect.objectContaining({
      order_id: 123, reason: 'widget_timeout', widget_attempt: 1,
    }));
    // Уход на страницу ЮKassa: причина, число неудачных показов и заказ со сбоем формы.
    expect(trackPaymentClientEvent).toHaveBeenCalledWith('hosted_payment_selected', expect.objectContaining({
      payment_confirmation: 'redirect', reason: 'widget_timeout', widget_attempt: 1, point_id: 5, order_id: 123,
    }));
  });

  it('повтор, который тоже не открылся, и уход после него получают номер попытки 2', async () => {
    await openForm({ hung: true });
    await useCartStore.getState().retryCardPayment();
    await vi.advanceTimersByTimeAsync(12301);
    expect(useCartStore.getState()).toMatchObject({ cardPaymentState: 'error', cardHostedFallback: 'widget_timeout' });
    const timeouts = trackPaymentClientEvent.mock.calls.filter(([stage]) => stage === 'widget_render_timeout');
    expect(timeouts.map(([, details]) => details.widget_attempt)).toEqual([1, 2]);
    expect(trackPaymentClientEvent).toHaveBeenCalledWith('widget_render_started', expect.objectContaining({ widget_attempt: 2 }));
    api.mockResolvedValueOnce(hosted);
    await useCartStore.getState().payCardOnHostedPage();
    expect(trackPaymentClientEvent).toHaveBeenCalledWith('hosted_payment_selected', expect.objectContaining({
      reason: 'widget_timeout', widget_attempt: 2, order_id: 123,
    }));
    expect(api).toHaveBeenCalledTimes(2);
  });

  it('форма нового заказа снова считается первой попыткой', async () => {
    await openForm({ hung: true });
    useCartStore.getState().setConfirmForm(false);
    api.mockResolvedValueOnce({ ...embedded, order_id: 124, check: { order: { point_id: 5, order_id: 124 } } });
    await useCartStore.getState().createOrder('user-token', 'samara');
    await vi.advanceTimersByTimeAsync(12301);
    const timeouts = trackPaymentClientEvent.mock.calls.filter(([stage]) => stage === 'widget_render_timeout');
    expect(timeouts.map(([, details]) => [details.order_id, details.widget_attempt])).toEqual([[123, 1], [124, 1]]);
  });

  it('двойное нажатие создаёт один заказ со страницей ЮKassa', async () => {
    await openForm({ hung: true });
    let resolve;
    api.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const first = useCartStore.getState().payCardOnHostedPage();
    expect(await useCartStore.getState().payCardOnHostedPage()).toBe('nothing');
    resolve(hosted); await first;
    expect(api).toHaveBeenCalledTimes(2);
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it('повтор загрузки формы убирает предложение до нового сбоя', async () => {
    await openForm({ hung: true });
    void useCartStore.getState().retryCardPayment();
    expect(useCartStore.getState()).toMatchObject({ cardPaymentState: 'loading', cardHostedFallback: null });
    expect(await useCartStore.getState().payCardOnHostedPage()).toBe('nothing');
    expect(api).toHaveBeenCalledTimes(1);
  });

  it('отказ банка в открытой форме страницу ЮKassa не предлагает', async () => {
    await openForm({ hung: false });
    expect(useCartStore.getState().cardPaymentState).toBe('ready');
    widgets[0].on.mock.calls.find(([event]) => event === 'fail')[1]({});
    expect(useCartStore.getState()).toMatchObject({ cardPaymentState: 'error', cardHostedFallback: null });
    expect(await useCartStore.getState().payCardOnHostedPage()).toBe('nothing');
    expect(api).toHaveBeenCalledTimes(1);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('без надёжного хранилища заказ для страницы ЮKassa не создаётся', async () => {
    await openForm({ hung: true });
    window.sessionStorage.setItem = () => { throw new Error('storage blocked'); };
    await useCartStore.getState().payCardOnHostedPage();
    expect(useCartStore.getState().cardPreflightState).toBe('storage_error');
    expect(api).toHaveBeenCalledTimes(1);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('закрытие формы убирает предложение', async () => {
    await openForm({ hung: true });
    useCartStore.getState().setConfirmForm(false);
    expect(useCartStore.getState().cardHostedFallback).toBeNull();
    expect(await useCartStore.getState().payCardOnHostedPage()).toBe('nothing');
    expect(api).toHaveBeenCalledTimes(1);
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
    await Promise.resolve(); await Promise.resolve();
    expect(api).toHaveBeenCalledTimes(1);
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
