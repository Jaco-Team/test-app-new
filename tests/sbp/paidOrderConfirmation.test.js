import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { createPaidOrderConfirmation, readPendingPaidOrder } from '@/utils/paidOrderConfirmation';
import { createOrderHistoryActions } from '@/utils/orderHistory';

const order = { orderId: 974631, pointId: 2, city: 'togliatti', method: 'online' };
const deferred = () => { let resolve; const promise = new Promise((r) => { resolve = r; }); return { promise, resolve }; };
function storage() { const values = new Map(); return { getItem: (k) => values.get(k) ?? null, setItem: (k, v) => values.set(k, String(v)), removeItem: (k) => values.delete(k) }; }
function harness() {
  let state = {};
  const session = { token: 'account-a', city: 'togliatti' };
  const request = vi.fn().mockResolvedValue({ st: true, status: 'pending' });
  const confirmed = vi.fn();
  const set = (value) => { state = { ...state, ...value }; };
  const actions = createPaidOrderConfirmation({ set, get: () => state, request, getToken: () => session.token, getCity: () => session.city, onConfirmed: confirmed });
  set(actions);
  return { actions, session, request, confirmed, get: () => state, set };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-24T08:00:00Z'));
  vi.stubGlobal('window', { sessionStorage: storage(), localStorage: storage() });
});
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('подтверждение оплаты на сервере', () => {
  it('не считает success виджета подтверждением, опрашивает раз в 3 секунды', async () => {
    const h = harness();
    h.actions.registerPaidOrder(order, h.session.token, { order: { order_id: order.orderId } });
    await h.actions.startPaidConfirmation();
    expect(h.request).toHaveBeenCalledWith('cart', { type: 'confirm_paid_order', __retryAttempts: 1, token: 'account-a', point_id: 2, order_id: 974631 });
    expect(h.confirmed).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2999);
    expect(h.request).toHaveBeenCalledTimes(1);
    h.request.mockResolvedValue({ st: true, status: 'confirmed' });
    await vi.advanceTimersByTimeAsync(1);
    expect(h.confirmed).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(10000);
    await h.actions.checkPaidOrder();
    expect(h.confirmed).toHaveBeenCalledTimes(1);
    expect(h.get().paidConfirmationState).toBe('confirmed');
  });
  it('не запускает параллельные запросы и не подтверждает отменённый заказ', async () => {
    const h = harness(); const response = deferred(); h.request.mockReturnValue(response.promise);
    h.actions.registerPaidOrder(order, h.session.token);
    const a = h.actions.startPaidConfirmation();
    h.actions.startPaidConfirmation(); h.actions.checkPaidOrder();
    await vi.advanceTimersByTimeAsync(9000);
    expect(h.request).toHaveBeenCalledTimes(1);
    response.resolve({ st: true, status: 'canceled' }); await a;
    expect(h.get().paidConfirmationState).toBe('canceled');
    expect(h.confirmed).not.toHaveBeenCalled();
  });
  it('через минуту останавливается, ручной повтор проверяет тот же заказ', async () => {
    const h = harness(); h.actions.registerPaidOrder(order, h.session.token);
    await h.actions.startPaidConfirmation(); await vi.advanceTimersByTimeAsync(60000);
    expect(h.get().paidConfirmationState).toBe('timeout');
    const calls = h.request.mock.calls.length; await vi.advanceTimersByTimeAsync(30000);
    expect(h.request).toHaveBeenCalledTimes(calls);
    h.request.mockResolvedValue({ st: true, status: 'confirmed' });
    await h.actions.startPaidConfirmation({ retry: true });
    expect(h.confirmed).toHaveBeenCalledTimes(1);
    expect(h.request.mock.calls.every(([, data]) => data.type === 'confirm_paid_order' && data.order_id === order.orderId)).toBe(true);
  });
  it('зависший запрос не обходит минутный предел и не дублируется ручным повтором', async () => {
    const h = harness(); const response = deferred(); h.request.mockReturnValue(response.promise);
    h.actions.registerPaidOrder(order, h.session.token); const promise = h.actions.startPaidConfirmation();
    await vi.advanceTimersByTimeAsync(60000);
    expect(h.get().paidConfirmationState).toBe('timeout');
    const retry = h.actions.startPaidConfirmation({ retry: true });
    expect(h.request).toHaveBeenCalledTimes(1);
    response.resolve({ st: true, status: 'confirmed' }); await promise; await retry;
    expect(h.request).toHaveBeenCalledTimes(1); expect(h.confirmed).toHaveBeenCalledTimes(1);
  });
  it.each([null, { st: false, text: 'Ошибка' }, { st: true, status: 'unexpected' }])('при недоступности API сохраняет контекст: %j', async (response) => {
    const h = harness(); h.request.mockResolvedValue(response); h.actions.registerPaidOrder(order, h.session.token);
    await h.actions.startPaidConfirmation(); expect(h.get().pendingPaidOrder.orderId).toBe(order.orderId);
    expect(h.get().paidConfirmationMessage).toContain('повторно оплачивать'); expect(h.confirmed).not.toHaveBeenCalled();
  });
  it('при сетевой ошибке продолжает проверку', async () => {
    const h = harness(); h.request.mockRejectedValue(new Error('offline')); h.actions.registerPaidOrder(order, h.session.token);
    await h.actions.startPaidConfirmation(); await vi.advanceTimersByTimeAsync(3000);
    expect(h.request).toHaveBeenCalledTimes(2); expect(h.confirmed).not.toHaveBeenCalled();
  });
  it.each(['account', 'city', 'new-order', 'signout'])('игнорирует позднее подтверждение после %s', async (change) => {
    const h = harness(); const response = deferred(); h.request.mockReturnValue(response.promise);
    h.actions.registerPaidOrder(order, h.session.token); const promise = h.actions.startPaidConfirmation(); await Promise.resolve();
    if (change === 'account') h.session.token = 'account-b';
    if (change === 'city') h.session.city = 'samara';
    if (change === 'new-order') h.actions.registerPaidOrder({ ...order, orderId: 999 }, h.session.token);
    if (change === 'signout') h.actions.resetPaidConfirmation();
    response.resolve({ st: true, status: 'confirmed' }); await promise;
    expect(h.confirmed).not.toHaveBeenCalled();
  });
  it('пауза при смене города не запускает параллельный запрос при возвращении', async () => {
    const h = harness(); const response = deferred(); h.request.mockReturnValueOnce(response.promise);
    h.actions.registerPaidOrder(order, h.session.token); const first = h.actions.startPaidConfirmation(); await Promise.resolve();
    h.actions.pausePaidConfirmation(); const resumed = h.actions.startPaidConfirmation();
    expect(h.request).toHaveBeenCalledTimes(1);
    response.resolve({ st: true, status: 'confirmed' }); await first; await resumed;
    expect(h.request).toHaveBeenCalledTimes(2); expect(h.confirmed).not.toHaveBeenCalled();
  });
  it('восстанавливает минимальный контекст после перезагрузки и продолжает проверку', async () => {
    const h = harness(); h.actions.registerPaidOrder({ ...order, retryToken: 'secret' }, h.session.token, { order: { street: 'Личный адрес' } });
    await h.actions.startPaidConfirmation(); h.actions.pausePaidConfirmation();
    const stored = window.sessionStorage.getItem('jaco_pending_paid_order');
    expect(stored).not.toContain('secret'); expect(stored).not.toContain('account-a'); expect(stored).not.toContain('Личный адрес');
    const next = harness(); expect(next.actions.restorePaidOrder('togliatti')?.orderId).toBe(order.orderId);
    next.request.mockResolvedValue({ st: true, status: 'confirmed' }); await next.actions.startPaidConfirmation();
    expect(next.confirmed).toHaveBeenCalledTimes(1);
  });
  it('не восстанавливает заказ другого аккаунта', () => {
    const h = harness(); h.actions.registerPaidOrder(order, h.session.token);
    expect(readPendingPaidOrder('another-account')).toBeNull();
    expect(window.sessionStorage.getItem('jaco_pending_paid_order')).toBeNull();
  });
  it('перезагрузка не сбрасывает минутное окно ожидания', async () => {
    const h = harness(); h.actions.registerPaidOrder(order, h.session.token); await h.actions.startPaidConfirmation();
    h.actions.pausePaidConfirmation(); await vi.advanceTimersByTimeAsync(61000);
    const next = harness(); next.actions.restorePaidOrder('togliatti'); await next.actions.startPaidConfirmation();
    expect(next.get().paidConfirmationState).toBe('timeout'); expect(next.request).not.toHaveBeenCalled();
  });
});

