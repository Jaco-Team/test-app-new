import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/browserStorage';

const ACCOUNT_ROUTE_NAMES = new Set([
  'account',
  'profile',
  'address',
  'promokody',
  'zakazy',
]);

const PENDING_ACK_STORAGE_PREFIX = 'security_notice_pending_ack_v1';

export function isSecurityNoticeAccountRoute(pathname) {
  const routeParts = String(pathname || '')
    .split('?')[0]
    .split('#')[0]
    .split('/')
    .filter(Boolean);
  const routeName = routeParts[routeParts.length - 1];

  return ACCOUNT_ROUTE_NAMES.has(routeName);
}

export function normalizeSecurityNotice(value) {
  if (!value || typeof value !== 'object') return null;

  const id = String(value.id || '').trim();
  if (!id) return null;

  return {
    id,
    pending: value.pending === true,
  };
}

function getPendingAckStorageKey(userId, noticeId) {
  const normalizedUserId = String(userId || '').trim();
  const normalizedNoticeId = String(noticeId || '').trim();

  if (!normalizedUserId || !normalizedNoticeId) return null;

  return [
    PENDING_ACK_STORAGE_PREFIX,
    encodeURIComponent(normalizedUserId),
    encodeURIComponent(normalizedNoticeId),
  ].join(':');
}

export function hasPendingSecurityNoticeAck(userId, noticeId) {
  const key = getPendingAckStorageKey(userId, noticeId);
  return key ? getLocalStorageItem(key) === '1' : false;
}

export function markSecurityNoticeAckPending(userId, noticeId) {
  const key = getPendingAckStorageKey(userId, noticeId);
  return key ? setLocalStorageItem(key, '1') : false;
}

export function clearPendingSecurityNoticeAck(userId, noticeId) {
  const key = getPendingAckStorageKey(userId, noticeId);
  return key ? removeLocalStorageItem(key) : false;
}
