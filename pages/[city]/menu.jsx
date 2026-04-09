import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

import Footer from '@/components/footer.js'
const DynamicHomePage = dynamic(() => import('@/modules/home/page.js'));

import { roboto } from '@/ui/Font.js'
import { api } from '@/components/api.js';

import { useHomeStore, useCitiesStore, useHeaderStoreNew, useCartStore } from '@/components/store.js';

const this_module = 'home';

import { normalizeCity } from '@/utils/normalizeCity'
import { getCookie } from '@/utils/getCookie'

export default function Home(props) {

  const { city, cats, cities, page, all_items, free_items, need_dop, tags, links } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [ getBanners, setAllTags, seedItemsCatFromPage, getItemsCat ] = useHomeStore( state => [ state.getBanners, state.setAllTags, state.seedItemsCatFromPage, state.getItemsCat ]);
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);
  const [setActivePage] = useHeaderStoreNew((state) => [state.setActivePage]);

  useEffect(() => {
    if (thisCity === city && allItems.length > 0) {
      return;
    }

    const found = Array.isArray(cities) ? cities.find(item => item?.link == city) : null;

    setThisCity(city);
    setThisCityRu(found?.name ?? '');
    setThisCityList(cities);
    setAllItems(all_items);

    const timer = setTimeout(() => {
      changeAllItems();
    }, 300);

    return () => clearTimeout(timer);
  }, [allItems.length, all_items, changeAllItems, cities, city, setAllItems, setThisCity, setThisCityList, setThisCityRu, thisCity]);

  useEffect(() => {

    setTimeout( () => {
      window.scrollTo(0, 0);
    }, 100 )

    getBanners(this_module, city);

    if( allItems.length == 0 ){
      setAllItems(all_items);
    }

    seedItemsCatFromPage(cats, all_items, city);
    getItemsCat(this_module, city);

    setAllTags(tags);

    setFreeItems(free_items);
    setNeedDops(need_dop);

    getCartLocalStorage();

    setActivePage('home');
    
  }, [allItems.length, all_items, cats, city, free_items, getBanners, getCartLocalStorage, getItemsCat, need_dop, seedItemsCatFromPage, setActivePage, setAllItems, setAllTags, setFreeItems, setNeedDops, tags]);

  return (
    <div className={roboto.variable}>
      <DynamicHomePage page={page} city={city} />

      <Footer cityName={city} active_page={this_module} links={links} />
    </div>
  )
}

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=60');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');

  const cityFromPath = normalizeCity(query?.city);
  const savedCity = normalizeCity(getCookie(req, 'city'));
  const city = cityFromPath || savedCity || 'togliatti';

  // если в URL нет валидного города — уводим на сохранённый/дефолтный
  if (!cityFromPath) {
    return { redirect: { destination: `/${city}`, permanent: false } }; // 307
  }

  const data = {
    type: 'get_page_info',
    city_id: city,
    page: 'menu',
  };

  const data1 = await api(this_module, data);

  // если бэк не отдал страницу — тоже уводим в /{city}
  if (!data1?.page) {
    return { redirect: { destination: `/${city}`, permanent: false } }; // 307
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
