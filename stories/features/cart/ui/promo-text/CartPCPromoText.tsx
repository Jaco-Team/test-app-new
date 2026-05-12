// @ts-nocheck
import './CartPCPromoText.scss';

export const CartPCPromoText = ({ text, status_promo }) => {
  return (
    <div className='descPromo'>
      <span style={{ color: status_promo ? 'rgba(0, 0, 0, 0.80)' : '#DD1A32'}}>{text}</span>
    </div>
  );
};

