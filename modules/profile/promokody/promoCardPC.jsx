import React from 'react';

import Typography from '@mui/material/Typography';

export default React.memo(function PromoCardPC({ item, activePromo }){
  return (
    <div className={'promoCard'}>
      <div>
        <Typography component="span" className={'title'}>{item.promo_action_text}</Typography>
        <Typography component="span" className={'text'}>{item.promo_text}</Typography>
      </div>
      <div>
        <Typography component="span" className={'endText'}>До окончания срока осталось:</Typography>
        <Typography component="span" className={'endDate'}>{item.diff_days_text}</Typography>

        <div className={'name'} onClick={ () => activePromo(item.promo_name, item.city_id) }>
          <Typography component="span">{item.promo_name}</Typography>
        </div>
      </div>
    </div>   
  )
})
