import { useCartStore, useHeaderStore } from '@/components/store.js';
import { BasketIconMobile } from '@/ui/Icons.js';
import ListItem from '@mui/material/ListItem';

export default function BasketIconHeaderMobile({ setActiveMenu }) {
  //console.log('render BasketIconHeaderMobile');

  const [setActiveBasket, openBasket] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket]);

  const [itemsCount] = useCartStore((state) => [state.itemsCount]);

  return (
    <ListItem onClick={() => { setActiveBasket(!openBasket); setActiveMenu(false) }}>
      <a>
        <div>
          <div><BasketIconMobile /></div>
          <span>Корзина</span>
          {itemsCount ? <div className="count_profile"><span>{itemsCount}</span></div> : null}
        </div>
      </a>
    </ListItem>
  );
}
