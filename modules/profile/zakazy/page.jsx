import React, { useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ProfileBreadcrumbs from '../profileBreadcrumbs.jsx';
import OrdersList from './ordersList.jsx';

import Meta from '@/components/meta.js';

import { useProfileStore } from '@/components/store.js';

import { useSession } from 'next-auth/react';

export default function ContactsPage(props){

  const { page, this_module, city } = props;

  const [ getOrderList, orderList ] = useProfileStore( state => [ state.getOrderList, state.orderList ] );
  
  const session = useSession();

  useEffect(() => {
    if( session.data?.user_id ){
      getOrderList(this_module, city, session.data?.user_id);
    }
  }, [session]);

  return (
    <Meta title={page.title} description={''}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item className="Zakazy mainContainer">
          
          <Grid item xs={12}>
            <Typography variant="h5" component="h1">История заказов</Typography>
          </Grid>

          <Grid item xs={12}>
            { orderList.map( (year, ykey) =>
              <OrdersList key={ykey} is_first={ykey == 0 ? true : false} year={year} />
            ) }
          </Grid>

        </Grid>
        <ProfileBreadcrumbs />
      </Grid>
    </Meta>
  )
}
