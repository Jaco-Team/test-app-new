import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

const DynamicFooter = dynamic(() => import('@/components/footer.js'));
const CartPage = dynamic(() => import('@/modules/cart/page'));
const LoadMap = dynamic(() => import('@/components/loadMap'));

import { roboto } from '@/ui/Font.js';
import { useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { api } from '@/components/api.js';

import { useRouter } from 'next/router';

const this_module = 'contacts';

export default React.memo(function Cart(props) {

  const { push } = useRouter();

  const { city, cats, cities, page, all_items, free_items, need_dop } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList]);

  const [setActivePage, matches] = useHeaderStore((state) => [state.setActivePage, state.matches]);

  useEffect(() => {

    if (thisCity != city) {
      setThisCity(city);
      setThisCityRu(cities.find((item) => item.link == city)['name']);
      setThisCityList(cities);

      setTimeout(() => {
        changeAllItems();
      }, 300);
    }
    
    if( allItems.length == 0 ){
      setAllItems(all_items);
    }

    setFreeItems(free_items);
    setNeedDops(need_dop);

    getCartLocalStorage();
    
    setActivePage('cart');
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if( (!token || token == '') && city.length > 0 ){
        push(`/${city}`);
      }
    }
  }, []);
 
  return (
    <div className={roboto.variable}>

      { city == '' ? false :
        <LoadMap city={city} />
      }

      <CartPage page={page} cityName={city} />

      <DynamicFooter cityName={city} active_page={'cart'} />
    </div>
  );
});

export async function getServerSideProps({ req, res, query }) {
    res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  )
  
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'contacts' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}
