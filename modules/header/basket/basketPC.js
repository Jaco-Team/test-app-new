import React, { useState, useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { useHeaderStore, useCartStore, useCitiesStore } from '@/components/store.js';

import TablePC from './tablePC';

import { roboto } from '@/ui/Font';
import MyTextInput from '@/ui/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';

// import Link from 'next/link';

import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';

export default function BasketPC() {
  console.log('BasketPC render');

  const [promo, setPromo] = useState('');
  const [scrollBasket, setScrollBasket] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('promo_name') && localStorage.getItem('promo_name').length > 0) {
      setPromo(localStorage.getItem('promo_name'));
    }
  }, []);

  // countCart  cartItems  promoST  originPrice allPrice promoName promoText - переменные

  // handleClick handleClose add minus checkPromo checkPromoKey - функции

  const [thisCity] = useCitiesStore((state) => [state.thisCity], shallow);
  const [getInfoPromo, checkPromo, allPrice] = useCartStore((state) => [state.getInfoPromo, state.checkPromo, state.allPrice], shallow);
  const [openBasket, setActiveBasket, targetBasket] = useHeaderStore((state) => [state.openBasket, state.setActiveBasket, state.targetBasket], shallow);

  const listenScrollEvent = (event) => setScrollBasket(event.target.scrollTop);

  return (
    <>
      <Popover
        id="simple-popover"
        open={openBasket}
        anchorEl={targetBasket}
        onClose={() => setActiveBasket(false)}
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
                  <div className="circleInput"></div>
                </InputAdornment>
              }
            />
            <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div>
          </div>

          <div className="DescPromo">
            <span>{checkPromo?.text}</span>
          </div>

          <div className="InCart">
            {/* {itemsStore.getToken() !== null ?
              <Link to={'/' + itemsStore.getCity() + '/cart'} exact={true} style={{ textDecoration: 'none' }} onClick={this.handleClose.bind(this)}>
                  <Button variant="contained">Оформить заказ</Button>
              </Link>
             : */}
            <Button
              variant="contained"
              //onClick={this.props.openLogin}
            >
              <span>Оформить заказ</span>
            </Button>
            {/* } */}
          </div>
        </div>
      </Popover>
      {scrollBasket ? <div className="blockShadowBasket" /> : null}
    </>
  );
}
