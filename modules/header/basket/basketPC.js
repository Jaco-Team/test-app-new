import React, { useState, useEffect } from 'react';

import { useHeaderStore, useCartStore, useCitiesStore } from '@/components/store.js';

import TablePC from './tablePC';

import { roboto } from '@/ui/Font';
import MyTextInput from '@/ui/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';

import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';

export default function BasketPC() {
  const [promo, setPromo] = useState('');
  const [scrollBasket, setScrollBasket] = useState(0);

  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  const [getInfoPromo, checkPromo, allPrice, promoInfo, promoItemsFind, itemsCount, setActiveModalBasket] = useCartStore((state) => [state.getInfoPromo, state.checkPromo, state.allPrice, state.promoInfo, state.promoItemsFind, state.itemsCount, state.setActiveModalBasket]);
  const [openBasket, setActiveBasket, targetBasket, isAuth, setActiveModalAuth] = useHeaderStore((state) => [state.openBasket, state.setActiveBasket, state.targetBasket, state.isAuth, state.setActiveModalAuth]);
  
  useEffect(() => {
    if (localStorage.getItem('promo_name') && localStorage.getItem('promo_name').length > 0) {
      setPromo(localStorage.getItem('promo_name'));
    }
  }, [promoInfo]);

  const listenScrollEvent = (event) => setScrollBasket(event.target.scrollTop);

  function openBasketModal(){
    if( isAuth == 'auth' ){
      setActiveModalBasket(true); 
      setActiveBasket(false); 
      setScrollBasket(0);
    }else{
      setActiveBasket(false); 
      setScrollBasket(0);
      setActiveModalAuth(true);
    }
  }

  return (
    <>
      <Popover
        id="simple-popover"
        open={openBasket}
        anchorEl={targetBasket}
        onClose={() => { setActiveBasket(false); setScrollBasket(0) }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        marginThreshold={0}
        className={roboto.variable}
      >
        <div onScroll={listenScrollEvent}>

          <TablePC />

          <div className="SpacePromoRoot">
            <MyTextInput
              className="SpacePromo"
              placeholder="Есть промокод"
              value={promo}
              label=""
              onBlur={() => getInfoPromo(promo, thisCity)}
              func={(event) => setPromo(event.target.value)}
              inputAdornment={
                <InputAdornment position="end">
                  {promoInfo ? promoInfo.status_promo ? <div className="circleInput"></div> : <div className="circleInput" style={{ background: '#DD1A32' }}></div> : null}
                </InputAdornment>
              }
            />
            {promoInfo?.items_on_price?.length ? promoItemsFind ? <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div> : null 
              : promoInfo?.status_promo && itemsCount ? <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div> : null}
          </div>

          <div className="DescPromo">
            <span style={{ color: promoInfo?.status_promo ? 'rgba(0, 0, 0, 0.80)' : '#DD1A32'}}>{checkPromo?.text}</span>
          </div>

          <div className="InCart">
            <Button
              variant="contained"
              disabled={!itemsCount}
              onClick={openBasketModal}
            >
              <span>Оформить заказ</span>
            </Button>
          </div>

        </div>
      </Popover>
      {scrollBasket ? <div className="blockShadowBasket" /> : null}
    </>
  );
}
