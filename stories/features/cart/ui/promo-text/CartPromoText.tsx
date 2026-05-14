import './CartPromoText.scss';

export const CartPromoText = ({ text, status_promo }: Record<string, any>) => {
  return (
    <div className="descPromo">
      <span style={{ color: status_promo ? 'rgba(0, 0, 0, 0.80)' : '#DD1A32' }}>
        {text}
      </span>
    </div>
  );
};
