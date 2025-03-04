import React from 'react';

import Grid from '@mui/material/Grid';
import Link from 'next/link'

import { useHeaderStoreNew, useCitiesStore, useProfileStore } from '@/components/store.js';

export default function ProfileBreadcrumbs() {

  const [ activePage ] = useHeaderStoreNew( state => [ state.activePage ] )
  const [ thisCity ] = useCitiesStore(state => [ state.thisCity ]);
  const [ count_promo, count_orders ] = useProfileStore( state => [state.count_promo, state.count_orders]);

  return (
    <Grid item className="DocsBreadcrumbs profile" style={{ paddingBottom: 15 }}>
      <div>
        <div>
          <span>Личный кабинет</span>
        </div>
        { thisCity?.length == 0 ? null :
          <ul>
            <li><Link href={"/"+thisCity+"/zakazy"} className={ activePage == 'zakazy' ? 'active' : '' }>История заказов { count_orders > 0 ? <div className="count_promo_order" /> : false }</Link></li>
            <li><Link href={"/"+thisCity+"/profile"} className={ activePage == 'profile' ? 'active' : '' }>Личные данные</Link></li>
            <li><Link href={"/"+thisCity+"/promokody"} className={ activePage == 'promokody' ? 'active' : '' }>Мои промокоды { count_promo > 0 ? <div className="count_promo_order" /> : false }</Link></li>
          </ul>
        }
      </div>
    </Grid>
  )
}
