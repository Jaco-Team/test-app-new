import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../../components/header.js'))
const DynamicFooter = dynamic(() => import('../../components/footer.js'))
const DynamicPage = dynamic(() => import('../../modules/profile/page.js'))

import { api } from '../../components/api.js';

import { useCitiesStore } from '../../components/store.js';
import { roboto } from '../../ui/Font.js'

const this_module = 'profile';

export default function Profile(props) {

  const { city, cats, cities, page } = props.data1;
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

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

      <DynamicPage page={page} this_module={this_module} city={city} />

      <DynamicFooter cityName={city} />
    </div>
  );
}

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: this_module
  };

  const data1 = await api(this_module, data);
  
  data1['city'] = query.city;

  return { props: { data1 } }
}