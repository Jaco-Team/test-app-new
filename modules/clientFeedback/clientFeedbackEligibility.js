export function parseOrderReviewInteger(value) {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) ? value : null;
  }

  if (typeof value !== 'string') return null;

  const normalized = value.trim();
  if (!/^-?\d+$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function normalizeOrderReviewOrder(order) {
  if (!order || typeof order !== 'object') return null;

  const statusOrder = parseOrderReviewInteger(order.status_order);
  const isDelete = parseOrderReviewInteger(order.is_delete);
  const pointId = parseOrderReviewInteger(order.point_id);
  const orderId = parseOrderReviewInteger(order.order_id);

  if (
    statusOrder === null ||
    isDelete === null ||
    pointId === null ||
    pointId <= 0 ||
    orderId === null ||
    orderId <= 0
  ) {
    return null;
  }

  return {
    ...order,
    status_order: statusOrder,
    is_delete: isDelete,
    point_id: pointId,
    order_id: orderId,
  };
}

export function isOrderReviewEligible(order) {
  const normalized = normalizeOrderReviewOrder(order);

  return normalized?.status_order === 6 && normalized?.is_delete === 0;
}
