import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('@/components/header.js'))
const DynamicFooter = dynamic(() => import('@/components/footer.js'))
const AboutPage = dynamic(() => import('@/modules/about'))

import { roboto } from '@/ui/Font.js'
import { useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { api } from '@/components/api.js';

import { shallow } from 'zustand/shallow'

const this_module = 'contacts';

export default React.memo(function About(props) {

  const { city, cats, cities, page, all_items } = props.data1;

  const [setAllItems, allItems] = useCartStore((state) => [state.setAllItems, state.allItems], shallow);

  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  const [ setActivePage ] = useHeaderStore( state => [ state.setActivePage ] )

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }

    if( allItems.length == 0 ){
      setAllItems(all_items)
    }

    setActivePage('about')
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={'other'} />

      <AboutPage page={page} city={city} />

      <DynamicFooter cityName={city} />

    </div>
  )
})

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'about' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  data1.page.content = data1.page.content.replace(
    /<a href=\"\//g,
    '<a href="/'+query.city+'/'
  );

  return { props: { data1 } }
}
