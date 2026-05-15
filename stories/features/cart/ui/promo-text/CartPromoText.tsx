import './CartPromoText.scss';
import { CartPromoTextProps } from '@stories/features/cart/ui/promo-text/model/types';

export const CartPromoText = ({ text, status_promo }: CartPromoTextProps) => {
  return (
    <div className="descPromo">
      <span style={{ color: status_promo ? 'rgba(0, 0, 0, 0.80)' : '#DD1A32' }}>
        {text}
      </span>
    </div>
  );
};
