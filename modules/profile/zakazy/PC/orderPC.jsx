import React, { useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ProfileBreadcrumbs from '@/modules/profile/profileBreadcrumbs.jsx';
import ModalOrder from './modalOrder.jsx';
import ModalOrderDelete from './modalOrderDelete.jsx';
import OrdersList from './ordersList.jsx';

import { useProfileStore } from '@/components/store.js';

import { useSession } from 'next-auth/react';

export default function OrderPC({ page, this_module, city }) {

  const [getOrderList, orderList] = useProfileStore((state) => [
    state.getOrderList,
    state.orderList,
  ]);

  const session = useSession();

  useEffect(() => {
    if (session.data?.user?.token) {
      getOrderList(this_module, city, session.data?.user?.token);
    }
  }, [session]);

  return (
    <Grid
      container
      spacing={3}
      style={{ margin: 0, width: '100%' }}
      sx={{ display: { xs: 'none', md: 'none', lg: 'flex' } }}
    >
      <Grid item className="Zakazy mainContainer">
        <Grid item xs={12}>
          <Typography variant="h5" component="h1">
            История заказов
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {orderList.map((year, ykey) => (
            <OrdersList
              key={ykey}
              is_first={ykey == 0 ? true : false}
              year={year}
              token={session.data?.user?.token}
              this_module={this_module}
              city={city}
            />
          ))}
        </Grid>
      </Grid>
      <ProfileBreadcrumbs />
      <ModalOrder />
      <ModalOrderDelete />
    </Grid>
  );
}
