import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import Footer from '@/components/footer.js'
const CartPage = dynamic(() => import('@/modules/cart/page'));
const LoadMap = dynamic(() => import('@/components/loadMap'));

import { roboto } from '@/ui/Font.js';
import { useCitiesStore, useHeaderStoreNew, useCartStore } from '@/components/store.js';
import { api } from '@/components/api.js';

// import { useRouter } from 'next/router';

const this_module = 'contacts';

import { normalizeCity } from '@/utils/normalizeCity';
import { getCookie } from '@/utils/getCookie';

export default React.memo(function Cart(props) {

  // const { push } = useRouter();

  const { city, cats, cities, page, all_items, free_items, need_dop, links } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList]);

  const [setActivePage] = useHeaderStoreNew((state) => [state.setActivePage]);

  useEffect(() => {

    if (thisCity != city) {
      setThisCity(city);
      //setThisCityRu(cities.find((item) => item.link == city)['name']);

      const found = Array.isArray(cities) ? cities.find(item => item?.link == city) : null;
      setThisCityRu( found?.name ?? '' );

      setThisCityList(cities);
      setAllItems(all_items);
      
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
    
    // if (typeof window !== 'undefined') {
    //   const token = localStorage.getItem('token');

    //   if( (!token || token == '') && city.length > 0 ){
    //     push(`/${city}`);
    //   }
    // }
  }, []);
 
  return (
    <div className={roboto.variable}>

      { city == '' ? false :
        <LoadMap city={city} />
      }

      <CartPage page={page} cityName={city} />

      <Footer cityName={city} active_page={'cart'} links={links} />
    </div>
  );
});

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');

  const cityFromPath = normalizeCity(query?.city);
  const savedCity = normalizeCity(getCookie(req, 'city'));
  const city = cityFromPath || savedCity || 'togliatti';

  if (!cityFromPath) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const data1 = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: 'contacts',
  });

  if (!data1 || data1?.page == null) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const footer = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: 'info',
  });

  data1.links = footer?.page || {};
  data1.city = city;

  return { props: { data1 } };
}
