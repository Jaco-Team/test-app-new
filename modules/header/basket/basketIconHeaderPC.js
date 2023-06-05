import { useCartStore, useHeaderStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';
import { BasketIcon } from '@/ui/Icons.js';

export default function BasketIconHeaderPC() {
  console.log('render BasketIconHeaderPC');

  const [setActiveBasket, openBasket] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket], shallow);

  const [itemsCount] = useCartStore((state) => [state.itemsCount], shallow);

  return (
    <div className="basketCat" style={{ justifyContent: itemsCount ? 'space-evenly' : 'center' }} onClick={() => setActiveBasket(!openBasket)}>
      {itemsCount ? (
        <>
          <BasketIcon />
          <span>{itemsCount}</span>
        </>
      ) : (
          <BasketIcon />
      )}
    </div>
  );
}
