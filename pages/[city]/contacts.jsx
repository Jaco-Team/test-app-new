import React, { useEffect } from 'react';

import { api } from '../../components/api.js';

import { useContactStore, useCitiesStore } from '../../components/store.js';

import { roboto } from '../../ui/Font.js'
import Header from '../../components/header.js';
import Footer from '../../components/footer.js';
import ContactsPage from '../../modules/contacts/page.js';

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
      <Header city={city} cats={cats} city_list={cities} active_page={this_module} />

      <ContactsPage page={page} />

      <Footer cityName={city} />
    </div>
  );
}

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'contacts' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}