describe('загрузка истории заказов', () => {
  function history() {
    let state = {}; const session = { token: 'a', city: 'togliatti' }; const request = vi.fn();
    const actions = createOrderHistoryActions({ set: (v) => { state = { ...state, ...v }; }, get: () => state, request, getToken: () => session.token, getCity: () => session.city });
    state = { ...actions }; return { actions, request, session, get: () => state, load: (options) => actions.getOrderList('zakazy', session.city, session.token, options) };
  }
  it('различает загрузку, успешный пустой список и ошибку', async () => {
    const h = history(); h.request.mockResolvedValue({ order_list: [] }); const loading = h.load();
    expect(h.get().orderListState).toBe('loading'); await loading; expect(h.get().orderListState).toBe('ready');
    h.request.mockRejectedValue(new Error('offline')); await h.load(); expect(h.get().orderListState).toBe('error');
  });
  it.each([null, { st: false }, { order_list: [], $user: null }])('при ошибке %j сохраняет предыдущую историю', async (value) => {
    const h = history(); h.request.mockResolvedValueOnce({ order_list: [{ order_id: 7 }] }).mockResolvedValueOnce(value);
    await h.load(); await h.load(); expect(h.get().orderList).toEqual([{ order_id: 7 }]); expect(h.get().orderListState).toBe('error');
  });
  it('объединяет одинаковые запросы и позволяет ручной повтор', async () => {
    const h = history(); const response = deferred(); h.request.mockReturnValue(response.promise);
    const a = h.load(); const b = h.load(); expect(a).toBe(b); await Promise.resolve(); expect(h.request).toHaveBeenCalledTimes(1);
    response.resolve({ order_list: [] }); await a; h.request.mockResolvedValue({ order_list: [{ order_id: 9 }] }); await h.load({ force: true });
    expect(h.get().orderList).toEqual([{ order_id: 9 }]);
  });
  it('после подтверждения старый запрос не перезаписывает новую историю', async () => {
    const h = history(); const old = deferred(); h.request.mockReturnValueOnce(old.promise).mockResolvedValueOnce({ order_list: [{ order_id: 9 }] });
    const a = h.load(); await Promise.resolve(); await h.load({ force: true }); old.resolve({ order_list: [] }); await a;
    expect(h.get().orderList).toEqual([{ order_id: 9 }]);
  });
  it.each(['token', 'city'])('игнорирует старый ответ после смены %s', async (key) => {
    const h = history(); const old = deferred(); h.request.mockReturnValue(old.promise); const a = h.load(); await Promise.resolve(); h.session[key] = key === 'city' ? 'samara' : 'b';
    h.actions.clearOrderList(); old.resolve({ order_list: [{ order_id: 1 }] }); await a; expect(h.get().orderList).toEqual([]);
  });
});
