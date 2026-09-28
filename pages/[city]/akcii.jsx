import { loadHeaderCategories } from '@/utils/serverHeaderCategories';
import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import Footer from '@/components/footer.js';
import StructuredData from '@/components/structuredData';
import { promotionListSchema } from '@/utils/structuredData';
const DynamicPage = dynamic(() => import('@/modules/akcii/page.js'));

import { roboto } from '@/ui/Font.js';
import { api } from '@/components/api.js';
import {
  useCitiesStore,
  useHeaderStoreNew,
  useCartStore,
  useHomeStore,
} from '@/components/store.js';

const this_module = 'akcii';

import { normalizeCity } from '@/utils/normalizeCity';
import { getCookie } from '@/utils/getCookie';

export default function Akcii(props) {
  const { city, cats, cities, page, all_items, free_items, need_dop, links } =
    props.data1;

  const [
    setAllItems,
    setFreeItems,
    allItems,
    changeAllItems,
    setNeedDops,
    getCartLocalStorage,
  ] = useCartStore((state) => [
    state.setAllItems,
    state.setFreeItems,
    state.allItems,
    state.changeAllItems,
    state.setNeedDops,
    state.getCartLocalStorage,
  ]);
  const [getItemsCat] = useHomeStore((state) => [state.getItemsCat]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [
      state.thisCity,
      state.setThisCity,
      state.setThisCityRu,
      state.setThisCityList,
    ]);
  const [setActivePage] = useHeaderStoreNew((state) => [state.setActivePage]);

  useEffect(() => {
    if (thisCity != city) {
      setThisCity(city);
      //setThisCityRu( cities.find( item => item.link == city )['name'] );

      const found = Array.isArray(cities)
        ? cities.find((item) => item?.link == city)
        : null;
      setThisCityRu(found?.name ?? '');

      setThisCityList(cities);
      setAllItems(all_items);

      setTimeout(() => {
        changeAllItems();
      }, 300);
    }

    if (allItems.length == 0) {
      setAllItems(all_items);
    }

    setFreeItems(free_items);
    setNeedDops(need_dop);
    getItemsCat('home', city);
    getCartLocalStorage();
    setActivePage(this_module);
  }, [city]);

  return (
    <div className={roboto.variable}>
      <DynamicPage page={page} city={city} initialBanners={props.banners} />
      <StructuredData data={props.data1.schema} />

      <Footer cityName={city} links={links} />
    </div>
  );
}

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=60'
  );
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');

  const cityFromPath = normalizeCity(query?.city);
  const savedCity = normalizeCity(getCookie(req, 'city'));
  const city = cityFromPath || savedCity || 'togliatti';

  if (!cityFromPath) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const data1 = await api('akcii', {
    type: 'get_page_info',
    city_id: city,
    page: 'akcii',
  });

  if (!data1 || data1?.page == null) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const [footer, bannerResponse] = await Promise.all([
    api('contacts', { type: 'get_page_info', city_id: city, page: 'info' }),
    api('home', { type: 'get_banners', city_id: city, token: '' }),
  ]);

  data1.links = footer?.page || {};
  data1.city = city;
  const banners = Array.isArray(bannerResponse?.banners)
    ? bannerResponse.banners.filter(
        (banner) =>
          Number(banner?.is_active) === 1 &&
          Number(banner?.is_active_actii) === 1
      )
    : [];
  data1.schema = promotionListSchema(city, banners);

  data1.headerCategories = await loadHeaderCategories(city, data1.cats);

  return { props: { data1, banners } };
}
