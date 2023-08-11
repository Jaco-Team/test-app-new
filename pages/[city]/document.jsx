import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

const DynamicHeader = dynamic(() => import('@/components/header.js'), { ssr: false });
const DynamicFooter = dynamic(() => import('@/components/footer.js'), { ssr: false };
const DocumentPageMobile = dynamic(() => import('@/modules/document/documentMobile'), { ssr: false });

import { roboto } from '@/ui/Font.js';
import { useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { api } from '@/components/api.js';

const this_module = 'contacts';

export default React.memo(function Document(props) {
  const { city, cats, cities, page, all_items } = props.data1;

  const [setAllItems, allItems] = useCartStore((state) => [state.setAllItems, state.allItems]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList]);

  const [setActivePage, matches] = useHeaderStore((state) => [state.setActivePage, state.matches]);

  useEffect(() => {
    if (!matches) {
      window.location.href = '/' + city;
    }
  }, [matches]);

  useEffect(() => {
    if (thisCity != city) {
      setThisCity(city);
      setThisCityRu(cities.find((item) => item.link == city)['name']);
      setThisCityList(cities);
    }

    if (allItems.length == 0) {
      setAllItems(all_items);
    }

    setActivePage('document');
  }, []);

  return (
    <>
      {!matches ? null : (
        <div className={roboto.variable}>
          <DynamicHeader city={city} cats={cats} city_list={cities} active_page={'other'}/>

          <DocumentPageMobile page={page} cityName={city} />

          <DynamicFooter cityName={city} active_page={'document'} />
        </div>
      )}
    </>
  );
});

export async function getServerSideProps({ req, res, query }) {
  // let data = {
  //   type: 'get_page_info',
  //   city_id: query.city,
  //   page: 'about',
  // };

  // const data1 = await api(this_module, data);

  // data1['city'] = query.city;

  // // data1.page.content = data1.page.content.replace(
  // //   /<a href=\"\//g,
  // //   '<a href="/' + query.city + '/'
  // // );

  // return { props: { data1 } };

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  )
  
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'about' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}
