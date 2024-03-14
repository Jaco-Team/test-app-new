import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { roboto } from '@/ui/Font.js';
import { api } from '@/components/api.js';
import {
  useCitiesStore,
  useHeaderStore,
  useCartStore,
} from '@/components/store.js';

const DynamicFooter = dynamic(() => import('@/components/footer.js'));
const DynamicPage = dynamic(() => import('@/modules/pageText'));

const this_module = 'contacts';

export default React.memo(function Instpayorders(props) {
  const { city, cats, cities, page, all_items, free_items, need_dop } = props.data1;

  const [setAllItems, setFreeItems, allItems, changeAllItems, setNeedDops, getCartLocalStorage] = useCartStore((state) => [state.setAllItems, state.setFreeItems, state.allItems, state.changeAllItems, state.setNeedDops, state.getCartLocalStorage]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [
      state.thisCity,
      state.setThisCity,
      state.setThisCityRu,
      state.setThisCityList,
    ]);

  const [setActivePage] = useHeaderStore((state) => [state.setActivePage]);

  useEffect(() => {
    if (thisCity != city) {
      setThisCity(city);
      setThisCityRu(cities.find((item) => item.link == city)['name']);
      setThisCityList(cities);

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

    setActivePage('instpayorders');
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicPage page={page} classNamePC="PageTextPC" classNameMobile="PageTextMobile" cityName={city}/>

      <DynamicFooter cityName={city} />
    </div>
  );
});

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  );

  let data = {
    type: 'get_page_info',
    city_id: query.city,
    page: 'instpayorders',
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  /*data1.page.content = data1.page.content.replace(
    /<a href=\"\//g,
    '<a href="/'+query.city+'/'
  );*/

  return { props: { data1 } };
}
