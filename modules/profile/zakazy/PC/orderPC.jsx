import React, { useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ProfileBreadcrumbs from '@/modules/profile/profileBreadcrumbs.jsx';
import ModalOrder from './modalOrder.jsx';
import ModalOrderDelete from './modalOrderDelete.jsx';
import OrdersList from './ordersList.jsx';

import { useProfileStore, useHeaderStoreNew } from '@/components/store.js';

export default function OrderPC({ this_module, city }) {

  const [getOrderList] = useProfileStore((state) => [state.getOrderList, state.orderList]);

  const [ token ] = useHeaderStoreNew( state => [ state.token ] )

  useEffect(() => {
    if( token && token?.length > 0 ) {
      getOrderList(this_module, city, token);
    }
  }, [token, city]);

  useEffect(() => {

    const timer = setInterval(() => {
      if( token && token?.length > 0 ) {
        getOrderList(this_module, city, token);
      }
    }, 30 * 1000);
    
    return () => clearInterval(timer);
  }, [token, city]);

  return (
    <Grid
      container
      spacing={3}
      style={{ margin: 0, width: '100%' }}
    >
      <Grid item className="Zakazy mainContainer">
        <Grid item xs={12}>
          <Typography variant="h5" component="h1">
            История заказов
          </Typography>
        </Grid>

        <Grid item xs={12} className='blockTable'>
          <OrdersList
            token={token}
            this_module={this_module}
            city={city}
          />
        </Grid>
      </Grid>

      <ProfileBreadcrumbs />
      <ModalOrder />
      <ModalOrderDelete />

    </Grid>
  );
}
