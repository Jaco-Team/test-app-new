import React, { useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ProfileBreadcrumbs from '../profileBreadcrumbs.jsx';
import PromoCardPC from './promoCardPC.jsx';

import { useProfileStore, useHeaderStore } from '../../../components/store.js';

export default function PromokodyPC({ this_module, city }) {

  const [ getPromoList, promoListActive ] = useProfileStore( state => [ state.getPromoList, state.promoListActive ]);
  const [ token ] = useHeaderStore( state => [ state.token ] )

  useEffect(() => {
    if( token && token.length > 0 ) {
      getPromoList(this_module, city, token);
    }
  }, [token]);

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }} sx={{ display: { xs: 'none', md: 'none', lg: 'flex' } }}>
      <Grid item className="Promokody mainContainer">
        <Grid item xs={12}>
          <Typography variant="h5" component="h1">
            Мои промокоды
          </Typography>
        </Grid>

        <Grid item xs={12} className='promo_list_active'>
          {promoListActive.map((item, key) => (
            <PromoCardPC key={key} item={item} />
          ))}
        </Grid>

      </Grid>
      <ProfileBreadcrumbs />
    </Grid>
  );
}
