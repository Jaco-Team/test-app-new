import React, { useEffect } from 'react';

import Script from 'next/script';
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('@/components/header.js'))
const DynamicFooter = dynamic(() => import('@/components/footer.js'))
const DynamicPage = dynamic(() => import('@/modules/profile/address/page'))

import { api } from '@/components/api.js';
import { useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { roboto } from '@/ui/Font.js'

const this_module = 'address';

export default function Address(props) {

  const {city, cats, cities, page, all_items} = props.data1;

  const [setAllItems, allItems] = useCartStore((state) => [state.setAllItems, state.allItems]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] = useCitiesStore(state => [state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList]);
  const [setActivePage, matches] = useHeaderStore((state) => [state.setActivePage, state.matches]);

  useEffect(() => {
    if (!matches) {
      window.location.href = '/' + city + '/profile';
    }
  }, [matches]);

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }

    if( allItems.length == 0 ){
      setAllItems(all_items)
    }

    setActivePage(this_module)
  }, []);

  return (
    <div className={roboto.variable}>
      <Script src="https://api-maps.yandex.ru/2.1/?apikey=f600fbbd-6500-4bf7-a0ab-ec9336f6c7d8&lang=ru_RU" />
      
      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={this_module} />

      <DynamicPage page={page} this_module={this_module} city={city} />

      <DynamicFooter cityName={city} active_page={this_module} />
    </div>
  );
}

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  )
  
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'profile'
  };

  const data1 = await api('profile', data);
  
  data1['city'] = query.city;

  return { props: { data1 } }
}
