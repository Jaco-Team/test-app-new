import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useProfileStore, useHeaderStore } from '@/components/store.js';

import Box from '@mui/material/Box';

import OrdersItemMobile from './orderItemMobile';
import ModalOrderYear from './modalOrderYear';
//import ModalOrderMobile from './modalOrderMobile';
import ModalOrderMobileDelete from './modalOrderMobileDelete';

import { ArrowLeftMobile, VectorDownMobile } from '@/ui/Icons.js';

export default function OrderMobile({ city, this_module }) {

  const [getOrderList, orderList] =
    useProfileStore((state) => [state.getOrderList, state.orderList]);

  const [ token ] = useHeaderStore( state => [ state.token ] )

  useEffect(() => {
    if( token && token.length > 0 ) {
      getOrderList(this_module, city, token);
    }
  }, [token, city]);

  useEffect(() => {
    const timer = setInterval(() => {
      if( token && token.length > 0 ) {
        getOrderList(this_module, city, token);
      }
    }, 30 * 1000);
    
    return () => clearInterval(timer);
  }, [city]);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="ZakazyMobile">
      <div className="zakazyLogin">
        <Link href={'/' + city + '/account'}>
          <ArrowLeftMobile />
        </Link>
        <div className="loginContainer">
            <span>История заказов</span>
          </div>
      </div>
      <div className="zakazyList" style={{ marginBottom: !orderList.length ? '85.470085470085vw' : null}}>
        <div className="zakazyHead">
          <span>номер</span>
          <span>статус</span>
          <span>дата</span>
          <span>стоимость</span>
        </div>
        {orderList?.map((order, ykey) => (
          <OrdersItemMobile
            key={order?.order_id}
            order={order}
            token={token}
            this_module={this_module}
            city={city}
            last={orderList?.length-1 == ykey ? 'last' : ''}
          />
        ))}
      </div>

      <ModalOrderYear />
      
      <ModalOrderMobileDelete />
    </Box>
  );
}
