import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicFooter = dynamic(() => import('@/components/footer.js'));
const DynamicHomePage = dynamic(() => import('@/modules/akcii/page.js'));

import { roboto } from '@/ui/Font.js'
import { api } from '@/components/api.js';

import { useHomeStore, useCitiesStore, useHeaderStoreNew, useCartStore } from '@/components/store.js';

const this_module = 'akcii';

export default function Home(props) {

  const { city, cats, cities, page, all_items, free_items, need_dop, act_name, tags } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [ getBanners, setAllTags, getOneBanner ] = useHomeStore( state => [ state.getBanners, state.setAllTags, state.getOneBanner ]);

  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);
  const [setActivePage] = useHeaderStoreNew((state) => [state.setActivePage]);

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

    //getBanners('home', city);
    getOneBanner('home', city, act_name);

    if( allItems.length == 0 ){
      setAllItems(all_items);
    }

    setAllTags(tags);

    setFreeItems(free_items);
    setNeedDops(need_dop);

    getCartLocalStorage();

    setActivePage('akcii');
    
  }, [city, thisCity]);

  //<DynamicHomePage page={page} city={city} />

  page.is_one_actia = true;

  return (
    <div className={roboto.variable}>
      <DynamicHomePage page={page} city={city} />

      <DynamicFooter cityName={city} active_page={this_module} />
    </div>
  )
}

export async function getServerSideProps({ req, res, query }) {

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');

  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'akcii'
  };

  const data1 = await api('home', data);

  let data2 = {
    type: 'get_banner_one',
    city_id: query.city,
    name: query.name,
    token: null
  };

  const json = await api('home', data2);

  if( !json?.banner ){
    res.writeHead(301, { Location: '/'+query.city+'/akcii' });
    res.end();
    // return {
    //   redirect: {
    //     destination: '/'+query.city+'/akcii',
    //     permanent: true,
    //   },
    // }
  }

  data1['city'] = query.city;
  data1['act_name'] = query.name;

  if( !data1.page || data1.page == null ){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: { data1 } }
}
