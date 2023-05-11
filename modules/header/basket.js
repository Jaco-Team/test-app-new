import { useState } from 'react';

import { shallow } from 'zustand/shallow';

import { useHeaderStore } from '@/components/store.js';

// import Link from 'next/link';
import Image from 'next/image';

// import { IconRuble } from '@/ui/Icons.js';

import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// import Typography from '@mui/material/Typography';

const items = {
  count: '1',
  id: '83',
  name: 'Картофель фри',
  tmp_desc: 'Картофель, соль',
  marc_desc: '',
  marc_desc_full: '',
  size_pizza: '0',
  count_part: '1',
  weight: '100',
  price: '99',
  link: 'Kartofel_fri',
  type: '1',
  img_new: 'Kartofel_fri',
  img_app: 'Kartofel_fri',
  img_new_update: '2022_08_15_12_41_35',
  cat_id: '5',
  protein: '1,5',
  fat: '27,0',
  carbohydrates: '13,1',
  kkal: '298',
  is_new: '0',
  is_hit: '0',
  items: [
    {
      name: 'Картофель фри',
      tmp_desc: 'Картофель, соль',
      protein: '1,5',
      fat: '27,0',
      carbohydrates: '13,1',
      kkal: '298',
    },
  ],
  info_weight: '100 г',
  info_weight_dop: '100 г',
};

const items2 = {
  count: '2',
  id: '84',
  name: 'Картофель фри',
  tmp_desc: 'Картофель, соль',
  marc_desc: '',
  marc_desc_full: '',
  size_pizza: '0',
  count_part: '1',
  weight: '100',
  price: '99',
  link: 'Kartofel_fri',
  type: '1',
  img_new: 'Kartofel_fri',
  img_app: 'Kartofel_fri',
  img_new_update: '2022_08_15_12_41_35',
  cat_id: '5',
  protein: '1,5',
  fat: '27,0',
  carbohydrates: '13,1',
  kkal: '298',
  is_new: '0',
  is_hit: '0',
  items: [
    {
      name: 'Картофель фри',
      tmp_desc: 'Картофель, соль',
      protein: '1,5',
      fat: '27,0',
      carbohydrates: '13,1',
      kkal: '298',
    },
  ],
  info_weight: '100 г',
  info_weight_dop: '100 г',
};

const items3 = {
  count: '3',
  id: '85',
  name: 'Калифорния с креветкой запечённый унаги',
  tmp_desc: 'Картофель, соль',
  marc_desc: '',
  marc_desc_full: '',
  size_pizza: '0',
  count_part: '1',
  weight: '100',
  price: '99',
  link: 'Kartofel_fri',
  type: '1',
  img_new: 'Kartofel_fri',
  img_app: 'Kartofel_fri',
  img_new_update: '2022_08_15_12_41_35',
  cat_id: '5',
  protein: '1,5',
  fat: '27,0',
  carbohydrates: '13,1',
  kkal: '298',
  is_new: '0',
  is_hit: '0',
  items: [
    {
      name: 'Картофель фри',
      tmp_desc: 'Картофель, соль',
      protein: '1,5',
      fat: '27,0',
      carbohydrates: '13,1',
      kkal: '298',
    },
  ],
  info_weight: '100 г',
  info_weight_dop: '100 г',
};

let cartItems = [items, items2, items3];

