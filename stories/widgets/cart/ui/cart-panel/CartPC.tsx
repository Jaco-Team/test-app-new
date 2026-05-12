
import './CartPC.scss';
import { TableCartPC } from '../cart-table/TableCartPC';
import { CartPCPromoInput } from '../../../../features/cart/ui/promo-input/CartPCPromoInput';
import { CartPCPromoText } from '../../../../features/cart/ui/promo-text/CartPCPromoText';
import { TableCartPC_text } from '../../../../entities/cart/ui/cart-text/TableCartPC_text';
import { MyButton } from '../../../../shared/ui/button/MyButton';

export const CartPC = ({ data, openBasket, promo, desc }: Record<string, any>) => {
  return (
    <>
      {openBasket ? <div className="blockShadowBasket" /> : false}
      <div className="cartPC">
        <TableCartPC_text text="allergens" />
        <TableCartPC {...data} />
        <CartPCPromoInput {...promo} />
        <CartPCPromoText {...desc} />
        <MyButton children="Оформить заказ" variant="cart" size="big" id='btn' />
      </div>
    </>
  );
};

