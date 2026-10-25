import SHA256 from 'crypto-js/sha256';
import { getSessionStorageJson, setSessionStorageItem, removeSessionStorageItem } from '@/utils/browserStorage';

const STORAGE_KEY = 'jaco_pending_paid_order';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const CONFIRMATION_INTERVAL_MS = 3000;
export const CONFIRMATION_TIMEOUT_MS = 60000;

export function paidCartKey(items) {
  const rows = (Array.isArray(items) ? items : []).map((item) => [Number(item.item_id ?? item.id), Number(item.count)]).filter((row) => row[1] > 0).sort((a, b) => a[0] - b[0]);
  return SHA256(JSON.stringify(rows)).toString();
}

export function savePendingPaidOrder(value) {
  const pending = {
    orderId: Number(value?.orderId), pointId: Number(value?.pointId),
    city: value?.city, method: value?.method === 'sbp' ? 'sbp' : 'online',
    createdAt: Number(value?.createdAt) || Date.now(),
    startedAt: Number.isFinite(value?.startedAt) && value.startedAt <= Date.now() ? value.startedAt : 0,
    cartKey: typeof value?.cartKey === 'string' && /^[a-f0-9]{64}$/.test(value.cartKey) ? value.cartKey : '',
    ownerKey: typeof value?.ownerKey === 'string' && /^[a-f0-9]{64}$/.test(value.ownerKey) ? value.ownerKey : '',
    trackPurchase: value?.trackPurchase !== false,
  };
  if (!Number.isSafeInteger(pending.orderId) || pending.orderId <= 0 ||
      !Number.isSafeInteger(pending.pointId) || pending.pointId <= 0 ||
      !['samara', 'togliatti'].includes(pending.city)) return null;
  // Идентификаторы, время и необратимые маркеры: состав, адрес и токены остаются в памяти.
  setSessionStorageItem(STORAGE_KEY, JSON.stringify(pending));
  return pending;
}

export function readPendingPaidOrder(token) {
  const value = getSessionStorageJson(STORAGE_KEY);
  if (!token) return null;
  if (!value || value.ownerKey !== SHA256(token).toString() || !Number.isFinite(value.createdAt) || value.createdAt > Date.now() || Date.now() - value.createdAt > MAX_AGE_MS) {
    clearPendingPaidOrder();
    return null;
  }
  return savePendingPaidOrder(value);
}
export function clearPendingPaidOrder() { removeSessionStorageItem(STORAGE_KEY); }

