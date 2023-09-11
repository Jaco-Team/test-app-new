import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('@/components/header.js'), { ssr: false })
const DynamicFooter = dynamic(() => import('@/components/footer.js'), { ssr: false })
const DynamicPage = dynamic(() => import('@/modules/profile/zakazy/page'), { ssr: false })

import { api } from '@/components/api.js';
import { useCitiesStore, useHeaderStore, useCartStore } from '@/components/store.js';
import { roboto } from '@/ui/Font.js'

//import { authOptions } from '../api/auth/[...nextauth]'
//import { getServerSession } from "next-auth/next"

const this_module = 'zakazy';

export default function Zakazy(props) {

  const { city, cats, cities, page, all_items } = props.data1;

  const [setAllItems, allItems] = useCartStore((state) => [state.setAllItems, state.allItems]);

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

    setActivePage(this_module)
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={this_module} />

      <DynamicPage page={page} this_module={this_module} city={city} />

      <DynamicFooter cityName={city} />
    </div>
  );
}

export async function getServerSideProps({ req, res, query }) {

  //const session = await getServerSession(req, res, authOptions)

  //console.log( 'pro session', session )

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  )
  
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: this_module
  };

  const data1 = await api(this_module, data);
  
  data1['city'] = query.city;

  return { props: { data1 } }
}
