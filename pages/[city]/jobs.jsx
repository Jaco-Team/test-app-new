import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

import { roboto } from '@/ui/Font.js'
import { api } from '@/components/api.js';
import { useCitiesStore, useHeaderStore } from '@/components/store.js';

const DynamicHeader = dynamic(() => import('@/components/header.js'))
const DynamicFooter = dynamic(() => import('@/components/footer.js'))
const DynamicPage = dynamic(() => import('@/modules/pageText.js'))

const this_module = 'contacts';

export default React.memo(function Jobs(props) {

  const { city, cats, cities, page } = props.data1;
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  const [ setActivePage ] = useHeaderStore( state => [ state.setActivePage ] )

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }

    setActivePage('jobs')
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={'other'} />

      <DynamicPage page={page} className="PAGEjobs MuiGrid-spacing-xs-3" />

      <DynamicFooter cityName={city} />
    </div>
  )
})

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  )
  
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'jobs' 
  };

  const data1 = await api(this_module, data);
  
  data1['city'] = query.city;

  return { props: { data1 } }
}