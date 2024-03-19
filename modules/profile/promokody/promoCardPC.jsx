import React from 'react';

import { useCartStore, useHeaderStore } from '@/components/store';

import Typography from '@mui/material/Typography';

export default React.memo(function PromoCardPC({ item }){

  const [ getInfoPromo ] = useCartStore( state => [ state.getInfoPromo ] )
  const [setActiveModalAlert] = useHeaderStore((state) => [state.setActiveModalAlert]);

  const activePromo = async(itemPromo) => {
    const res = await getInfoPromo(itemPromo.promo_name, itemPromo.city_id);

    if( res.st === false ) {
      setActiveModalAlert(true, res.text, false);
    }else{
      setActiveModalAlert(true, 'Промокод активирован', true);
    }
  };

  return (
    <div className={'promoCard'}>
      <div>
        <Typography component="span" className={'title'}>{item.promo_action_text}</Typography>
        <Typography component="span" className={'text'}>{item.promo_text}</Typography>
      </div>
      <div>
        <Typography component="span" className={'endText'}>До окончания срока осталось:</Typography>
        <Typography component="span" className={'endDate'}>{item.diff_days_text}</Typography>

        <div className={'name'} onClick={() => activePromo(item)}>
          <Typography component="span">{item.promo_name}</Typography>
        </div>
      </div>
    </div>   
  )
})
