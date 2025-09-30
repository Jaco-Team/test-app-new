import { useMemo } from 'react';
import { useCartStore, useHeaderStoreNew, useCitiesStore } from '@/components/store.js';
import { BasketIconNew } from '@/ui/Icons.js';

import Cookies from 'js-cookie'

export default function BasketIconHeaderPC() {
  const [setActiveBasket, openBasket] = useHeaderStoreNew((state) => [state?.setActiveBasket, state?.openBasket]);
  const [itemsCount, promoCheck, getInfoPromo, itemsOffDops, dopListCart] = useCartStore((state) => [state.itemsCount, state.promoCheck, state.getInfoPromo, state.itemsOffDops, state.dopListCart]);
  const [thisCity, thisCityRu] = useCitiesStore( state => [state.thisCity, state.thisCityRu]);

  let price1 = itemsOffDops.reduce((all, it) => {
    const count = Number(it.count || 0);
    const unit  = Number((it.new_one_price ?? it.one_price) || 0);

    const line = it.all_price != null ? Number(it.all_price) : count * unit;

    return all + line;
  }, 0);

  let price2 = dopListCart.reduce((all, it) =>
    all + Number(it.count || 0) * Number(it.one_price || 0), 0);

  let allPriceWithoutPromo_new = price1 + price2;
  console.log("🚀 allPriceWithoutPromo_new:", allPriceWithoutPromo_new);

  const handlerOpenBasket = () => {
    setActiveBasket(!openBasket);

    // if(!openBasket && promoInfo) {
    //   if(sessionStorage.getItem('promo_name') && sessionStorage.getItem('promo_name').length > 0){
    //     getInfoPromo(sessionStorage.getItem('promo_name'), thisCity)
    //   } else {
    //     promoCheck();
    //   }
    // }

    if( !openBasket == true ){
      if( thisCityRu == 'Самара' ){
        ym(100325084, 'reachGoal', 'open_basket'); 
      }

      if( thisCityRu == 'Тольятти' ){
        ym(100601350, 'reachGoal', 'open_basket'); 
      }

      try{
        roistat.event.send('open_basket');
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
          <span>{new Intl.NumberFormat('ru-RU').format(allPriceWithoutPromo_new)} ₽</span>
        </>
      ) : (
        <BasketIconNew className={'max'} />
      )}
    </div>
  );
}
