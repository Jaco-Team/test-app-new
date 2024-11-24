import React from 'react';

import Grid from '@mui/material/Grid';
import Link from 'next/link'

import { useHeaderStoreNew, useCitiesStore } from '@/components/store.js';

export default function ProfileBreadcrumbs() {

  const [ activePage ] = useHeaderStoreNew( state => [ state.activePage ] )
  const [ thisCity ] = useCitiesStore(state => [ state.thisCity ]);

  return (
    <Grid item className="DocsBreadcrumbs profile" style={{ paddingBottom: 15 }}>
      <div>
        <div>
          <span>Личный кабинет</span>
        </div>
        { thisCity?.length == 0 ? null :
          <ul>
            <li><Link href={"/"+thisCity+"/zakazy"} className={ activePage == 'zakazy' ? 'active' : '' }>История заказов</Link></li>
            <li><Link href={"/"+thisCity+"/profile"} className={ activePage == 'profile' ? 'active' : '' }>Личные данные</Link></li>
            <li><Link href={"/"+thisCity+"/promokody"} className={ activePage == 'promokody' ? 'active' : '' }>Мои промокоды</Link></li>
          </ul>
        }
      </div>
    </Grid>
  )
}
