import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('@/components/header.js'))
const DynamicFooter = dynamic(() => import('@/components/footer.js'))
const DynamicPage = dynamic(() => import('@/modules/akcii/page.js'))

import { roboto } from '@/ui/Font.js'
import { api } from '@/components/api.js';
import { useAkciiStore, useCitiesStore } from '@/components/store.js';

const this_module = 'akcii';

export default function Akcii(props) {

  const { city, cats, cities, page } = props.data1;

  const getData = useAkciiStore( state => state.getData );
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  const [ setActivePage ] = useHeaderStore( state => [ state.setActivePage ] )

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
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