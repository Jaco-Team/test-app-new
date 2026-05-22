import PropTypes from 'prop-types';
import MyTextInput from '../MyTextInput/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';
import './CartPCPromoInput.scss';

export const CartPCPromoInput = ({promo, checkPromo, items_on_price, status_promo, itemsCount, allPrice, promoItemsFind }) => {
  return (
    <div className="promoInput">
      <MyTextInput
        placeholder="Есть промокод"
        value={promo}
        inputAdornment={<InputAdornment position="end" style={{ backgroundColor: checkPromo ? checkPromo.st === true ? '#76ec3f' : '#DD1A32' : null }} />}
      />
      {items_on_price?.length ? promoItemsFind ? <span>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</span> : null
        : status_promo && itemsCount ? <span>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</span> : null}
    </div>
  );
};

CartPCPromoInput.propTypes = {
  itemsCount: PropTypes.number,
  items_on_price: PropTypes.array,
  status_promo: PropTypes.bool,
  checkPromo: PropTypes.bool,
  promo: PropTypes.string.isRequired,
  allPrice: PropTypes.string.isRequired,
  promoItemsFind: PropTypes.bool,
};
