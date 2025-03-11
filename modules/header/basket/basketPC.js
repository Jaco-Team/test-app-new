import React, { useState, useEffect } from 'react';

import { useHeaderStoreNew, useCartStore, useCitiesStore, useProfileStore } from '@/components/store.js';

import TablePC from './tablePC';

import { roboto } from '@/ui/Font';
import MyTextInput from '@/ui/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';

import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

import Cookies from 'js-cookie'

const dopText = 'Блюда могут содержать ингредиенты, обладающие аллергенными свойствами. Если у вам есть аллергия на какой-либо продукт, пожалуйста, уточняйте состав в меню или на кассе. Обратите внимание, что мы не можем исключить или заменить ингредиенты, но с удовольствием поможем выбрать блюдо с подходящим составом.';

export default function BasketPC() {
  const [promo, setPromo] = useState('');
  //const [scrollBasket, setScrollBasket] = useState(0);

  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  const [getInfoPromo, checkPromo, allPrice, promoInfo, itemsCount, setActiveModalBasket, itemsOffDops] = useCartStore((state) => [state.getInfoPromo, state.checkPromo, state.allPrice, state.promoInfo, state.itemsCount, state.setActiveModalBasket, state.itemsOffDops]);
  const [openBasket, setActiveBasket, targetBasket] = useHeaderStoreNew((state) => [state?.openBasket, state?.setActiveBasket, state?.targetBasket]);
  
  const [ saveUserActions ] = useProfileStore((state) => [state.saveUserActions]);

  useEffect(() => {
    if (Cookies.get('promo_name') && Cookies.get('promo_name').length > 0) {
      setPromo(Cookies.get('promo_name'));
    }
  }, [promoInfo]);

  //const listenScrollEvent = (event) => setScrollBasket(event.target.scrollTop);

  function openBasketModal(){
    setActiveModalBasket(true); 
    setActiveBasket(false); 

    // if( isAuth == 'auth' ){
    //   setActiveModalBasket(true); 
    //   setActiveBasket(false); 
    //   //setScrollBasket(0);
    // }else{
    //   setActiveBasket(false); 
    //   //setScrollBasket(0);
    //   setActiveModalAuth(true);
    // }

    saveUserActions('open_cart', '', allPrice);

    if (Cookies.get('promo_name') && Cookies.get('promo_name').length > 0) {
      getInfoPromo(Cookies.get('promo_name'), thisCity)
    }
  }

  function setPromoText(event){

    if (event.keyCode === 13) {
      getInfoPromo(promo, thisCity);

      setTimeout( () => {
        getInfoPromo(promo, thisCity)
      }, 300 )
    }
  }

  return (
    <>
      <Popover
        id="simple-popover"
        open={openBasket}
        anchorEl={targetBasket}
        onClose={() => setActiveBasket(false) }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        marginThreshold={0}
        className={roboto.variable}
      >
        <div>

          {/* <span className='dopText'>{dopText}</span> */}

          <Accordion className='dopText_accordion'>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Об аллергенах</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {dopText}
            </AccordionDetails>
          </Accordion>

          <TablePC />

          <div className="SpacePromoRoot">
            <MyTextInput
              placeholder="Есть промокод"
              value={promo}
              label=""
              name="promo"
              id="promo"
              onKeyDown={setPromoText}
              onBlur={() => getInfoPromo(promo, thisCity)}
              func={(event) => setPromo(event.target.value)}
              inputAdornment={
                <InputAdornment position="end">
                  {checkPromo ? checkPromo.st ? <div className="circleInput"></div> : <div className="circleInput" style={{ background: '#DD1A32' }}></div> : null}
                </InputAdornment>
              }
            />
            {checkPromo ? checkPromo.st && itemsOffDops.length ? <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div> : null : null}
            {/* {promoInfo?.items_on_price?.length ? promoItemsFind ? <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div> : null 
              : promoInfo?.status_promo && itemsCount ? <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div> : null} */}
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
      { openBasket ? <div className="blockShadowBasket" /> : false }
    </>
  );
}
