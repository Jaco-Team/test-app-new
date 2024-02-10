import { useState, useEffect } from 'react';

import { useCartStore, useCitiesStore, useHeaderStore, useProfileStore } from '@/components/store.js';
import { useRouter } from 'next/router';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import MoneyIcon from '@mui/icons-material/Money';

import MyTextInput from '@/ui/MyTextInput';
import CartItemMobile from '@/modules/cart/cartItemsMobile';
import { SwitchBasketPC as MySwitchPC } from '@/ui/MySwitch.js';
import { SwitchBasketMobile as MySwitchMobile } from '@/ui/MySwitch.js';
import { ArrowDownBasketModalPC, ArrowDownCartMobile, CityBasketModalPC, HomeBasketModalPC, PointBasketModalPC, TimeBasketModalPC, CardBasketModalPC, MessageBasketModalPC } from '@/ui/Icons.js';

import { roboto } from '@/ui/Font.js';

const dopText = { text: 'Выберите столько приправ и приборов, сколько необходимо' };

export default function FormOrder({ cityName }) {
  const { push } = useRouter();

  const [promo, setPromo] = useState('');
  const [list, setList] = useState([]);
  const [nameList, setNameList] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [message, setMessage] = useState('');

  const type_pay_pic = [{ id: 'cash', name: 'В кафе' }];
  const type_pay_div = [
    { id: 'cash', name: 'Наличными курьеру' },
    { id: 'online', name: 'Онлайн на сайте' },
  ];
  const type_pred = [
    { name: 'В ближайшее время', id: -1 },
    { name: 'Запланировать дату и время', id: 1 },
  ];

  const open = Boolean(anchorEl);

  const [openModalAddr] = useProfileStore((state) => [state.openModalAddr]);

  const [matches, setActiveModalCityList, setActiveModalAlert, token] = useHeaderStore((state) => [state.matches, state.setActiveModalCityList, state.setActiveModalAlert, state.token]);

  const [thisCityList, thisCity, thisCityRu, setThisCityRu] = useCitiesStore((state) => [state.thisCityList, state.thisCity, state.thisCityRu, state.setThisCityRu]);
 
  const [items, itemsCount, promoInfo, allPriceWithoutPromo, promoItemsFind, itemsOnDops, itemsOffDops, dopListCart, allPrice, getInfoPromo, checkPromo, setActiveMenuCart, pointList, getMySavedAddr,createOrder, changeAllItems, addrList, orderPic, orderAddr, setAddrDiv, setPoint, getTimesPred, getDataPred, dateTimeOrder, setDataTimeOrder, setActiveDataTimePicker, typePay, setTypePay, changeComment, comment, typeOrder, setTypeOrder, summDiv, setSummDiv, sdacha, setSdacha] = useCartStore((state) => [state.items, state.itemsCount,
    state.promoInfo,state.allPriceWithoutPromo, state.promoItemsFind, state.itemsOnDops, state.itemsOffDops, state.dopListCart, state.allPrice, state.getInfoPromo, state.checkPromo, state.setActiveMenuCart, state.pointList, state.getMySavedAddr, state.createOrder, state.changeAllItems, state.addrList, state.orderPic, state.orderAddr, state.setAddrDiv, state.setPoint, state.getTimesPred, state.getDataPred, state.dateTimeOrder, state.setDataTimeOrder, state.setActiveDataTimePicker, state.typePay, state.setTypePay, state.changeComment, state.comment, state.typeOrder, state.setTypeOrder, state.summDiv, state.setSummDiv, state.sdacha, state.setSdacha]);
 
  useEffect(() => {
    if (matches) {
      setMessage(comment);
    }
  }, [matches, comment]);

  useEffect(() => {
    if (thisCity !== cityName) {
      setTimeout(() => {
        changeAllItems();
      }, 300);
    }
  }, [thisCity, cityName]);

  useEffect(() => {
    if (localStorage.getItem('promo_name') && localStorage.getItem('promo_name').length > 0) {
      setPromo(localStorage.getItem('promo_name'));
    }
    getMySavedAddr(thisCity, token);
  }, [promoInfo]);

  const openMenu = (event, nameList) => {
    setNameList(nameList);

    if (nameList === 'city') {
      if (matches) {
        setSummDiv(0);
        setActiveModalCityList(true);
      } else {
        setList(thisCityList);
        setAnchorEl(event.currentTarget);
      }
    }

    if (nameList === 'point') {
      if (matches) {
        setActiveMenuCart(true, nameList);
      } else {
        const points = pointList.filter((point) => point.name_ru === thisCityRu);
        setList(points);
        setAnchorEl(event.currentTarget);
      }
    }

    if (nameList === 'addr') {
      if (matches) {
        setActiveMenuCart(true, nameList);
      } else {
        setAnchorEl(event.currentTarget);

        const newAddr = addrList?.find((item) => item.name === 'Добавить новый адрес');
        if (!newAddr) {
          addrList?.push({ name: 'Добавить новый адрес', id: addrList.length + 1 });
        }

        setList(addrList);
      }
    }

    if (nameList === 'time') {
      const point_id = typeOrder ? orderPic?.id : orderAddr?.point_id;

      if (point_id) {
        getDataPred();
        getTimesPred(point_id, null, !typeOrder ? 0 : 1, []);

        if (matches) {
          setActiveMenuCart(true, nameList);
        } else {
          setAnchorEl(event.currentTarget);
          setList(type_pred);
        }
      } else {
        setActiveModalAlert(true, 'Необходимо выбрать ' + (typeOrder ? 'Кафе' : 'Адрес доставки', false));
      }
    }

    if (nameList === 'pay') {
      if (matches) {
        setActiveMenuCart(true, nameList);
      } else {
        if (typeOrder) {
          setList(type_pay_pic);
        } else {
          setList(type_pay_div);
        }
        setAnchorEl(event.currentTarget);
      }
    }

    if (nameList === 'message') {
      setActiveMenuCart(true, nameList);
    }
  };

  const chooseItem = (item) => {

    if (nameList === 'city') {
      setThisCityRu(item.name);
      setAnchorEl(null);
      push(`/${item.link}`);
      localStorage.setItem('setCity', JSON.stringify(item));
      setPoint(null);
      setAddrDiv(null);
      setSummDiv(0);
      getMySavedAddr(item.link, token);
    }

    if (nameList === 'point') {
      setPoint(item);
      setAnchorEl(null);
    }

    if (nameList === 'addr') {
      setAddrDiv(item);
      setSummDiv(item.sum_div ?? 0);
      setAnchorEl(null);

      if (item.name === 'Добавить новый адрес') {
        openModalAddr(0, thisCity);
        setAddrDiv(null);
      }
    }

    if (nameList === 'time') {
      setAnchorEl(null);
      if (item.name === 'В ближайшее время') {
        setDataTimeOrder(item);
      } else {
        setActiveDataTimePicker(true);
      }
    }

    if (nameList === 'pay') {
      setTypePay(item);
      setAnchorEl(null);
    }
  };

  function getWord(int, array) {
    return ((array = array || ['позиция', 'позиции', 'позиций']) && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]]);
  }

  function create_order() {
    //token, typeOrder, city_id, point_id, addr, typePay, dateTimeOrder, comment, sdacha, promoName
    
    if(!thisCityRu) {
      setActiveModalAlert(true, 'Необходимо выбрать город', false);
      return;
    }

    if (typeOrder) {
      if (!orderPic) {
        setActiveModalAlert(true, 'Необходимо выбрать Кафе', false);
        return;
      }
    } 
    
    if (!typeOrder) {
      if (!orderAddr) {
        setActiveModalAlert(true, 'Необходимо выбрать Адрес доставки', false);
        return;
      }
    }

    if(!typePay) {
      setActiveModalAlert(true, 'Необходимо выбрать способо оплаты', false);
      return;
    }

    if(!items.length) {
      setActiveModalAlert(true, 'Необходимо добавить товар в корзину', false);
      return;
    }

    if(!token || token.length == 0) {
      setActiveModalAlert(true, 'Необходимо Авторизироваться', false);
      return;
    }

    createOrder( token, thisCity );
  }

  return (
    <>
      {matches ? (
        <div className="CartMobileContainer">
          <div className="CartMobileText">Оформить заказ</div>

          <Stack direction="row" alignItems="center" style={{ width: '86.324786324786vw', marginBottom: '6.8376068376068vw' }}>
            <MySwitchMobile onClick={(event) => setTypeOrder(event.target.checked)} checked={typeOrder ? true : false} />
          </Stack>

          <Button className="CartChoose" onClick={(event) => openMenu(event, 'city')} endIcon={<ArrowDownCartMobile />}>
            <div>
              <Typography component="span">
                <CityBasketModalPC />
              </Typography>
              <Typography component="span">{thisCityRu}</Typography>
            </div>
          </Button>

          {typeOrder ? (
            <Button className="CartChoose" onClick={(event) => openMenu(event, 'point')} endIcon={<ArrowDownCartMobile />}>
              <div>
                <Typography component="span">
                  <PointBasketModalPC />
                </Typography>
                {orderPic?.name ?
                  <Typography component="span">{orderPic?.name}</Typography>
                    :
                  <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>Выберите кафе</Typography>
                }
              </div>
            </Button>
          ) : (
            <Button className="CartChoose" endIcon={<ArrowDownCartMobile />} onClick={(event) => openMenu(event, 'addr', 1)}>
              <div>
                <Typography component="span">
                  <HomeBasketModalPC fill='#DD1A32' />
                </Typography>

                {orderAddr?.addr_name ?
                  <Typography component="span" style={{ textTransform: 'uppercase', maxWidth: '63.247863247863vw' }} className={orderAddr?.addr_name?.length > 15 ? 'shadowSpan' : null }>
                    {orderAddr?.addr_name}
                  </Typography>
                    : 
                  orderAddr?.name ?
                    <Typography component="span" className={orderAddr?.name?.length > 29 ? 'shadowSpan' : null}>{orderAddr?.name}</Typography>
                      :
                    <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>Выберите адрес</Typography>
                }
              </div>
            </Button>
          )}

          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />} onClick={(event) => openMenu(event, 'time')}>
            <div>
              <Typography component="span">
                <TimeBasketModalPC />
              </Typography>
              <Typography component="span">
                {dateTimeOrder ? dateTimeOrder?.name === 'В ближайшее время' ? dateTimeOrder?.name : dateTimeOrder.text + ' к ' + dateTimeOrder.name : type_pred[0].name}
              </Typography>
            </div>
          </Button>

          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />} style={{ marginBottom: typeOrder ? '6.8376068376068vw' : '3.4188034188034vw' }} 
            onClick={(event) => openMenu(event, 'pay')}>
            <div>
              <Typography component="span">
                <CardBasketModalPC />
              </Typography>
              {typePay?.name ?
                <Typography component="span">{typePay?.name}</Typography>
                  :
                <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>Способ оплаты</Typography>
              }
            </div>
          </Button>

          {typeOrder ? null : typePay?.id !== 'cash' ? null : (
            <Button className="CartChoose">
              <div>
                <Typography component="span">
                  <MoneyIcon />
                </Typography>

                <MyTextInput
                  autoFocus
                  type="number"
                  value={sdacha ? sdacha : ''}
                  func={(event) => setSdacha(event.target.value)}
                  variant="outlined"
                  className="sdacha"
                  placeholder="Без сдачи"
                />
              </div>
            </Button>
          )}

          {typeOrder ? null : (
            <Button className="CartChoose" endIcon={<ArrowDownCartMobile />} onClick={(event) => openMenu(event, 'message')}
              style={{ marginBottom: '6.8376068376068vw', height: message.length > 20 ? '20.512820512821vw' : '10.25641025641vw' }}>
              <div>
                <Typography component="span">
                  <MessageBasketModalPC />
                </Typography>
                {message ?
                  <Typography component="span" className={message.length > 20 ? 'comment' : null}
                    style={{ height: message.length > 20 ? '13.675213675214vw' : '6.8376068376068vw' }}>
                    {message}
                  </Typography>
                    :
                  <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>Сообщение курьеру</Typography>
                }
              </div>
            </Button>
          )}

          {itemsOffDops.map((item, key) => (
            <CartItemMobile key={key} count={item.count} item={item} last={ item === itemsOffDops.at(-1) && itemsOnDops.length ? 'last' : '' }/>
          ))}

          {dopListCart.length ? (
            <>
              <div className="CartItemDopText">
                <span>{dopText.text}</span>
              </div>
              {dopListCart.map((item, key) => (
                <CartItemMobile key={key} count={item.count} item={item} last={''} />
              ))}
            </>
          ) : null}

          {typeOrder ? null : (
            <div className="CartDelivery">
              <span>Доставка:</span>
              <span>{new Intl.NumberFormat('ru-RU').format(summDiv)} ₽</span>
            </div>
          )}

          <div className="CartTotal" style={{ marginTop: typeOrder ? '5.1282051282051vw' : 0 }}>
            <span>
              Итого: {itemsCount} {getWord(itemsCount)}
            </span>
            <div>
              <span className={ promoInfo?.items_on_price?.length ? promoItemsFind ? 'promoInfo' : null : promoInfo?.status_promo && itemsOffDops.length ? 'promoInfo' : null }>
                {new Intl.NumberFormat('ru-RU').format(parseInt(allPriceWithoutPromo) + parseInt(summDiv))} ₽
              </span>
            </div>
          </div>

          <div className="CartPromo">
            <MyTextInput
              placeholder="Есть промокод"
              value={promo}
              label=""
              onBlur={() => getInfoPromo(promo, thisCity)}
              func={(event) => setPromo(event.target.value)}
              inputAdornment={
                <InputAdornment position="end">
                  {promoInfo ? promoInfo.status_promo ? <div className="circleInput"></div> : <div className="circleInput" style={{ background: '#DD1A32' }}></div> : null}
                </InputAdornment>}
            />
            {promoInfo?.items_on_price?.length ?  promoItemsFind ?
                <div>{new Intl.NumberFormat('ru-RU').format(parseInt(allPrice) + parseInt(summDiv))}{' '}₽</div> : null : promoInfo?.status_promo && itemsCount ? 
                <div>{new Intl.NumberFormat('ru-RU').format(parseInt(allPrice) + parseInt(summDiv))}{' '}₽</div> : null}
          </div>

          <div className="CartItemDescPromo">
            <span style={{ color: promoInfo?.status_promo ? 'rgba(0, 0, 0, 0.80)' : '#DD1A32' }}>
              {checkPromo?.text}
            </span>
          </div>

          <Button className="CartOrder" variant="contained" disabled={!itemsCount} onClick={create_order}>
            <span>Заказать</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="modalBasketContainer">
            <div className="basketHeader">
              <Typography component="span">Оформить заказ</Typography>
            </div>

            <Stack direction="row" alignItems="center" style={{ width: '28.880866425993vw', marginBottom: '2.8880866425993vw' }}>
              <MySwitchPC onClick={(event) => setTypeOrder(event.target.checked)} checked={typeOrder ? true : false} />
            </Stack>

            <Button className="basketChoose" onClick={(event) => openMenu(event, 'city')}
              endIcon={open ? nameList === 'city' ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC /> : <ArrowDownBasketModalPC />}>
              <div>
                <Typography component="span">
                  <CityBasketModalPC />
                </Typography>
                <Typography component="span">{thisCityRu}</Typography>
              </div>
            </Button>

            {typeOrder ? (
              <Button className="basketChoose" onClick={(event) => openMenu(event, 'point')}
                endIcon={open ? nameList === 'point' ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC /> : <ArrowDownBasketModalPC />}>
                <div>
                  <Typography component="span">
                    <PointBasketModalPC />
                  </Typography>
                  {orderPic?.name ?
                    <Typography component="span">{orderPic?.name}</Typography>
                      :
                    <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>Выберите кафе</Typography>
                  }
                </div>
              </Button>
            ) : (
              <Button className="basketChoose" onClick={(event) => openMenu(event, 'addr')}>
                <div>

                  <Typography component="span">
                    <HomeBasketModalPC fill='#DD1A32' />
                  </Typography>

                  {orderAddr?.addr_name ?
                    <Typography component="span" style={{ textTransform: 'uppercase'}} className={orderAddr?.addr_name?.length > 19 ? 'shadowSpan' : null }>
                      {orderAddr?.addr_name}
                    </Typography>
                      : 
                    orderAddr?.name ?
                      <Typography component="span" className={orderAddr?.name?.length > 31 ? 'shadowSpan' : null}>
                        {orderAddr?.name}
                        </Typography>
                        :
                      <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>Выберите адрес</Typography>
                  }

                  <Typography component="span" className="svg_addr">
                    {open ? nameList === 'addr' ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC /> : <ArrowDownBasketModalPC />}
                  </Typography>

                </div>
              </Button>
            )}

            <Button className="basketChoose" onClick={(event) => openMenu(event, 'time')}
              endIcon={open ? nameList === 'time' ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC /> : <ArrowDownBasketModalPC />}>
              <div>
                <Typography component="span">
                  <TimeBasketModalPC />
                </Typography>
                <Typography component="span">
                  {dateTimeOrder ? dateTimeOrder?.name === 'В ближайшее время' ? dateTimeOrder?.name : dateTimeOrder.text + ' к ' + dateTimeOrder.name : type_pred[0].name}
                </Typography>
              </div>
            </Button>

            <Button className="basketChoose" style={{ marginBottom: typeOrder ? '2.8880866425993vw' : '1.4440433212996vw' }}
              onClick={(event) => openMenu(event, 'pay')}
              endIcon={open ? nameList === 'pay' ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC /> : <ArrowDownBasketModalPC /> }>
              <div>
                <Typography component="span">
                  <CardBasketModalPC />
                </Typography>
                {typePay?.name ?
                  <Typography component="span">{typePay?.name}</Typography>
                    :
                  <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>Способ оплаты</Typography>
                }
              </div>
            </Button>

            {typeOrder ? null : typePay?.id !== 'cash' ? null : (
              <Button className="basketChoose">
                <div>
                  <Typography component="span">
                    <MoneyIcon />
                  </Typography>

                  <MyTextInput
                    autoFocus
                    type="number"
                    value={sdacha ? sdacha : ''}
                    func={(event) => setSdacha(event.target.value)}
                    variant="outlined"
                    className="sdacha"
                    placeholder="Без сдачи"
                  />
                </div>
              </Button>
            )}

            {typeOrder ? null : (
              <div className="basketMessage">
                <Typography component="span">
                  <MessageBasketModalPC />
                </Typography>
                <MyTextInput
                  autoFocus
                  type="text"
                  value={comment}
                  func={(event) => changeComment(event)}
                  multiline
                  maxRows={3}
                  variant="outlined"
                  className="message"
                  placeholder="Сообщение курьеру"
                />
              </div>
            )}

            <div className="basketLine"></div>

            {typeOrder ? null : (
              <div className="basketDelivery">
                <span>Доставка:</span>
                <span>{new Intl.NumberFormat('ru-RU').format(summDiv)} ₽</span>
              </div>
            )}
            
            <div className="basketTotal" style={{ marginTop: typeOrder ? '2.1660649819495vw' : '0.72202166064982vw' }}>
              <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
              <span>{new Intl.NumberFormat('ru-RU').format(allPrice ? parseInt(allPrice) + parseInt(summDiv) : parseInt(allPriceWithoutPromo) + parseInt(summDiv))}{' '}₽</span>
            </div>

            <Button className="basketOrder" variant="contained" onClick={create_order}>
              <span>Заказать</span>
            </Button>
          </div>

          <Menu 
            id="basketChooseModal" 
            className={roboto.variable} 
            anchorEl={anchorEl} 
            open={open} 
            onClose={() => { setAnchorEl(null); setList([]) }}
          >
            {list.map((item, key) => 
            <MenuItem key={key} onClick={() => chooseItem(item)}>
              <div>
                <span>
                  {nameList === 'addr' ? item?.addr_name ? 
                    <span style={{textTransform: 'uppercase'}}>
                      {item.addr_name + ', '}
                    </span>
                  : null : null}
                  {item.name}
                </span>
                  {nameList === 'addr' && parseInt(item?.is_main) ?
                    <span className="circle">
                      <HomeBasketModalPC fill='#000' fillOpacity='0.6'/>
                    </span>
                  : null}
              </div>
            </MenuItem>
            )}
          </Menu>
        </>
      )}
    </>
  );
}
