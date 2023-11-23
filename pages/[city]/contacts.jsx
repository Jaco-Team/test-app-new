import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

const DynamicHeader = dynamic(() => import('@/components/header.js'));
const DynamicFooter = dynamic(() => import('@/components/footer.js'));
const ContactsPage = dynamic(() => import('@/modules/contacts/page'));
const LoadMap = dynamic(() => import('@/components/loadMap'));

import { api } from '@/components/api';
import { useContactStore, useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { roboto } from '@/ui/Font.js';

const this_module = 'contacts';

export default function Contacts(props) {

  const { city, cats, cities, page, all_items } = props.data1;
  
  const [setAllItems, changeAllItems] = useCartStore((state) => [state.setAllItems, state.changeAllItems]);

  const [ getData, loadMapNew ] = useContactStore( state => [ state.getData, state.loadMapNew ] );
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  const [ setActivePage ] = useHeaderStore( state => [ state.setActivePage ] )

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)

      setTimeout(() => {
        changeAllItems();

        
      }, 300);
    }

    setAllItems(all_items)
    setActivePage(this_module)

  }, [city, thisCity]);

  useEffect(() => {
    loadMapNew();
  }, []);

  return (
    <div className={roboto.variable}>
      { city == '' ? false :
        <LoadMap city={city} />
      }

      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={this_module} />

      <ContactsPage page={page} city={city} this_module={this_module}  />

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
    page: 'contacts' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}
