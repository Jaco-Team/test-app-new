import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicFooter = dynamic(() => import('@/components/footer.js'))
const DynamicPage = dynamic(() => import('@/modules/profile/zakazy/page'))

import { api } from '@/components/api.js';
import { useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { roboto } from '@/ui/Font.js'

import { useRouter } from 'next/router';

const this_module = 'zakazy';

export default function Zakazy(props) {

  const { push } = useRouter();

  const { city, cats, cities, page, all_items, free_items, need_dop } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  const [ setActivePage ] = useHeaderStore( state => [ state.setActivePage ] )

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
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

    setActivePage(this_module);

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if( (!token || token == '') && city.length > 0 ){
        push(`/${city}`);
      }
    }

  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicPage page={page} this_module={this_module} city={city} />

      <DynamicFooter cityName={city} active_page={this_module} />
    </div>
  );
}

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=3600'
  );
  
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: this_module
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
