import React, { useEffect } from 'react';

export default React.memo(function Yaauth() {

  useEffect(() => {
    YaSendSuggestToken(
      'https://jacofood.ru', 
      {
        flag: true
      }
    )
  }, []);

  return (
    <></>
  )
})