import { useCartStore, useHeaderStoreNew, useCitiesStore } from '@/components/store.js';
import { BasketIconNew } from '@/ui/Icons.js';

import Cookies from 'js-cookie'

export default function BasketIconHeaderPC() {
  const [setActiveBasket, openBasket] = useHeaderStoreNew((state) => [state?.setActiveBasket, state?.openBasket]);
  const [itemsCount, allPrice, allPriceWithoutPromo, promoInfo, promoCheck, getInfoPromo] = useCartStore((state) => [state.itemsCount, state.allPrice, state.allPriceWithoutPromo, state.promoInfo, state.promoCheck, state.getInfoPromo]);
  const [thisCity, thisCityRu] = useCitiesStore( state => [state.thisCity, state.thisCityRu]);

  const handlerOpenBasket = () => {
    setActiveBasket(!openBasket);

    // if(!openBasket && promoInfo) {
    //   if(sessionStorage.getItem('promo_name') && sessionStorage.getItem('promo_name').length > 0){
    //     getInfoPromo(sessionStorage.getItem('promo_name'), thisCity)
    //   } else {
    //     promoCheck();
    //   }
    // }

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'open_basket'); 
    }

    if(!openBasket) {

      if(Cookies.get('promo_name') && Cookies.get('promo_name').length > 0){
        getInfoPromo(Cookies.get('promo_name'), thisCity)
      } else {
        promoCheck();
      }

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
