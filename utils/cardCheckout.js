import SHA256 from 'crypto-js/sha256';
import { getSessionStorageJson, setSessionStorageItem, removeSessionStorageItem } from '@/utils/browserStorage';

const REQUEST_KEY = 'jaco_card_checkout_request_';
const requests = new Map();
const HASH = /^[a-f0-9]{64}$/;
const ownerKey = (token) => typeof token === 'string' && token ? SHA256(token).toString() : '';

export function cardCheckoutFingerprint(state, token, city) {
  try {
    return SHA256(JSON.stringify({
      owner: ownerKey(token), city, method: state.typePay?.id, typeOrder: state.typeOrder,
      items: state.items, amount: state.allPrice, address: state.orderAddr, pickup: state.orderPic,
      date: state.dateTimeOrder, promo: state.checkPromo, freeDrive: state.free_drive,
      delivery: state.summDiv, comment: state.comment, change: state.sdacha,
    })).toString();
  } catch { return ''; }
}

export function readCardCheckoutRequest(token) {
  const owner = ownerKey(token);
  if (!owner) return null;
  const value = requests.get(owner) || getSessionStorageJson(REQUEST_KEY + owner);
  if (!value || value.owner !== owner || !HASH.test(value.fingerprint) ||
      !['samara', 'togliatti'].includes(value.city) || !['embedded', 'redirect'].includes(value.confirmation)) return null;
  requests.set(owner, value);
  return value;
}

export function saveCardCheckoutRequest(token, value, { requirePersistence = false } = {}) {
  const owner = ownerKey(token);
  if (!owner || !HASH.test(value?.fingerprint) || !['samara', 'togliatti'].includes(value?.city)) return null;
  const reference = value?.reference;
  const request = {
    owner, fingerprint: value.fingerprint, city: value.city,
    confirmation: value.confirmation === 'redirect' ? 'redirect' : 'embedded',
    ...(Number.isSafeInteger(reference?.pointId) && reference.pointId > 0 &&
       Number.isSafeInteger(reference?.orderId) && reference.orderId > 0
      ? { reference: { pointId: reference.pointId, orderId: reference.orderId } } : {}),
  };
  const persisted = setSessionStorageItem(REQUEST_KEY + owner, JSON.stringify(request));
  if (requirePersistence && !persisted) return null;
  requests.set(owner, request);
  return request;
}

export function clearCardCheckoutRequest(token) {
  const owner = ownerKey(token);
  if (!owner) return;
  requests.delete(owner);
  removeSessionStorageItem(REQUEST_KEY + owner);
}

export function hostedCardConfirmationUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443') ||
        !['yookassa.ru', 'yoomoney.ru'].some((allowed) => host === allowed || host.endsWith('.' + allowed))) return null;
    return url.href;
  } catch { return null; }
}
