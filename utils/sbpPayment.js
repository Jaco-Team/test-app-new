import {
  getLocalStorageJson,
  getSessionStorageJson,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from '@/utils/browserStorage';

const STORAGE_KEY = 'jaco_pending_sbp_order';
const MAX_AGE_MS = 15 * 60 * 1000;

export function isSbpEnabled() {
  return process.env.NEXT_PUBLIC_SBP_ENABLED === 'true';
}

export function sbpConfirmationUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (
      url.protocol !== 'https:' ||
      !(
        host === 'yoomoney.ru' ||
        host.endsWith('.yoomoney.ru') ||
        host === 'yookassa.ru' ||
        host.endsWith('.yookassa.ru')
      )
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

export function isSbpPaymentConfirmed(response) {
  return response?.st === true && response?.status === 'succeeded';
}

export function savePendingSbpOrder(order) {
  const pending = {
    orderId: Number(order?.orderId),
    pointId: Number(order?.pointId),
    city: String(order?.city || ''),
    createdAt: Date.now(),
  };
  if (!pending.orderId || !pending.pointId) {
    return null;
  }
  removeLocalStorageItem(STORAGE_KEY);
  setSessionStorageItem(STORAGE_KEY, JSON.stringify(pending));
  return pending;
}

export function getPendingSbpOrder() {
  const pending =
    getLocalStorageJson(STORAGE_KEY) || getSessionStorageJson(STORAGE_KEY);
  if (
    !pending ||
    !Number.isSafeInteger(pending.orderId) ||
    !Number.isSafeInteger(pending.pointId) ||
    !['samara', 'togliatti'].includes(pending.city) ||
    !Number.isFinite(pending.createdAt) ||
    Date.now() - pending.createdAt > MAX_AGE_MS
  ) {
    removeLocalStorageItem(STORAGE_KEY);
    removeSessionStorageItem(STORAGE_KEY);
    return null;
  }
  // Старые записи переносятся без платёжного токена, состава и адреса.
  const safe = { orderId: pending.orderId, pointId: pending.pointId, city: pending.city, createdAt: pending.createdAt };
  removeLocalStorageItem(STORAGE_KEY);
  setSessionStorageItem(STORAGE_KEY, JSON.stringify(safe));
  return safe;
}

export function clearPendingSbpOrder() {
  removeLocalStorageItem(STORAGE_KEY);
  removeSessionStorageItem(STORAGE_KEY);
}
