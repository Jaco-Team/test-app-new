import React, { useEffect } from 'react';

import Script from 'next/script';
import dynamic from 'next/dynamic';

const DynamicHeader = dynamic(() => import('@/components/header.js'));
const DynamicFooter = dynamic(() => import('@/components/footer.js'));
const CartPage = dynamic(() => import('@/modules/cart/page'));

import { roboto } from '@/ui/Font.js';
import { useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { api } from '@/components/api.js';

const this_module = 'contacts';

export default React.memo(function Cart(props) {

  const { city, cats, cities, page, all_items } = props.data1;

  const [setAllItems, allItems, getDataMap] = useCartStore((state) => [state.setAllItems, state.allItems, state.getDataMap]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList]);

  const [setActivePage, matches] = useHeaderStore((state) => [state.setActivePage, state.matches]);

  useEffect(() => {
    if (!matches) {
      window.location.href = '/' + city;
    }
  }, [matches]);

  useEffect(() => {
    if (thisCity != city) {
      setThisCity(city);
      setThisCityRu(cities.find((item) => item.link == city)['name']);
      setThisCityList(cities);
    }

    if (allItems.length == 0) {
      setAllItems(all_items);
    }

    setActivePage('cart');
  }, []);
 
  return (
    <>
      {!matches ? null : (
        <div className={roboto.variable}>
          <Script src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" 
          onLoad={() => { getDataMap(this_module, city) }} 
          />

          <DynamicHeader city={city} cats={cats} city_list={cities} active_page={'cart'}/>

          <CartPage page={page} cityName={city} />

          <DynamicFooter cityName={city} active_page={'cart'} />
        </div>
      )}
    </>
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
