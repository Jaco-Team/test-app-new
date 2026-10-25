import { updateRouteQuery } from '@/utils/routeQuery';

function positiveId(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && String(id) === value ? id : null;
}

// В URL нет доказательства оплаты/владения — только точная ссылка для серверной проверки.
export function readSbpReturn(query = {}, asPath = '') {
  const raw = new URL(asPath || '/', 'https://jacofood.ru').searchParams;
  const owns = (name) => Object.prototype.hasOwnProperty.call(query, name);
  const requested = raw.has('sbp_return') || owns('sbp_return');
  const validFlag = query.sbp_return === '1' && raw.getAll('sbp_return').length === 1 && raw.get('sbp_return') === '1';
  const hasIds = raw.has('point_id') || raw.has('order_id') || owns('point_id') || owns('order_id');
  const pointId = positiveId(query.point_id);
  const orderId = positiveId(query.order_id);
  const validIds = pointId && orderId && raw.getAll('point_id').length === 1 && raw.getAll('order_id').length === 1 &&
    raw.get('point_id') === query.point_id && raw.get('order_id') === query.order_id;
  return {
    requested,
    legacy: requested && validFlag && !hasIds,
    reference: requested && validFlag && validIds ? { pointId, orderId } : null,
    invalid: requested && (!validFlag || (hasIds && !validIds)),
  };
}

export function samePaidOrder(order, reference, city) {
  return Boolean(order && reference && order.city === city && order.pointId === reference.pointId && order.orderId === reference.orderId);
}

export function sbpOrdersPath(asPath, city, clean = false) {
  const path = String(asPath || '/');
  const suffixIndex = path.search(/[?#]/);
  let target = `/${city}/zakazy${suffixIndex === -1 ? '' : path.slice(suffixIndex)}`;
  if (clean) for (const name of ['sbp_return', 'point_id', 'order_id']) target = updateRouteQuery(target, name, null);
  return target;
}
