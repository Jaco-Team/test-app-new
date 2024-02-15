import React, { useEffect } from 'react';

import Meta from '@/components/meta.js';

import CartMobile from './cartMobile';
import CartMenuMobile from './cartMenuMobile';
import CartMapPoints from './cartMapPoints';
import PayForm from './payForm';
import DataTimePicker from '@/modules/cartForm/dataTimePicker';

import { useCartStore } from '@/components/store';

export default function CartPage({ page, cityName }) {

  const [ check_need_dops, getItems ] = useCartStore( state => [ state.check_need_dops, state.getItems ] );

  useEffect( () => {
    check_need_dops();
    getItems();  
  }, [] );

  return (
    <Meta title={page.title} description={page.description}>
      
      <CartMobile cityName={cityName} /> 
      <CartMenuMobile cityName={cityName} />
      <CartMapPoints />
      <DataTimePicker />
      
      <PayForm />
    </Meta>
  );
}
