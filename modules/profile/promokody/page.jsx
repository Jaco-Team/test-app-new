import React, { useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ProfileBreadcrumbs from '../profileBreadcrumbs.jsx';
import PromoCard from './promoCard.jsx';

import Meta from '@/components/meta.js';

import { useProfileStore } from '../../../components/store.js';

import { useSession } from 'next-auth/react';

export default function ContactsPage(props){

  const { page, this_module, city } = props;

  const { getPromoList, promoList } = useProfileStore( state => state );

  const session = useSession();

  useEffect(() => {
    if( session.data?.user?.token ){
      getPromoList(this_module, city, session.data?.user?.token);
    }
  }, [session]);

  return (
    <Meta title={page.title} description={''}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item className="Promokody mainContainer">
          
          <Grid item xs={12}>
            <Typography variant="h5" component="h1">Мои промокоды</Typography>
          </Grid>

          <Grid item xs={12}>
            
            { promoList.map( (item, key) =>
              <PromoCard key={key} item={item} />   
            ) } 
            { promoList.map( (item, key) =>
              <PromoCard key={key} item={item} />   
            ) } 
            { promoList.map( (item, key) =>
              <PromoCard key={key} item={item} />   
            ) } 
            { promoList.map( (item, key) =>
              <PromoCard key={key} item={item} />   
            ) } 
            { promoList.map( (item, key) =>
              <PromoCard key={key} item={item} />   
            ) } 
            { promoList.map( (item, key) =>
              <PromoCard key={key} item={item} />   
            ) } 

          </Grid>

        </Grid>
        <ProfileBreadcrumbs />
      </Grid>
    </Meta>
  )
}