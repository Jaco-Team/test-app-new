import { reachGoal } from './metrika';

export function trackCommerceEvent(
  city: string,
  event: string,
  params: Record<string, unknown> = {}
): void {
  switch (event) {
    case 'open_item':
      reachGoal('open_item', { tovar: params.productId }, city);
      pushTopMailRu(city, {
        type: 'reachGoal',
        id: 3621394,
        value: params?.price ?? 0,
        goal: 'product',
        params: { product_id: params.item_id },
      });
      break;
    case 'open_card':
      reachGoal('open_card', undefined, city);
      pushTopMailRu(city, { type: 'reachGoal', id: 3621394, goal: 'zakaz_on' });
      break;
    case 'cart_confirm':
      reachGoal('confirm_card', undefined, city);
      pushTopMailRu(city, {
        type: 'reachGoal',
        id: 3621394,
        goal: 'zakaz_off',
      });
      break;
    case 'open_basket':
      reachGoal('open_basket', undefined, city);
      break;
    case 'add_item':
      pushTopMailRu(city, {
        type: 'reachGoal',
        id: 3621394,
        value: params?.price ?? 0,
        goal: 'korzina',
        params: { product_id: params.item_id },
      });
      break;
    case 'true_pay_online_order':
      pushTopMailRu(city, {
        type: 'reachGoal',
        id: 3621394,
        value: params?.price ?? 0,
        goal: 'zakaz_oplata',
      });
      break;
    default:
      break;
  }
}

function pushTopMailRu(city: string, payload: Record<string, unknown>): void {
  if (typeof window === 'undefined' || city !== 'samara') {
    return;
  }

  const tmr = (window as typeof window & { _tmr?: Record<string, unknown>[] })
    ._tmr;
  if (Array.isArray(tmr)) {
    tmr.push(payload);
  }
}
