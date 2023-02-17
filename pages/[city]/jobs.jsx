import React from 'react';

import { roboto } from '../../ui/Font.js'

const this_module = 'contacts';

import { api } from '../../components/api.js';

import Header from '../../components/header.js';
import Footer from '../../components/footer.js';
import PageText from '../../modules/pageText.js';

export default React.memo(function Jobs(props) {

  const { city, cats, cities, page } = props.data1;

  return (
    <div className={roboto.variable}>
      <Header city={city} cats={cats} city_list={cities} active_page={'other'} />

      <PageText page={page} className="PAGEjobs MuiGrid-spacing-xs-3" />

      <Footer cityName={city} />
    </div>
  )
})

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'jobs' 
  };

  const data1 = await api(this_module, data);
  
  data1['city'] = query.city;

  return { props: { data1 } }
}