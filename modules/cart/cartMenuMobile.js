import { useState, useEffect } from 'react';

import { useCartStore, useCitiesStore, useProfileStore } from '@/components/store.js';

import Image from 'next/image';

import AddressModalMobile from '@/modules/profile/address/modalAddressMobile';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';
import MyTextInput from '@/ui/MyTextInput';
import { HomeCartMobile } from '@/ui/Icons.js';
import Pay from '@/public/pay.png';

const type_pay_pic = [{ id: 'cash', name: 'В кафе' }];

const type_pred = [
  { name: 'В ближайшее время', id: -1 },
  { name: 'Запланировать дату и время', id: 1 },
];

const type_pay_div = [
  { id: 'cash', name: 'Наличными курьеру' },
  { id: 'online', name: 'Онлайн на сайте' },
];

export default function CartMenuMobile({ cityName }) {
  //console.log('render CartMenuMobile');

  const [list, setList] = useState([]);
  const [id, setId] = useState(null);

  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);

  const [openMenuCart, setActiveMenuCart, nameList, setActiveDataTimePicker, setActiveCartMap, pointList, addrList, orderPic, orderAddr, setAddrDiv, setPoint, getDataMap, setTypePay,
    comment, changeComment, setSummDiv, typeOrder] = useCartStore((state) => [state.openMenuCart, state.setActiveMenuCart, state.nameList, state.setActiveDataTimePicker, state.setActiveCartMap, state.pointList, state.addrList, state.orderPic, state.orderAddr, state.setAddrDiv, state.setPoint, state.getDataMap, state.setTypePay, state.comment, state.changeComment, state.setSummDiv, state.typeOrder
  ]);

  const [setActiveAddressModal] = useProfileStore((state) => [state.setActiveAddressModal]);

  useEffect(() => {
    if (nameList === 'point') {
      let points = pointList.filter((point) => point.name_ru === thisCityRu);

      // для тестирования, пока нет в данных
      points = points.map((city) => {
        city.raion = 'Промышленный р-н';
        return city;
      });

      points.push({ name: 'Выбрать на карте', id: points.length + 1 });

      setId(orderPic?.id);
      setList(points);
    }

    if (nameList === 'addr') {
      const newAddr = addrList?.find((item) => item.name === 'Выбрать на карте');

      if (!newAddr) {
        addrList?.push({ name: 'Выбрать на карте', id: addrList.length + 1 });
      }

      setId(orderAddr?.id);
      setList(addrList);
    }

    if (nameList === 'time') {
      setList(type_pred);
    }

    if (nameList === 'pay') {
      if(typeOrder) {
        setList(type_pay_pic);
      } else {
        setList(type_pay_div);
      }
    }
  }, [nameList, thisCityRu, orderPic, orderAddr]);

  const chooseMenuItem = (item) => {
    //console.log('chooseMenuItem', item)

    if (nameList === 'point' && item.name !== 'Выбрать на карте') {
      setActiveMenuCart(false, null);
      setPoint(item);
      setId(item.id);
    }

    if (nameList === 'point' && item.name === 'Выбрать на карте') {
      setPoint(null);
      setActiveCartMap(true);
      setActiveMenuCart(false, null);
      getDataMap('contacts', cityName);
    }

    if (nameList === 'addr' && item.name !== 'Выбрать на карте') {
      setSummDiv(item?.sum_div ?? 0);
      setActiveMenuCart(false, nameList);
      setAddrDiv(item);
      setId(item.id);
    }

    if (nameList === 'addr' && item.name === 'Выбрать на карте') {
      setSummDiv(0);
      setAddrDiv(null);
      setActiveMenuCart(false, null);
      setActiveAddressModal(true, 0, cityName);
    }

    if (nameList === 'time' && item.name === 'Запланировать дату и время') {
      setActiveMenuCart(false, null);
      setActiveDataTimePicker(true);
    }

    if (nameList === 'time' && item.name !== 'Запланировать дату и время') {
      setActiveMenuCart(false, null);
    }

    if (nameList === 'pay') {
      setActiveMenuCart(false, null);
      setId(item.id);
      setTypePay(item);
    }
  };

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={openMenuCart}
      onClose={() => setActiveMenuCart(false, null)}
      onOpen={() => setActiveMenuCart(true, null)}
      id="cartMenuMobile"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <div className="ContainerCartList">
        <div className="Line"></div>

        <div className="loginHeader"
          style={{ marginBottom: nameList === 'pay' ? '3.4188034188034vw' : nameList === 'message' ? '7.0940170940171vw' : '2.2222222222222vw' }}>
          <Typography component="span">
            {nameList === 'point' ? 'Выберите кафе' : nameList === 'time' ? 'Дата и время' : nameList === 'addr' ? 'Выберите адрес' : nameList === 'pay' ? 'Способ оплаты'
              : nameList === 'message' ? 'Сообщение курьеру' : ''}
          </Typography>
        </div>

        {nameList !== 'pay' ? null : (
          <div className="loginPay">
            <Image alt="Платеж" src={Pay} width={191} height={70} priority={true} />
          </div>
        )}

        {nameList !== 'message' ? (
          <List>
            {list?.map((item, key) => (
              <ListItem onClick={() => chooseMenuItem(item)} key={key}
                style={{ background: id === item.id ? 'rgba(0, 0, 0, 0.05)' : null,
                         marginBottom: item === list.at(-1) ? nameList === 'addr' ? '5.1282051282051vw' : '19.82905982906vw' : null }}>
                <div className="containerDiv" style={{ justifyContent: nameList === 'addr' && item.addr_main ? 'space-between' : null }}>
                  {nameList !== 'pay' || item === list.at(-1) ? (
                    <>
                      <div className="containerSpan">

                        <span className={ nameList === 'addr' ? item?.addr_name ? item?.addr_name.length > 8 ? 'maxWidthSpan' : null : null : null }
                          style={{ maxWidth: nameList === 'addr' && item.name !== 'Выбрать на карте' && item?.addr_name ? '23.076923076923vw' : '59.82905982906vw',
                                   textTransform: nameList === 'addr' ? item?.addr_name ? 'uppercase' : null : null }}>
                          {nameList !== 'addr' ? item.name : item?.addr_name ? item.addr_name : item.name}
                        </span>

                        <span className={ nameList === 'addr' && item.addr_name?.length + item?.name?.length > 31 ? 'shadowSpan maxWidthSpan' : null}
                          style={{ maxWidth: nameList === 'addr' && item.addr_name?.length + item?.name?.length > 31 && item.addr_main ? '37.606837606838vw'
                                : nameList === 'addr' && item.addr_name?.length + item?.name?.length > 31 ? '47.008547008547vw' : 'max-content'}}>
                          {nameList === 'point' ? item.raion : nameList === 'addr' ? item?.addr_name ? item.name : null : null}
                        </span>
                      </div>

                      {nameList === 'addr' && item.addr_main ? (
                        <div className="circleDiv">
                          <HomeCartMobile />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <span className="spanPay">{item.name}</span>
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
              value={comment}
              func={(event) => changeComment(event)}
              multiline
              maxRows={7}
              variant="outlined"
              className="message"
            />
          </div>
        )}

        {nameList === 'addr' ? (
          <Button className="CartButton" variant="contained" onClick={() => chooseMenuItem({ name: 'Выбрать на карте' })}>
            <span>Добавить новый</span>
          </Button>
        ) : null}

        <AddressModalMobile />

      </div>
    </SwipeableDrawer>
  );
}
