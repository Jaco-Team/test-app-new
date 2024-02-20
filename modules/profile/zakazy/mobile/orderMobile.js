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

  const [list, setList] = useState([]);

  const [getOrderList, orderList, year, setActiveModalYear, setYear] =
    useProfileStore((state) => [state.getOrderList, state.orderList, state.year, state.setActiveModalYear, state.setYear]);

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

        console.log( 'city3', city );
      }
    }, 30 * 1000);
    
    return () => clearInterval(timer);
  }, [city]);

  useEffect(() => {
    if (year) {
      const list = orderList.find((item) => item.year === year);
      setList(list);
    } else {
      setList(orderList[0]);
      setYear(orderList[0]?.year);
    }
  }, [orderList, year]);

  //<ModalOrderMobile />

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="ZakazyMobile">
      <div className="zakazyLogin">
        <Link href={'/' + city + '/account'}>
          <ArrowLeftMobile />
        </Link>
        { !orderList || orderList?.length == 0 ? null :
          <div className="loginContainer">
            <span>{list?.year}</span>
            <VectorDownMobile onClick={() => setActiveModalYear(true, orderList)}/>
          </div>
        }
      </div>
      <div className="zakazyList" style={{ marginBottom: !orderList.length ? '85.470085470085vw' : null}}>
        <div className="zakazyHead">
          <span>номер</span>
          <span>статус</span>
          <span>дата</span>
          <span>стоимость</span>
        </div>
        {list?.orders?.map((order, ykey) => (
          <OrdersItemMobile
            key={order?.order_id}
            order={order}
            token={token}
            this_module={this_module}
            city={city}
            last={list?.orders?.length-1 == ykey ? 'last' : ''}
          />
        ))}
      </div>

      <ModalOrderYear />
      
      <ModalOrderMobileDelete />
    </Box>
  );
}
