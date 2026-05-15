import { CartPromoInputProps } from '@stories/features/cart/ui/promo-input/model/types';
import { CartPromoTextProps } from '@stories/features/cart/ui/promo-text/model/types';

export interface CartProps {
  data?: TableCartProps;
  openBasket?: boolean;
  promo?: CartPromoInputProps;
  desc?: CartPromoTextProps;
  onOrderSubmit?: () => void;
}
