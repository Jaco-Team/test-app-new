import React, { useEffect } from 'react';

import Script from 'next/script'

export default React.memo(function Yaauth() {

  const loadToken = () => {
    console.log( 'load' )
    YaSendSuggestToken(
      'https://jacofood.ru', 
      {
        flag: true
      }
    )
  };

  return (
    <>
      <Script 
        src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js" 
        onLoad={ () => loadToken() } 
      />
    </>
  )
})