import { useCartStore, useHeaderStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';
import { BasketIconTablet } from '@/ui/Icons.js';
import ListItem from '@mui/material/ListItem';

export default function BasketIconHeaderTablet({ setActiveMenu }) {
  console.log('render BasketIconHeaderTablet');

  const [setActiveBasket, openBasket] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket], shallow);

  const [itemsCount] = useCartStore((state) => [state.itemsCount], shallow);

  return (
    <ListItem onClick={() => { setActiveBasket(!openBasket); setActiveMenu(false) }}>
      <a>
        <div>
          <div><BasketIconTablet /></div>
          <span>Корзина</span>
          {itemsCount ? <div className="count_profile"><span>{itemsCount}</span></div> : null}
        </div>
      </a>
    </ListItem>
  );
}
