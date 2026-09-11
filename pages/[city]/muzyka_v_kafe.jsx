import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import Footer from '@/components/footer.js';
import { api } from '@/components/api.js';
import {
  useCartStore,
  useCitiesStore,
  useHeaderStoreNew,
} from '@/components/store.js';
import { roboto } from '@/ui/Font.js';
import { getCookie } from '@/utils/getCookie';
import { normalizeCity } from '@/utils/normalizeCity';

const DynamicPage = dynamic(() => import('@/modules/pageText'));
const pageSlug = 'muzyka_v_kafe';

export default React.memo(function MuzykaVKafe({ data1 }) {
  const { city, cities, page, all_items, free_items, need_dop, links } = data1;

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
  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [
      state.thisCity,
      state.setThisCity,
      state.setThisCityRu,
      state.setThisCityList,
    ]);
  const [setActivePage] = useHeaderStoreNew((state) => [state.setActivePage]);

  useEffect(() => {
    if (thisCity !== city) {
      const found = Array.isArray(cities)
        ? cities.find((item) => item?.link === city)
        : null;

      setThisCity(city);
      setThisCityRu(found?.name ?? '');
      setThisCityList(cities);
      setAllItems(all_items);
      setTimeout(changeAllItems, 300);
    }

    if (allItems.length === 0) setAllItems(all_items);
    setFreeItems(free_items);
    setNeedDops(need_dop);
    getCartLocalStorage();
    setActivePage(pageSlug);
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicPage
        page={page}
        classNamePC="PageTextPC"
        classNameMobile="PageTextMobile"
        cityName={city}
      />
      <Footer cityName={city} links={links} />
    </div>
  );
});

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=60'
  );

  const cityFromPath = normalizeCity(query?.city);
  const savedCity = normalizeCity(getCookie(req, 'city'));
  const city = cityFromPath || savedCity || 'togliatti';

  if (!cityFromPath) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const [data1, footer] = await Promise.all([
    api('contacts', {
      type: 'get_page_info',
      city_id: city,
      page: pageSlug,
    }),
    api('contacts', {
      type: 'get_page_info',
      city_id: city,
      page: 'info',
    }),
  ]);

  if (!data1?.page) {
    return { redirect: { destination: `/${city}`, permanent: false } };
  }

  const rawContent =
    typeof data1.page.content === 'string' ? data1.page.content : '';
  data1.page = {
    ...data1.page,
    content: rawContent.replace(/<a href=\"\//g, `<a href="/${city}/`),
  };
  data1.links = footer?.page || {};
  data1.city = city;

  return { props: { data1 } };
}
