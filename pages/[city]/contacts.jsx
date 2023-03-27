import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../../components/header.js'))
const DynamicFooter = dynamic(() => import('../../components/footer.js'))
const DynamicPage = dynamic(() => import('../../modules/contacts/page.js'))

import { api } from '../../components/api.js';

import { useContactStore, useCitiesStore } from '../../components/store.js';

import { roboto } from '../../ui/Font.js'

const this_module = 'contacts';

export default function Contacts(props) {

  const { city, cats, cities, page } = props.data1;
  
  const getData = useContactStore( state => state.getData );
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  useEffect(() => {
    getData(this_module, city);
  }, [city, getData]);

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={this_module} />

      <DynamicPage page={page} />

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