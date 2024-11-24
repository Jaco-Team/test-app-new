import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

//const DynamicFooter = dynamic(() => import('@/components/footer.js'));
//const DynamicHomePage = dynamic(() => import('@/modules/home/page.js'));

import Footer from '@/components/footer.js'
import HomePage from '@/modules/home/page.js'

import { roboto } from '@/ui/Font.js'
import { api } from '@/components/api.js';

import { useHomeStore, useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';

const this_module = 'home';

export default function Home(props) {

  const { city, cats, cities, page, all_items, free_items, need_dop, tags } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [ getBanners, setAllTags ] = useHomeStore( state => [ state.getBanners, state.setAllTags ]);
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);
  const [setActivePage] = useHeaderStore((state) => [state?.setActivePage]);

  useEffect(() => {

    setTimeout( () => {
      window.scrollTo(0, 0);
    }, 100 )

    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
      setAllItems(all_items);
      
      setTimeout(() => {
        changeAllItems();
      }, 300);
    }

    getBanners(this_module, city);

    if( allItems.length == 0 ){
      setAllItems(all_items);      
    }

    setAllTags(tags);

    setFreeItems(free_items);
    setNeedDops(need_dop);

    getCartLocalStorage();

    setActivePage('home');
    
  }, [city, thisCity]);

  return (
    <div className={roboto.variable}>
      <HomePage page={page} city={city} />

      <Footer cityName={city} active_page={this_module} />
    </div>
  )
}

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');

  if( !query?.city || query?.city == '' ){
    return {
      redirect: {
        destination: '/togliatti',
        permanent: false,
      },
    }
  }

  let data = {
    type: 'get_page_info', 
    city_id: query?.city,
    page: '' 
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

  data1['city'] = query?.city;

  return { props: { data1 } }
}
