import React, { useEffect } from 'react';

import Header from '../../components/header.js';
import Footer from '../../components/footer.js';

import { api } from '../../components/api.js';

import ProfilePage from '../../modules/profile/page.js';

import { useCitiesStore } from '../../components/store.js';
import { roboto } from '../../ui/Font.js'

const this_module = 'profile';

export default function Profile(props) {

  const { city, cats, cities, page } = props.data1;
  
  const { thisCity, setThisCity, setThisCityRu, setThisCityList } = useCitiesStore(state => state)

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }
  }, [city, thisCity]);

  return (
    <div className={roboto.variable}>
      <Header city={city} cats={cats} city_list={cities} active_page={this_module} />

      <ProfilePage page={page} this_module={this_module} city={city} />

      <Footer cityName={city} />
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