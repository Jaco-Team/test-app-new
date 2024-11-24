import { useCartStore, useHeaderStore, useCitiesStore } from '@/components/store.js';
import { BasketIconNew } from '@/ui/Icons.js';

export default function BasketIconHeaderPC() {
  const [setActiveBasket, openBasket] = useHeaderStore((state) => [state?.setActiveBasket, state?.openBasket]);
  const [itemsCount, allPrice, allPriceWithoutPromo, promoInfo, promoCheck, getInfoPromo] = useCartStore((state) => [state.itemsCount, state.allPrice, state.allPriceWithoutPromo, state.promoInfo, state.promoCheck, state.getInfoPromo]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  const handlerOpenBasket = () => {
    setActiveBasket(!openBasket);

    if(!openBasket && promoInfo) {
      if(sessionStorage.getItem('promo_name') && sessionStorage.getItem('promo_name').length > 0){
        getInfoPromo(sessionStorage.getItem('promo_name'), thisCity)
      } else {
        promoCheck();
      }
      //promoCheck();
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