// Контроллер находится вне React: закрытие модалки не отменяет подтверждение.
export function createPaidOrderConfirmation({ set, get, request, getToken, getCity, onConfirmed }) {
  let revision = 0;
  let timer;
  let deadlineTimer;
  let inFlight = null;
  let owner = '';
  let snapshot = null;
  const stopTimers = () => { clearTimeout(timer); clearTimeout(deadlineTimer); };
  const current = (id, token, order) => revision === id && getToken() === token && get().pendingPaidOrder === order && (!getCity() || getCity() === order.city);
  const actions = {
    pendingPaidOrder: null, paidConfirmationState: 'idle', paidConfirmationMessage: '', paidConfirmationNavigate: false,
    registerPaidOrder(value, token, check) {
      actions.resetPaidConfirmation();
      const order = savePendingPaidOrder({ ...value, ownerKey: token ? SHA256(token).toString() : '' });
      owner = token;
      snapshot = check || null;
      set({ pendingPaidOrder: order });
      return order;
    },
    restorePaidOrder(city) {
      if (get().pendingPaidOrder) return get().pendingPaidOrder;
      const order = readPendingPaidOrder(getToken());
      if (!order || order.city !== city) return null;
      owner = getToken();
      set({ pendingPaidOrder: order });
      return order;
    },
    resetPaidConfirmation() {
      revision += 1;
      stopTimers();
      inFlight = null; owner = ''; snapshot = null;
      clearPendingPaidOrder();
      set({ pendingPaidOrder: null, paidConfirmationState: 'idle', paidConfirmationMessage: '', paidConfirmationNavigate: false });
    },
    pausePaidConfirmation() {
      revision += 1;
      stopTimers();
      if (get().paidConfirmationState === 'checking') set({ paidConfirmationState: 'idle' });
    },
    startPaidConfirmation({ retry = false } = {}) {
      let order = get().pendingPaidOrder;
      const token = getToken();
      if (!order || !token || (owner && owner !== token) || (getCity() && getCity() !== order.city)) return;
      if (['confirmed', 'canceled'].includes(get().paidConfirmationState)) return;
      if (get().paidConfirmationState === 'checking' && !retry) return inFlight;
      // Ручной повтор не запускает второй запрос, пока первый ещё выполняется.
      if (inFlight) return inFlight.then(() => actions.startPaidConfirmation({ retry }));
      stopTimers(); owner = token;
      if (!order.startedAt || retry) {
        order = savePendingPaidOrder({ ...order, startedAt: Date.now() });
        set({ pendingPaidOrder: order });
      }
      const remaining = CONFIRMATION_TIMEOUT_MS - (Date.now() - order.startedAt);
      const timeout = () => set({ paidConfirmationState: 'timeout', paidConfirmationMessage: 'Пока не удалось подтвердить заказ. Проверьте ещё раз — повторно оплачивать его не нужно.' });
      if (remaining <= 0) { timeout(); return; }
      set({ paidConfirmationState: 'checking', paidConfirmationNavigate: true, paidConfirmationMessage: 'Проверяем оплату и подтверждаем заказ…' });
      const id = revision;
      deadlineTimer = setTimeout(() => {
        if (!current(id, token, order)) return;
        clearTimeout(timer); timeout();
      }, remaining);
      return actions.checkPaidOrder();
    },
    checkPaidOrder() {
      if (['confirmed', 'canceled'].includes(get().paidConfirmationState)) return Promise.resolve(get().paidConfirmationState);
      if (inFlight) return inFlight;
      const order = get().pendingPaidOrder;
      const token = getToken();
      if (!order || !token || (owner && owner !== token)) return Promise.resolve('missing');
      const id = revision;
      const promise = Promise.resolve().then(async () => {
        let response;
        try { response = await request('cart', { type: 'confirm_paid_order', __retryAttempts: 1, token, point_id: order.pointId, order_id: order.orderId }); }
        catch { response = null; }
        if (!current(id, token, order)) return 'stale';
        if (response?.st === true && response.status === 'confirmed') {
          stopTimers(); clearPendingPaidOrder();
          set({ paidConfirmationState: 'confirmed', paidConfirmationMessage: 'Оплата подтверждена. Заказ оформлен.' });
          try { await onConfirmed(order, token, snapshot); }
          catch { /* Оплаченный заказ не становится неоплаченным при сбое интерфейса. */ }
          return 'confirmed';
        }
        if (response?.st === true && response.status === 'canceled') {
          stopTimers(); clearPendingPaidOrder();
          set({ paidConfirmationState: 'canceled', paidConfirmationMessage: 'Заказ отменён. Если деньги списаны, проверьте возврат в банке или обратитесь в поддержку.' });
          return 'canceled';
        }
        if (get().paidConfirmationState === 'checking') {
          set({ paidConfirmationMessage: response?.st === true && response.status === 'pending'
            ? 'Проверяем оплату и подтверждаем заказ…'
            : 'Сервер временно недоступен. Продолжаем проверять заказ — повторно оплачивать его не нужно.' });
          timer = setTimeout(() => { void actions.checkPaidOrder(); }, CONFIRMATION_INTERVAL_MS);
        }
        return response?.st === true && response.status === 'pending' ? 'pending' : 'unavailable';
      }).finally(() => { if (inFlight === promise) inFlight = null; });
      inFlight = promise;
      return promise;
    },
  };
  return actions;
}
