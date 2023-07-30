import React from 'react';

import Typography from '@mui/material/Typography';

export default React.memo(function PromoCard({item}){
  return (
    <div className={'promoCard'}>
      <Typography component="span" className={'title'}>Что-то дает при применении</Typography>
      <Typography component="span" className={'text'}>{item.promo_text}</Typography>
      <Typography component="span" className={'endText'}>До окончания срока осталось:</Typography>
      <Typography component="span" className={'endDate'}>1 день</Typography>

      <div className={'name'}>
        <Typography component="span">{item.promo_name}</Typography>
      </div>
      
    </div>   
  )
})