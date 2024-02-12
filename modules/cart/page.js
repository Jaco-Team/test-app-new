import React, { useEffect } from 'react';

import Meta from '@/components/meta.js';

import CartMobile from './cartMobile';
import CartMenuMobile from './cartMenuMobile';
import CartMapPoints from './cartMapPoints';
import PayForm from './payForm';
import DataTimePicker from '@/modules/cartForm/dataTimePicker';

import { useHeaderStore } from '@/components/store';

export default function CartPage({ page, cityName }) {

  const [matches] = useHeaderStore((state) => [state.matches]);

  /*useEffect(() => {
    setTimeout(() => {
      if (!matches) {
        window.location.href = '/' + cityName;
      }
    }, 1000);    
  }, []);*/

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
