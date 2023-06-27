import React, { useState, useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { useHeaderStore, useCartStore, useCitiesStore } from '@/components/store.js';

import TablePC from './tablePC';

import { roboto } from '@/ui/Font';
import MyTextInput from '@/ui/MyTextInput';

// import Link from 'next/link';

import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// import Typography from '@mui/material/Typography';

export default function BasketPC() {
  
  const [ promo, setPromo ] = useState( '' );

  useEffect( () => {
    if( localStorage.getItem('promo_name') && localStorage.getItem('promo_name').length > 0 ){
      setPromo( localStorage.getItem('promo_name') )
    }
  }, [] )

  // countCart  cartItems  promoST  originPrice allPrice promoName promoText - переменные

  // handleClick handleClose add minus checkPromo checkPromoKey - функции

  const [ thisCity ] = useCitiesStore( state => [ state.thisCity ], shallow )
  const [ getInfoPromo, checkPromo ] = useCartStore( state => [ state.getInfoPromo, state.checkPromo ], shallow )

  const [openBasket, setActiveBasket, targetBasket] = useHeaderStore((state) => [state.openBasket, state.setActiveBasket, state.targetBasket], shallow);

  return (
    <div style={{ width: '12.27%', minWidth: 'max-content' }}>
      <Popover
        id="simple-popover"
        open={openBasket} 
        anchorEl={targetBasket}
        onClose={() => setActiveBasket(null, false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ zIndex: 1100 }}
        marginThreshold={0}
        className={roboto.variable}
      >
        <div>
          <TablePC />
          <div className="SpacePromoRoot">
            <MyTextInput
              className="SpacePromo"
              placeholder="Есть промокод"
              value={promo}
              label=""
              onBlur={ () => getInfoPromo(promo, thisCity) }
              func={ event => { setPromo(event.target.value) } }
            />
          </div>

          <div className="DescPromo">
            <span>{ checkPromo?.text }</span>
          </div>

          <div className="InCart">
            {/* {itemsStore.getToken() !== null ?
              <Link to={'/' + itemsStore.getCity() + '/cart'} exact={true} style={{ textDecoration: 'none' }} onClick={this.handleClose.bind(this)}>
                <ButtonGroup disableElevation={true} disableRipple={true} variant="contained">
                  <Button variant="contained">Оформить заказ</Button>
                </ButtonGroup>
              </Link>
             : */}
            <ButtonGroup disableElevation={true} disableRipple={true} variant="contained">
              <Button variant="contained"
                //onClick={this.props.openLogin}
              >
                Оформить заказ
              </Button>
            </ButtonGroup>
            {/* } */}
          </div>
        </div>
      </Popover>
    </div>
  );
}
