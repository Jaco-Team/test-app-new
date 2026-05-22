import { CartPromoInputProps } from '@stories/features/cart/ui/promo-input/model/types';
import { CartPromoTextProps } from '@stories/features/cart/ui/promo-text/model/types';
import { TableCartProps } from '@stories/widgets/cart/ui/cart-table/model/types';

export interface CartProps {
  data?: TableCartProps;
  openBasket?: boolean;
  promo?: CartPromoInputProps;
  desc?: CartPromoTextProps;
  onOrderSubmit?: () => void;
}
