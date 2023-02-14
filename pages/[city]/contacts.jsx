import React, { useEffect } from 'react';

const this_module = 'contacts';

import { api } from '../../components/api.js';

import { useContactStore } from '../../components/store.js';

import { roboto } from '../../ui/Font.js'
import { Header } from '../../components/header.js';
import { Footer } from '../../components/footer.js';
import ContactsPage from '../../modules/contacts/page.js';

export default function Contacts(props) {

  const { city, cats, cities, page } = props.data1;
  
  const getData = useContactStore( state => state.getData );
  
  useEffect(() => {
    getData(this_module, city);

    console.log( 'load' )
  }, [getData]);

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