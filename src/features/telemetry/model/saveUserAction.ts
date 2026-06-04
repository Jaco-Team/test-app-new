import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { api } from '@src/shared/api';
import { trackCommerceEvent } from '@src/shared/lib/analytics/trackCommerceEvent';
import { getLocalStorageItem } from '@/utils/browserStorage';
import { ensureSessionToken } from './ensureSessionToken';
import { normalizeActionData } from './normalizeActionData';

export type UserActionEvent =
  | 'plus_item'
  | 'minus_item'
  | 'open_card'
  | 'open_item_home'
  | 'cart_confirm'
  | 'true_pay_online_order'
  | 'user_log_in'
  | 'user_log_out'
  | 'remove_promo'
  | 'check_promo'
  | 'choose_tag'
  | 'choose_tag_text'
  | 'open_page_false'
  | 'open_page_banner'
  | 'open_banner_home'
  | string;

export type SaveUserActionParams = {
  event: UserActionEvent;
  data?: unknown;
  price?: number;
  itemId?: number | string;
};

function trackAnalytics(
  city: string,
  event: UserActionEvent,
  data: unknown,
  price: number,
  itemId: number | string
): void {
  switch (event) {
    case 'plus_item':
      trackCommerceEvent(city, 'add_item', {
        productId: data,
        price,
        item_id: itemId,
      });
      break;
    case 'open_item_home':
      trackCommerceEvent(city, 'open_item', {
        productId: data,
        price,
        item_id: itemId,
      });
      break;
    case 'open_card':
      trackCommerceEvent(city, 'open_card', { price });
      break;
    case 'cart_confirm':
      trackCommerceEvent(city, 'cart_confirm', { price });
      break;
    case 'true_pay_online_order':
      trackCommerceEvent(city, 'true_pay_online_order', { price });
      break;
    default:
      break;
  }
}

export async function saveUserAction({
  event,
  data = '',
  price = 0,
  itemId = 0,
}: SaveUserActionParams): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const city = useCityStore.getState().slug;
  if (!city) {
    return;
  }

  trackAnalytics(city, event, data, price, itemId);

  const token = useHeaderStore.getState().token;
  ensureSessionToken();
  const userToken = getLocalStorageItem('token_tmp') ?? '';

  await api('profile', {
    type: 'save_user_actions',
    user_id: token,
    user_token: userToken,
    city_id: city,
    event,
    data: normalizeActionData(data),
  });
}
