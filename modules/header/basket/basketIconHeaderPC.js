import { useCartStore, useHeaderStore } from '@/components/store.js';
import { BasketIconNew } from '@/ui/Icons.js';

export default function BasketIconHeaderPC() {
  const [setActiveBasket, openBasket] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket]);
  const [itemsCount, allPrice, allPriceWithoutPromo, promoInfo, promoCheck] = useCartStore((state) => [state.itemsCount, state.allPrice, state.allPriceWithoutPromo, state.promoInfo, state.promoCheck]);

  const handlerOpenBasket = () => {
    setActiveBasket(!openBasket);

    if(!openBasket && promoInfo) {
      promoCheck();
    }
  }

  return (
    <div className={"basketCat "+(parseInt(itemsCount) > 0 ? 'max' : 'min')+(openBasket ? ' active' : '')} style={{ justifyContent: parseInt(itemsCount) > 0 ? 'space-evenly' : 'center' }} onClick={handlerOpenBasket}>
      { parseInt(itemsCount) > 0 ? (
        <>
          <BasketIconNew className={'min'} />
          <span>{new Intl.NumberFormat('ru-RU').format(allPrice ? allPrice : allPriceWithoutPromo)} ₽</span>
        </>
      ) : (
        <BasketIconNew className={'max'} />
      )}
    </div>
  );
}
