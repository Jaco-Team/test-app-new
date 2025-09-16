import React, { useEffect, memo } from 'react';

import Meta from '@/components/meta.js';

import CartMobile from './cartMobile';
import CartMenuMobile from './cartMenuMobile';
import CartMapPoints from './cartMapPoints';
import PayForm from './payForm';
import DataTimePicker from '@/modules/cartForm/dataTimePicker';
import ConfirmForm from './confirmForm';
import MailForm from './mailForm';
import DopsForm from './dopsForm';
//import useYandexMetrika from '@/components/useYandexMetrika';
// import { useCartStore } from '@/components/store';

export default memo(function CartPage({ page, cityName }) {

  /*const [ check_need_dops, getItems ] = useCartStore( state => [ state.check_need_dops, state.getItems ] );

  useEffect( () => {
    check_need_dops();
    getItems();  
  }, [] );*/

  // useEffect( () => {
    //console.log( 'useYandexMetrika()' )
    //useYandexMetrika(cityName, 'cart', 'cart');
  // }, [] );

  return (
    <Meta title={page?.title ?? ''} description={page?.description ?? ''}>
      
      <CartMobile cityName={cityName} /> 
      <CartMenuMobile cityName={cityName} />
      <CartMapPoints />
      <DataTimePicker />
      <ConfirmForm />
      <MailForm cityName={cityName} />
      <DopsForm />
      <PayForm />
    </Meta>
  );
})
