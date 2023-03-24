import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

import { roboto } from '../../ui/Font.js'

const DynamicHeader = dynamic(() => import('../../components/header.js'))
const DynamicFooter = dynamic(() => import('../../components/footer.js'))
const AboutPage = dynamic(() => import('@/modules/about'))

import { useCitiesStore } from '../../components/store.js';
import { api } from '../../components/api.js';

const this_module = 'contacts';

export default React.memo(function About(props) {

  const { city, cats, cities, page } = props.data1;
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={'other'} />

      <AboutPage />

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

  // console.log(data1)
  
  data1['city'] = query.city;

  data1.page.content = data1.page.content.replace(
    /<a href=\"\//g,
    '<a href="/'+query.city+'/'
  );

  return { props: { data1 } }
}
