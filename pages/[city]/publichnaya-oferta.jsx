import React, { useEffect } from 'react';

import { roboto } from '../../ui/Font.js'

import { api } from '../../components/api.js';

import Header from '../../components/header.js';
import Footer from '../../components/footer.js';
import PageText from '../../modules/pageText.js';

import { useCitiesStore } from '../../components/store.js';

const this_module = 'contacts';

export default React.memo(function PublichnayaOferta(props) {

  const { city, cats, cities, page } = props.data1;
  const { thisCity, setThisCity, setThisCityRu, setThisCityList } = useCitiesStore(state => state)

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }
  }, [city, cities, thisCity, setThisCity, setThisCityRu, setThisCityList]);

  return (
    <div className={roboto.variable}>
      <Header city={city} cats={cats} city_list={cities} active_page={'other'} />

      <PageText page={page} className="PAGEpublick MuiGrid-spacing-xs-3" />

      <Footer cityName={city} />
    </div>
  )
})

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'publichnaya-oferta' 
  };

  const data1 = await api(this_module, data);
  
  data1['city'] = query.city;

  data1.page.content = data1.page.content.replace(
    /<a href=\"\//g,
    '<a href="/'+query.city+'/'
  );

  return { props: { data1 } }
}