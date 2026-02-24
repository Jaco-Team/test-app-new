import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

import { roboto } from '@/ui/Font.js';
import { api } from '@/components/api.js';
import { useCitiesStore, useHeaderStoreNew, useCartStore } from '@/components/store.js';

import Footer from '@/components/footer.js';

import { normalizeCity } from '@/utils/normalizeCity';
import { getCookie } from '@/utils/getCookie';

const DynamicPage = dynamic(() => import('@/modules/sitemap/sitemap'));

export default React.memo(function SiteMap(props) {
  const {
    city,
    cities = [],
    all_items = [],
    free_items = [],
    need_dop = [],
    links = {},
    sitemap_pages = [],
    sitemap_category = [],
    page
  } = props.data1 || {};

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

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] = useCitiesStore(
    (state) => [state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList]
  );

  const [setActivePage] = useHeaderStoreNew((state) => [state.setActivePage]);

  useEffect(() => {
    if (thisCity != city) {
      setThisCity(city);
      const found = Array.isArray(cities) ? cities.find((item) => item?.link == city) : null;
      setThisCityRu(found?.name ?? '');
      setThisCityList(cities);

      setAllItems(all_items);
      setTimeout(() => changeAllItems(), 300);
    }

    if (allItems.length == 0) setAllItems(all_items);

    setFreeItems(free_items);
    setNeedDops(need_dop);
    getCartLocalStorage();

    setActivePage('sitemap');
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicPage
        page={page}
        city={city}
        sitemap_pages={sitemap_pages}
        sitemap_category={sitemap_category}
      />

      <Footer cityName={city} links={links} active_page={'sitemap'} />
    </div>
  );
});

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600');

  const cityFromPath = normalizeCity(query?.city);
  const savedCity = normalizeCity(getCookie(req, 'city'));
  const city = cityFromPath || savedCity || 'togliatti';

  if (!cityFromPath) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const data1 = await api('home', {
    type: 'get_page_info',
    city_id: city,
    page: 'sitemap',
  });

  if (!data1) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const sitemap = await api('home', {
    type: 'get_sitemap',
    city_id: city,
  });

  data1.sitemap_pages = Array.isArray(sitemap?.pages) ? sitemap.pages : [];
  data1.sitemap_category = Array.isArray(sitemap?.category) ? sitemap.category : [];

  const footer = await api('contacts', {
    type: 'get_page_info',
    city_id: city,
    page: 'info',
  });

  data1.links = footer?.page || {};
  data1.city = city;

  return { props: { data1 } };
}
