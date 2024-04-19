import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicFooter = dynamic(() => import('@/components/footer.js'));
const DynamicHomePage = dynamic(() => import('@/modules/home/page.js'));

import { roboto } from '@/ui/Font.js'
import { api } from '@/components/api.js';

import { useHomeStore, useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';

const this_module = 'category';

export default function Home(props) {

  const { city, cats, cities, page, all_items, free_items, need_dop, category } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [ getBanners ] = useHomeStore( state => [ state.getBanners ]);
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);
  const [setActivePage] = useHeaderStore((state) => [state.setActivePage]);

  useEffect(() => {

    setTimeout( () => {
      window.scrollTo(0, 0);
    }, 100 )

    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)

      setTimeout(() => {
        changeAllItems();
      }, 300);
    }

    getBanners('home', city);

    if( allItems.length == 0 ){
      setAllItems(all_items);
    }

    setFreeItems(free_items);
    setNeedDops(need_dop);

    getCartLocalStorage();

    setActivePage('category');
    
  }, [city, thisCity]);

  return (
    <div className={roboto.variable}>
      <DynamicHomePage page={page} city={city} />

      <DynamicFooter cityName={city} active_page={this_module} />
    </div>
  )
}

export async function getServerSideProps({ req, res, query }) {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=3600'
  );

  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: query.category 
  };

  const data1 = await api('home', data);

  console.log('data1', data1.page)

  data1['city'] = query.city;
  data1['category'] = query.category;

  if( !data1.page || data1.page == null ){
    /*return {
      notFound: true,
    }*/

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: { data1 } }
}
