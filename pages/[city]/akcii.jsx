import React, { useEffect } from 'react';

import Header from '../../components/header.js';
import Footer from '../../components/footer.js';

import { roboto } from '../../ui/Font.js'

import { api } from '../../components/api.js';

import { useAkciiStore, useCitiesStore } from '../../components/store.js';

import ActiiPage from '../../modules/akcii/page.js';

const this_module = 'akcii';

export default function Akcii(props) {

  const { city, cats, cities, page } = props.data1;

  const getData = useAkciiStore( state => state.getData );
  const { thisCity, setThisCity, setThisCityRu, setThisCityList } = useCitiesStore(state => state)

  useEffect(() => {
    getData(this_module, city);

    console.log( 'load' )
  }, [city, getData]);

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }
  }, [city, cities, thisCity, setThisCity, setThisCityRu, setThisCityList]);

  return (
    <div className={roboto.variable}>
      <Header city={city} cats={cats} city_list={cities} active_page={this_module} />

      <ActiiPage page={page} city={city} />
      
      <Footer cityName={city} />
    </div>
  )
}

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'akcii' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}