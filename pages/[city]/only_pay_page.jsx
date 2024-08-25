import { useState, useEffect } from 'react';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation'

export default function OnlyPayPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  //console.log( 'token', token )

  function onLoadFunc(token){
    //console.log( 'token 11', token, searchParams.get('token') )
    if( token?.length > 8 && typeof window != 'undefined' ){
      
      //console.log( 'token 55', token )

      const checkout = new window.YooMoneyCheckoutWidget({
        confirmation_token: token,

        error_callback: function(error) {
          console.log(error)
        }
      });

      checkout.on('success', () => {
        checkout.destroy();
        //funcClose();

        console.log('success' )
      });

      checkout.on('fail', () => {
        checkout.destroy();
        //return 'nothing';

        console.log('fail' )
      });

      setTimeout( () => {
        checkout.render('payment-form');
      }, 300 )
    }
  }

  if( !token ){
    return false;
  }

  return (
    <>
      <Script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" onLoad={ () => onLoadFunc(token) } />

      <div id="payment-form" />
    </>
  );
}
