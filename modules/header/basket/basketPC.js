import { shallow } from 'zustand/shallow';

import { useHeaderStore } from '@/components/store.js';

import TablePC from './tablePC';

// import Link from 'next/link';

import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// import Typography from '@mui/material/Typography';

export default function BasketPC() {
  console.log('render BasketPC');
  // countCart  cartItems  promoST  originPrice allPrice promoName promoText - переменные

  // handleClick handleClose add minus checkPromo checkPromoKey - функции

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
      >
        <div>
          <TablePC />
          <div className="SpacePromoRoot">
            <Paper component="div" className="SpacePromo" elevation={0}>
              <InputBase
                // onBlur={this.checkPromo.bind(this)}
                // value={promoName}
                // onKeyDown={this.checkPromoKey.bind(this)}
                // onChange={this.changePromo.bind(this)}
                placeholder="Есть промокод"
              />
              {/* {promoText.length > 0 ? <div className={ promoST === true ? 'promoIndicator true' : 'promoIndicator false' } /> : null} */}
            </Paper>

            {/* {originPrice != allPrice && promoST === true ? <div className="DescPromoPrice">{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div> : null}

            {promoText.length > 0 && promoST === false ? <div className="DescPromo"><Typography className="cat" variant="h5" component="span">{promoText}</Typography></div> : null} */}
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
