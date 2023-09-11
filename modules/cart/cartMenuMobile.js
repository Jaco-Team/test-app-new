import { useState, useEffect } from 'react';

//import Link from 'next/link';
import Image from 'next/image';

import AddressModalMobile from '@/modules/profile/address/modalAddressMobile';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';
import { useCartStore, useCitiesStore, useProfileStore } from '@/components/store.js';

import MyTextInput from '@/ui/MyTextInput';

import { HomeCartMobile, AddrDotsModalOrderIcon } from '@/ui/Icons.js';

import MasterCard from '@/public/masterCard.png';
import Pay from '@/public/pay.png';

const pointListTLT = [
  { name: 'Ленинградская 47', id: 1, area: 'Центральный район' },
  { name: 'Ворошилова 12а', id: 2, area: 'Автозаводский район' },
  { name: 'Цветной 1', id: 3, area: 'Автозаводский район' },
  { name: 'Матросова 32', id: 4, area: 'Комсомольский район' },
  { name: 'Выбрать на карте', id: 5 },
];

const pointListSMR = [
  { name: 'Молодёжная 2', id: 1, area: 'Промышленный район' },
  { name: 'Куйбышева 113', id: 2, area: 'Самарский район' },
  { name: 'Победы 10', id: 3, area: 'Советский район' },
  { name: 'Выбрать на карте', id: 4 },
];

const timeList = [
  { name: 'Запланировать дату и время', id: 1 },
  { name: 'В ближайшее время', id: 2 },
];

const adrrList = [
  { name: 'ДОМ', id: 1, addr: 'Юбилейная 287, кв. 365' },
  { name: 'РАБОТА', id: 2, addr: 'Дзержинского 321, оф. 2388' },
  { name: 'РОДИТЕЛИ', id: 3, addr: 'Автостроителей 58, кв. 14' },
  { name: 'ул. Гая д. 357к3, кв. 133', id: 4 },
  { name: 'Выбрать на карте', id: 5 },
];

const payList = [
  { name: '2154', id: 1, main: false },
  { name: '8472', id: 2, main: true },
  { name: 'Оплата наличными', id: 3, main: false },
];

export default function CartMenuMobile({cityName}) {
  //console.log('render CartMenuMobile');

  const [list, setList] = useState([]);
  const [id, setId] = useState([]);
  const [text, setText] = useState('');

  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);
  const [openMenuCart, setActiveMenuCart, menu, idMenu, setActiveCartDataTimePicker, setActiveCartMap] = 
    useCartStore((state) => [state.openMenuCart, state.setActiveMenuCart, state.menu, state.idMenu, state.setActiveCartDataTimePicker, state.setActiveCartMap]);
  
  const [setActiveAddressModal] = useProfileStore((state) => [state.setActiveAddressModal]);

  useEffect(() => {
    if (menu === 'point' && thisCityRu === 'Тольятти') {
      setList(pointListTLT);
      setId(idMenu);
    }

    if (menu === 'point' && thisCityRu === 'Самара') {
      setList(pointListSMR);
      setId(idMenu);
    }

    if (menu === 'time') {
      setList(timeList);
      setId(idMenu);
    }

    if (menu === 'addr') {
      setList(adrrList);
      setId(idMenu);
    }

    if (menu === 'pay') {
      setList(payList);
      setId(idMenu);
    }
  }, [menu, thisCityRu]);

  const chooseMenuItem = (item) => {
    if (menu === 'time' && item.name === 'Запланировать дату и время') {
      setActiveCartDataTimePicker(true);
    }
    if (menu === 'point' && item.name === 'Выбрать на карте') {
      setActiveCartMap(true);
    }
    if (menu === 'addr' && item.name === 'Выбрать на карте') {
      setActiveMenuCart(false, null, null); setText('');
      setActiveAddressModal(true, 0, cityName);
    }
  };

  const changeText = (event) => {
    const text = event.target.value;

    if (text.length > 50) {
      const maxText = text.toString().slice(0, 50);
      setText(maxText);
    } else {
      setText(text);
    }
  };

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={openMenuCart}
      onClose={() => { setActiveMenuCart(false, null, null); setText('')}}
      onOpen={() => setActiveMenuCart(true, null, null)}
      id="cartMenuMobile"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <div className="ContainerCartList">

        <div className="Line"></div>

        <div className="loginHeader" style={{ marginBottom: menu === 'pay' ? '3.4188034188034vw' : menu === 'message' ? '7.0940170940171vw' : '2.2222222222222vw'}}>
          <Typography component="span">
            {menu === 'point' ? 'Выберите кафе' : menu === 'time' ? 'Дата и время' : menu === 'addr' ? 'Выберите адрес' : menu === 'pay' ? 'Способ оплаты' : menu === 'message'
              ? 'Сообщение курьеру' : ''}
          </Typography>
        </div>

        {menu !== 'pay' ? null : (
          <div className="loginPay">
            <Image alt="Платеж" src={Pay} width={191} height={70} priority={true}/>
          </div>
        )}

        {menu !== 'message' ? (
          <List>
            {list.map((item, key) => (
              <ListItem onClick={() => chooseMenuItem(item)} key={key}
                style={{ background: id === item.id ? 'rgba(0, 0, 0, 0.05)' : null,
                  marginBottom: item === list.at(-1) ? menu === 'addr' || menu === 'pay' ? '5.1282051282051vw' : '19.82905982906vw' : null }}
              >
                <div className="containerDiv"
                  style={{ justifyContent: (menu === 'addr' && item.name === 'ДОМ') || (menu === 'pay' && item.main) ? 'space-between' : null }}>
                  {menu !== 'pay' || item === list.at(-1) ? (
                    <>
                      <div className="containerSpan">
                        <span>{item.name}</span>
                        <span className={ menu === 'addr' && item.name?.length + item?.addr?.length > 32 ? 'shadowSpan' : null }>
                          {menu === 'point' ? item.area : menu === 'addr' ? item.addr : ''}
                        </span>
                      </div>

                      {menu === 'addr' && item.name === 'ДОМ' ? <div className="circleDiv"><HomeCartMobile /></div> : null}
                    </>
                  ) : (
                    <>
                      <div className="containerSpanPay">
                        <Image alt="Банковская карта" src={MasterCard} width={49} height={40} priority={true}/>
                        <span><AddrDotsModalOrderIcon /></span>
                        <span>{item.name}</span>
                      </div>

                      {item.main ? <div className="circleDiv"><HomeCartMobile /></div> : null}
                    </>
                  )}
                </div>
              </ListItem>
            ))}
          </List>
        ) : (
          <div className="CartMessage">
            <MyTextInput
              autoFocus
              type="text"
              value={text}
              func={(event) => changeText(event)}
              multiline
              maxRows={7}
              variant="outlined"
              className="message"
            />
          </div>
        )}

        {menu === 'addr' || menu === 'pay' ? (
          <Button className="CartButton" variant="contained"
            //onClick={(event) => openMenu(event, 'city')}
          >
            <span style={{ textTransform: 'capitalize' }}>Добавить</span>
            <span>&nbsp;{menu === 'addr' ? 'новый' : 'карту'}</span>
          </Button>
        ) : null}

        <AddressModalMobile />
        
      </div>
    </SwipeableDrawer>
  );
}
