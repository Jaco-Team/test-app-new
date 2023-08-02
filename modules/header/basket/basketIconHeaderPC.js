import { useCartStore, useHeaderStore } from '@/components/store.js';
import { BasketIcon } from '@/ui/Icons.js';

export default function BasketIconHeaderPC() {
  //console.log('render BasketIconHeaderPC');

  const [setActiveBasket, openBasket] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket]);
  const [itemsCount, promoInfo, promoCheck] = useCartStore((state) => [state.itemsCount, state.promoInfo, state.promoCheck]);

  const handlerOpenBasket = () => {
    setActiveBasket(!openBasket);

    if(!openBasket && promoInfo) {
      promoCheck();
    }
  }

  return (
    <div className="basketCat" style={{ justifyContent: itemsCount ? 'space-evenly' : 'center' }} onClick={handlerOpenBasket}>
      {itemsCount ? (
        <>
          <BasketIcon className={'min'} />
          <span>{itemsCount}</span>
        </>
      ) : (
        <BasketIcon className={'max'} />
      )}
    </div>
  );
}
