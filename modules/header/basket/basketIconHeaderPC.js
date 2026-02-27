//import { useMemo } from 'react';
import { useCartStore, useHeaderStoreNew, useCitiesStore, useProfileStore } from '@/components/store.js';
import { BasketIconNew } from '@/ui/Icons.js';

import Cookies from 'js-cookie'

export default function BasketIconHeaderPC() {
  const [setActiveBasket, openBasket] = useHeaderStoreNew((state) => [state?.setActiveBasket, state?.openBasket]);
  const [itemsCount, promoCheck, getInfoPromo, itemsOffDops, dopListCart, checkPromo, allPrice] = useCartStore((state) => [state.itemsCount, state.promoCheck, state.getInfoPromo, state.itemsOffDops, state.dopListCart, state.checkPromo, state.allPrice]);
  const [thisCity, thisCityRu] = useCitiesStore( state => [state.thisCity, state.thisCityRu]);
  const [saveUserActions] = useProfileStore((s) => [s.saveUserActions]);

  let price1 = itemsOffDops.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);
  let price2 = dopListCart.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);

  let baseTotal = price1 + price2;

  const totalToShow = (checkPromo?.st && itemsOffDops.length ? allPrice : null) ?? baseTotal;

  const handlerOpenBasket = () => {
    setActiveBasket(!openBasket);

    // if(!openBasket && promoInfo) {
    //   if(sessionStorage.getItem('promo_name') && sessionStorage.getItem('promo_name').length > 0){
    //     getInfoPromo(sessionStorage.getItem('promo_name'), thisCity)
    //   } else {
    //     promoCheck();
    //   }
    // }

    if (!openBasket) {
      saveUserActions('open_card', '', 0);

      try{
        // roistat.event.send('open_basket');
      } catch(e){ console.log(e) }
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
          <span>{new Intl.NumberFormat('ru-RU').format(totalToShow)} ₽</span>
        </>
      ) : (
        <BasketIconNew className={'max'} />
      )}
    </div>
  );
}
