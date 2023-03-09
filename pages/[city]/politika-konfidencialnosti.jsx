import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

import { roboto } from '../../ui/Font.js'

import { api } from '../../components/api.js';

const DynamicHeader = dynamic(() => import('../../components/header.js'))
const DynamicFooter = dynamic(() => import('../../components/footer.js'))
const DynamicPage = dynamic(() => import('../../modules/pageText.js'))

import { useCitiesStore } from '../../components/store.js';

const this_module = 'contacts';

export default React.memo(function PolitikaKonfidencialnosti(props) {

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

      <DynamicPage page={page} className="PAGEpolitic MuiGrid-spacing-xs-3" />

      <DynamicFooter cityName={city} />
    </div>
  )
})

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'politika-konfidencialnosti' 
  };

  const data1 = await api(this_module, data);
  
  data1['city'] = query.city;

  data1.page.content = data1.page.content.replace(
    /<a href=\"\//g,
    '<a href="/'+query.city+'/'
  );

  return { props: { data1 } }
}