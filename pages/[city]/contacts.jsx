import React, { useEffect } from 'react';

import Script from 'next/script';
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('@/components/header.js'))
const DynamicFooter = dynamic(() => import('@/components/footer.js'))
const DynamicPage = dynamic(() => import('@/modules/contacts/page.js'))
const DynamicArrow = dynamic(() => import('@/components/arrow.js'))

import { api } from '@/components/api.js';
import { useContactStore, useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { roboto } from '@/ui/Font.js'

import { shallow } from 'zustand/shallow'

const this_module = 'contacts';

export default function Contacts(props) {

  const { city, cats, cities, page, all_items } = props.data1;
  
  const [setAllItems, allItems] = useCartStore((state) => [state.setAllItems, state.allItems], shallow);

  const getData = useContactStore( state => state.getData );
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  const [ setActivePage ] = useHeaderStore( state => [ state.setActivePage ] )

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
      <Script src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" onLoad={() => { getData(this_module, city) }} />

      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={this_module} />

      <DynamicPage page={page} />

      <DynamicArrow />

      <DynamicFooter cityName={city} />
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
    page: 'contacts' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}
