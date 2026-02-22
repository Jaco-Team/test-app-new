import { useState, useEffect } from 'react';

import { useCartStore, useCitiesStore, useProfileStore } from '@/components/store.js';

import AddressModalMobile from '@/modules/profile/address/modalAddressMobile';
import GetAddressMobile from '@/modules/profile/address/modalGetAddressMobile';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';
import MyTextInput from '@/ui/MyTextInput';
import { HomeCartMobile } from '@/ui/Icons.js';

const type_pay_pic = [{ id: 'cash', name: 'В кафе' }];

const type_pred = [
  { name: 'В ближайшее время', id: -1 },
  { name: 'Запланировать дату и время', id: 1 },
];

const type_pay_div = [
  { id: 'cash', name: 'Наличными курьеру' },
  //{ id: 'sbp', name: 'СБП на сайте' },
  { id: 'online', name: 'Картой на сайте' },
];

export default function CartMenuMobile({ cityName }) {
  const [list, setList] = useState([]);
  const [id, setId] = useState(null);

  const [thisCityRu, thisCity] = useCitiesStore((state) => [state.thisCityRu, state.thisCity]);

  const [openMenuCart, setActiveMenuCart, nameList, setActiveDataTimePicker, setActiveCartMap, pointList, addrList, orderPic, orderAddr,
    setAddrDiv, setPoint, setTypePay, comment, changeComment, setSummDiv, typeOrder, getMapCart, setDataTimeOrder, getMySavedAddr] = useCartStore((state) => [state.openMenuCart, state.setActiveMenuCart, state.nameList, state.setActiveDataTimePicker, state.setActiveCartMap, state.pointList, state.addrList, state.orderPic, state.orderAddr, state.setAddrDiv, state.setPoint, state.setTypePay, state.comment, state.changeComment, state.setSummDiv, state.typeOrder, state.getMapCart, state.setDataTimeOrder, state.getMySavedAddr]);

  const [setActiveAddressModal] = useProfileStore((state) => [state.setActiveAddressModal]);

  useEffect(() => {
    if (nameList === 'point') {
      let points = pointList.filter((point) => point.name_ru === thisCityRu);

      points.push({ name: 'Выбрать на карте', id: points.length + 1 });

      setId(orderPic?.id);
      setList(points);

      getMapCart('contacts', cityName);
    }

    if (nameList === 'addr') {
      setId(orderAddr?.id);
      setList(addrList);
    }

    if (nameList === 'time') {
      setList(type_pred);
    }

    if (nameList === 'pay') {
      if (typeOrder == 'pic') {
        setList(type_pay_pic);
      } else {
        setList(type_pay_div);
      }
    }
  }, [nameList, thisCityRu, orderPic, orderAddr, addrList]);

  const chooseMenuItem = (item) => {
    if (nameList === 'point' && item.name !== 'Выбрать на карте') {
      setActiveMenuCart(false, null);
      setPoint(item);
      setId(item.id);
    }

    if (nameList === 'point' && item.name === 'Выбрать на карте') {
      setActiveCartMap(true);
      setActiveMenuCart(false, null);
    }

    if (nameList === 'addr' && item.name !== 'Выбрать на карте') {
      setSummDiv(item?.sum_div ?? 0);
      setActiveMenuCart(false, nameList);
      setAddrDiv(item);
      setId(item.id);

      if( item?.comment?.length > 0 ){
        changeComment(item?.comment)
      }
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
      setDataTimeOrder(item);
      setActiveMenuCart(false, null);
    }

    if (nameList === 'pay') {
      setActiveMenuCart(false, null);
      setId(item.id);
      setTypePay(item);
    }
  };

  useEffect(() => {
    if( thisCity && thisCity?.length > 0 && nameList == 'addr' && addrList.length == 0 ){
      getMySavedAddr(thisCity);
    }
  }, [addrList, nameList, thisCity])

  

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

        <div className="loginHeader" style={{ marginBottom: nameList === 'message' ? '7.0940170940171vw' : '2.2222222222222vw'}}>
          <Typography component="span">
            {nameList === 'point' ? 'Выберите кафе' : nameList === 'time' ? 'Дата и время' : nameList === 'addr' ? 'Выберите адрес'
              : nameList === 'pay' ? 'Способ оплаты' : nameList === 'message' ? 'Сообщение курьеру' : ''}
          </Typography>
        </div>

        {nameList !== 'message' ? (
          <List>
            {(list ?? []).map((item, idx, arr) => {
                const isLast = idx === ((arr?.length ?? 0) - 1);

                return (
                  <ListItem
                    onClick={() => chooseMenuItem(item)}
                    key={idx}
                    style={{
                      background: id === item.id ? 'rgba(0, 0, 0, 0.05)' : null,
                      marginBottom: isLast
                        ? (nameList === 'addr' ? '5.1282051282051vw' : '19.82905982906vw')
                        : null
                    }}
                  >
                    <div className="containerDiv">
                      {nameList === 'point' ? (
                        <div className="containerSpan">
                          <span>{item?.name}</span>
                          {item?.raion ? <span>{item.raion}</span> : null}
                        </div>
                      ) : (
                        <div style={{ flexDirection: 'column' }}>
                          <div style={{ flexDirection: 'row' }}>
                            <span>
                              {nameList === 'addr' && item?.addr_name ? (
                                <span style={{ textTransform: 'uppercase' }}>
                                  {item.addr_name + ', '}
                                </span>
                              ) : null}
                              {item?.name}
                            </span>
                            {nameList === 'addr' && parseInt(item?.is_main) ? (
                              <span className="circle"><HomeCartMobile /></span>
                            ) : null}
                          </div>

                          {nameList === 'addr' ? (
                            <span className="dopAddrInfo">
                              {item?.pd && parseInt(item.pd) > 0 ? `Пд: ${item.pd}, ` : ''}
                              {item?.et && parseInt(item.et) > 0 ? `Этаж: ${item.et}, ` : ''}
                              {parseInt(item?.dom_true) === 0 ? 'Домофон: не работает' : 'Домофон: работает'}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </ListItem>
                );
              })
            }
          </List>
        ) : (
          <div className="CartMessage">
            <textarea
              autoFocus
              type="text"
              value={comment}
              onChange={(event) => changeComment(event)}
              maxLength={50}
              rows={2}
            />
            {/* <MyTextInput
              autoFocus
              type="text"
              value={comment}
              func={(event) => changeComment(event)}
              multiline={true}
              rows={3}
              maxRows={3}
              className="message"
            /> */}
          </div>
        )}

        {nameList === 'addr' ? (
          <Button className="CartButton" variant="contained" onClick={() => chooseMenuItem({ name: 'Выбрать на карте' })}>
            <span>Добавить новый</span>
          </Button>
        ) : null}

        <AddressModalMobile />
        <GetAddressMobile />
      </div>
    </SwipeableDrawer>
  );
}
