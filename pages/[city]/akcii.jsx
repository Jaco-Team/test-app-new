import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('@/components/header.js'))
const DynamicFooter = dynamic(() => import('@/components/footer.js'))
const DynamicPage = dynamic(() => import('@/modules/akcii/page.js'))

import { roboto } from '@/ui/Font.js'
import { api } from '@/components/api.js';
import { useAkciiStore, useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';

import { shallow } from 'zustand/shallow'

const this_module = 'akcii';

export default function Akcii(props) {

  const { city, cats, cities, page, all_items } = props.data1;

  const getData = useAkciiStore( state => state.getData );

  const [setAllItems, allItems] = useCartStore((state) => [state.setAllItems, state.allItems], shallow);

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

    getData(this_module, city);
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={this_module} />

      <DynamicPage page={page} city={city} />
      
      <DynamicFooter cityName={city} />
    </div>
  )
}

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  )
  
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'akcii' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}