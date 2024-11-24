import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

const DynamicFooter = dynamic(() => import('@/components/footer.js'));
const DocumentPageMobile = dynamic(() => import('@/modules/document/documentMobile'));

import { roboto } from '@/ui/Font.js';
import { useCitiesStore, useHeaderStoreNew, useCartStore } from '@/components/store.js';
import { api } from '@/components/api.js';

const this_module = 'contacts';

export default React.memo(function Document(props) {

  const { city, cats, cities, page, all_items, free_items, need_dop } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList]);

  const [setActivePage, matches] = useHeaderStoreNew((state) => [state.setActivePage, state.matches]);

  useEffect(() => {
    if (!matches) {
      window.location.href = '/' + city;
    }
  }, [matches]);

  useEffect(() => {
    if (thisCity != city) {
      setThisCity(city);
      setThisCityRu(cities.find((item) => item.link == city)['name']);
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

  if( !matches ){
    return false;
  }

  return (
    <div className={roboto.variable}>
      <DocumentPageMobile page={page} cityName={city} />

      <DynamicFooter cityName={city} active_page={'document'} />
    </div>
  );
});

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'about' 
  };

  const data1 = await api(this_module, data);

  if (!data1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  data1['city'] = query.city;

  return { props: { data1 } }
}