export default function Basket() {
  // countCart  cartItems  promoST  originPrice allPrice promoName promoText - переменные

  // handleClick handleClose add minus checkPromo checkPromoKey - функции

  const [openBasket, setActiveBasket, targetBasket] = useHeaderStore(
    (state) => [state.openBasket, state.setActiveBasket, state.targetBasket],
    shallow
  );

  const [items, setItems] = useState(cartItems);
  const [allPrice, setAllPrice] = useState(items.reduce((all, it) => all + (it.count * it.price), 0));
  
  const plus = (id) => {
    const newItems = items.map(item => {
      if(item.id === id) {
        item.count = Number(item.count) + 1;
        setAllPrice(allPrice => allPrice + Number(item.price));
        return item
      }
      return item
    }
    )
    setItems(newItems)
  };
  
  const minus = (id) => {
    const newItems = items.map(item => {
      if(item.id === id) {
        item.count = Number(item.count) - 1;
        setAllPrice(allPrice => allPrice - Number(item.price));
        return item
      }
      return item
    }
    )
    setItems(newItems)
  };
  

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
          <table className="TableMini">
            <tbody>
              {items.map((item, key) => (
                <tr key={key}>
                  <td className="CellPic">
                    <Image alt={item.name} src={'https://cdnimg.jacofood.ru/' + item.img_app + '_1420x1420.jpg'} width={1420} height={1420} priority={true} />
                  </td>
                  <td className="TableMiniName CellName">
                    <span style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>
                      {item.name}
                    </span>
                  </td>
                  <td className="CellButton">
                    <ButtonGroup disableElevation={true} disableRipple={true} variant="contained" className="MiniActionsCartButton">
                      <div variant="contained">
                        <button className="minus" onClick={() => minus(item.id)}>–</button>
                        <span>{item.count}</span>
                        <button className="plus" onClick={() => plus(item.id)}>+</button>
                      </div>
                    </ButtonGroup>
                  </td>
                  <td className="CellPrice">
                    <div className="TableMiniPrice">
                      {new Intl.NumberFormat('ru-RU').format(parseInt(item.price) * parseInt(item.count))} ₽
                      {/* <IconRuble
                        style={{
                          width: 18,
                          height: 18,
                          fill: '#525252',
                          marginLeft: 5,
                        }}
                      /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Итого:</td>
                <td>
                    <div>
                      {new Intl.NumberFormat('ru-RU').format(allPrice)} ₽
                      {/* <IconRuble
                        style={{
                          width: 21,
                          height: 21,
                          fill: '#525252',
                          marginLeft: 5,
                        }}
                      /> */}
                    </div>
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="SpacePromoRoot">
            <Paper component="div" className="SpacePromo" elevation={0}>
              <InputBase
                // onBlur={this.checkPromo.bind(this)}
                // value={promoName}
                // onKeyDown={this.checkPromoKey.bind(this)}
                // onChange={this.changePromo.bind(this)}
                placeholder="Есть промокод"
              />
              {/* {promoText.length > 0 ? (
                <div
                  className={
                    promoST === true
                      ? 'promoIndicator true'
                      : 'promoIndicator false'
                  }
                />
              ) : null} */}
            </Paper>

            {/* {originPrice != allPrice &&
            promoST === true ? (
              <div className="DescPromoPrice">
                {new Intl.NumberFormat('ru-RU').format(allPrice)}
                <IconRuble
                  style={{
                    width: 14,
                    height: 14,
                    fill: '#525252',
                    marginLeft: 5,
                  }}
                />
              </div>
            ) : null}

            {promoText.length > 0 && promoST === false ? (
              <div className="DescPromo">
                <Typography className="cat" variant="h5" component="span">
                  {promoText}
                </Typography>
              </div>
            ) : null} */}
          </div>

          <div className="InCart">
            {/* {itemsStore.getToken() !== null ? (
              <Link
                to={'/' + itemsStore.getCity() + '/cart'}
                exact={true}
                style={{ textDecoration: 'none' }}
                onClick={this.handleClose.bind(this)}
              >
                <ButtonGroup
                  disableElevation={true}
                  disableRipple={true}
                  variant="contained"
                >
                  <Button variant="contained">Оформить заказ</Button>
                </ButtonGroup>
              </Link>
            ) : ( */}
            <ButtonGroup disableElevation={true} disableRipple={true} variant="contained"
            >
              <Button variant="contained"
                //onClick={this.props.openLogin}
              >
                Оформить заказ
              </Button>
            </ButtonGroup>
            {/* )} */}
          </div>
        </div>
      </Popover>
    </div>
  );
}
