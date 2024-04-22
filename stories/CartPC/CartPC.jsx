import PropTypes from 'prop-types';

import './CartPC.scss';
import { TableCartPC } from '../TableCartPC/TableCartPC';
import { CartPCPromoInput } from '../CartPCPromoInput/CartPCPromoInput';
import { CartPCPromoText } from '../CartPCPromoText/CartPCPromoText';
import { MyButton } from '../MyButton/MyButton';

export const CartPC = ({ data, openBasket, promo, desc }) => {
  return (
    <>
      {openBasket ? <div className="blockShadowBasket" /> : false}
      <div className="cartPC">
        <TableCartPC {...data} />
        <CartPCPromoInput {...promo} />
        <CartPCPromoText {...desc} />
        <MyButton children="Оформить заказ" variant="cart" size="big" />
      </div>
    </>
  );
};

CartPC.propTypes = {
  data: PropTypes.object,
  promo: PropTypes.object,
  desc: PropTypes.object,
  openBasket: PropTypes.bool
};
