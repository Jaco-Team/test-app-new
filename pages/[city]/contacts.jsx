import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import Footer from '@/components/footer.js'
const ContactsPage = dynamic(() => import('@/modules/contacts/page'));
const LoadMap = dynamic(() => import('@/components/loadMap'));

import { api } from '@/components/api';
import { useCitiesStore, useHeaderStoreNew, useCartStore } from '@/components/store.js';
import { roboto } from '@/ui/Font.js';

const this_module = 'contacts';

import { normalizeCity } from '@/utils/normalizeCity'
import { getCookie } from '@/utils/getCookie'

export default function Contacts(props) {

  const { city, cats, cities, page, all_items, free_items, need_dop, links } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  const [ setActivePage ] = useHeaderStoreNew( state => [ state.setActivePage ] )

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      //setThisCityRu( cities.find( item => item.link == city )['name'] );

      const found = Array.isArray(cities) ? cities.find(item => item?.link == city) : null;
      setThisCityRu( found?.name ?? '' );

      setThisCityList(cities)
      setAllItems(all_items);
      
      setTimeout(() => {
        changeAllItems();
      }, 300);
    }

    if( allItems.length == 0 ){
      setAllItems(all_items);
    }

    setFreeItems(free_items);
    setNeedDops(need_dop);

    getCartLocalStorage();

    setActivePage(this_module)

  }, [city, thisCity]);

  return (
    <div className={roboto.variable}>
      { city == '' ? false :
        <LoadMap city={city} />
      }

      <ContactsPage page={page} city={city} />

      <Footer cityName={city} active_page={this_module} links={links} />
    </div>
  );
}

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');

  const cityFromPath = normalizeCity(query?.city);
  const savedCity = normalizeCity(getCookie(req, 'city'));
  const city = cityFromPath || savedCity || 'togliatti';

  // если город невалидный/нет — уводим на /{city}
  if (!cityFromPath) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const data1 = await api(this_module, {
    type: 'get_page_info',
    city_id: city,
    page: 'contacts',
  });

  // если бэк не дал страницу — тоже на /{city}
  if (!data1?.page) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const footer = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: 'info',
  });

  data1.links = footer?.page || {};
  data1.city = city;

  return { props: { data1 } };
}
