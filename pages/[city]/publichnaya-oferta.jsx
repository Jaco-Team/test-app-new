import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { roboto } from '@/ui/Font.js';
import { api } from '@/components/api.js';
import {
  useCitiesStore,
  useHeaderStore,
  useCartStore,
} from '@/components/store.js';

const DynamicHeader = dynamic(() => import('@/components/header.js'), { ssr: false });
const DynamicFooter = dynamic(() => import('@/components/footer.js'), { ssr: false });
const DynamicPage = dynamic(() => import('@/modules/pageText'), { ssr: false });

const this_module = 'contacts';

export default React.memo(function PublichnayaOferta(props) {
  const { city, cats, cities, page, all_items } = props.data1;

  const [setAllItems, allItems] = useCartStore((state) => [
    state.setAllItems,
    state.allItems,
  ]);

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
    }

    if (allItems.length == 0) {
      setAllItems(all_items);
    }

    setActivePage('publichnaya-oferta');
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicHeader
        city={city}
        cats={cats}
        city_list={cities}
        active_page={'other'}
      />

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
    page: 'publichnaya-oferta',
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  data1.page.content = data1.page.content.replace(
    /<a href=\"\//g,
    '<a href="/' + query.city + '/'
  );

  return { props: { data1 } };
}
