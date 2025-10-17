import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import Footer from '@/components/footer.js'
const DocumentPageMobile = dynamic(() => import('@/modules/document/documentMobile'));

import { roboto } from '@/ui/Font.js';
import { useCitiesStore, useHeaderStoreNew, useCartStore } from '@/components/store.js';
import { api } from '@/components/api.js';

const this_module = 'contacts';

export default React.memo(function Document(props) {

  const { city, cats, cities, page, all_items, free_items, need_dop, links } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList]);

  const [setActivePage, matches] = useHeaderStoreNew((state) => [state.setActivePage, state.matches]);

  // useEffect(() => {
  //   if (!matches) {
  //     window.location.href = '/' + city;
  //   }
  // }, [matches]);

  useEffect(() => {
    if (thisCity != city) {
      setThisCity(city);
      //setThisCityRu(cities.find((item) => item.link == city)['name']);

      const found = Array.isArray(cities) ? cities.find(item => item?.link == city) : null;
      setThisCityRu( found?.name ?? '' );

      setThisCityList(cities);
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

    setActivePage('document');
  }, []);

  // if( !matches ){
  //   return false;
  // }

  return (
    <div className={roboto.variable}>
      {matches ? <DocumentPageMobile page={page} cityName={city} /> : null}

      <Footer cityName={city} active_page={'document'} links={links} />
    </div>
  );
});

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  
  const city = String(query.city || '');
  let data = {
    type: 'get_page_info', 
    city_id: city,
    page: 'about' 
  };

  const data1 = await api(this_module, data);

  const redirectCity = city || 'togliatti'; 

  if (!data1) {
    // return {
    //   redirect: {
    //     destination: '/',
    //     permanent: false,
    //   },
    // }

    return { redirect: { destination: `/${redirectCity}`, permanent: true } }
  }

  const footer = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: 'info',
  });

  data1.links = footer?.page || {};

  data1['city'] = city;

  return { props: { data1 } }
}
