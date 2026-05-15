import './Cart.scss';
import { TableCart } from '../cart-table/TableCart';
import { CartPromoInput } from '@stories/features/cart/ui/promo-input/CartPromoInput';
import { CartPromoText } from '@stories/features/cart/ui/promo-text/CartPromoText';
import { TableCart_text } from '@stories/entities/cart/ui/cart-text/TableCart_text';
import { MyButton } from '@stories/shared/ui/button/MyButton';
import { CartProps } from '@stories/widgets/cart/ui/cart-panel/model/types';

export const Cart = ({ data, openBasket, promo, desc }: CartProps) => {
  return (
    <>
      {openBasket ? <div className="blockShadowBasket" /> : false}
      <div className="cartPC">
        <TableCart_text text="allergens" />
        <TableCart {...data} />
        <CartPromoInput {...promo} />
        <CartPromoText {...desc} />
        <MyButton
          children="Оформить заказ"
          variant="cart"
          size="big"
          id="btn"
        />
      </div>
    </>
  );
};
