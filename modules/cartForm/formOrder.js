import { useState, useEffect } from 'react';

import { useCartStore, useCitiesStore, useHeaderStoreNew, useProfileStore } from '@/components/store.js';
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

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { roboto } from '@/ui/Font.js';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import Cookies from 'js-cookie'

const dopText = {
  rolly: 'Не забудьте про соусы, приправы и приборы',
  pizza: 'Попробуйте необычное сочетание пиццы и соуса',
  all: 'Не забудьте про соусы, приправы и приборы',
}

const dopText_2 = 'Блюда могут содержать ингредиенты, обладающие аллергенными свойствами. Если у вас есть аллергия на какой-либо продукт, пожалуйста, уточняйте состав в меню или на кассе. Обратите внимание, что мы не можем исключить или заменить ингредиенты, но с удовольствием поможем выбрать блюдо с подходящим составом.';

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
    //{ id: 'sbp', name: 'СБП на сайте' },
    { id: 'online', name: 'Картой на сайте' },
  ];
  const type_pred = [
    { name: 'В ближайшее время', id: -1 },
    { name: 'Запланировать дату и время', id: 1 },
  ];

  const open = Boolean(anchorEl);

  const [openModalAddr, getOrderList, userInfo, getUserInfo] = useProfileStore( state => [state.openModalAddr, state.getOrderList, state.userInfo, state.getUserInfo]);

  const [matches, setActiveModalCityList, setActiveModalAlert, token, showLoad, isAuth, setActiveModalAuth] = useHeaderStoreNew((state) => [state?.matches, state?.setActiveModalCityList, state?.setActiveModalAlert, state?.token, state?.showLoad, state?.isAuth, state?.setActiveModalAuth]);

  const [thisCityList, thisCity, thisCityRu, setThisCityRu] = useCitiesStore((state) => [state.thisCityList, state.thisCity, state.thisCityRu, state.setThisCityRu]);
 
  const [setFreeDrive, setPayForm, setActiveModalBasket, clearCartData, items, itemsCount, promoInfo, itemsOffDops, dopListCart, allPrice, getInfoPromo, checkPromo, setActiveMenuCart, pointList, getMySavedAddr,createOrder, changeAllItems, addrList, orderPic, orderAddr, setAddrDiv, setPoint, getTimesPred, getDataPred, dateTimeOrder, setDataTimeOrder, setActiveDataTimePicker, typePay, setTypePay, changeComment, comment, typeOrder, setTypeOrder, setSummDiv, sdacha, setSdacha, check_need_dops, cart_is, free_drive, setConfirmForm, getNewPriceItems, setMailForm, checkNewOrder] = useCartStore((state) => [state.setFreeDrive, state.setPayForm, state.setActiveModalBasket, state.clearCartData, state.items, state.itemsCount,
    state.promoInfo, state.itemsOffDops, state.dopListCart, state.allPrice, state.getInfoPromo, state.checkPromo, state.setActiveMenuCart, state.pointList, state.getMySavedAddr, state.createOrder, state.changeAllItems, state.addrList, state.orderPic, state.orderAddr, state.setAddrDiv, state.setPoint, state.getTimesPred, state.getDataPred, state.dateTimeOrder, state.setDataTimeOrder, state.setActiveDataTimePicker, state.typePay, state.setTypePay, state.changeComment, state.comment, state.typeOrder, state.setTypeOrder, state.setSummDiv, state.sdacha, state.setSdacha, state.check_need_dops, state.cart_is, state.free_drive, state.setConfirmForm, state.getNewPriceItems, state.setMailForm, state.checkNewOrder]);
    
  const [ saveUserActions ] = useProfileStore((state) => [state.saveUserActions]);

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
    if( thisCity ){
      getMySavedAddr(thisCity);
    }
  }, [thisCity, cityName]);

  useEffect(() => {
    // if (sessionStorage.getItem('promo_name') && sessionStorage.getItem('promo_name').length > 0) {
    //   setPromo(sessionStorage.getItem('promo_name'));
    // }

    if (Cookies.get('promo_name') && Cookies.get('promo_name').length > 0) {
      setPromo(Cookies.get('promo_name'));
    }
  }, [promoInfo]);

  useEffect(() => {
    /*let check_free_drive = localStorage.getItem('freeDrive');

    if( 
        check_free_drive && check_free_drive.length > 0 && check_free_drive == '1722474061' 
          && 
        dayjs( new Date() ).locale('ru').format('YYYY-MM-DD') <= dayjs( new Date("2024-08-20") ).locale('ru').format('YYYY-MM-DD')
      ){
      setFreeDrive(1);
    }*/

    if( orderAddr && orderAddr?.comment?.length > 0 && comment?.length == 0 ){
      changeComment(orderAddr?.comment);
    }

  }, [orderAddr])

  useEffect(() => {
    check_need_dops();

    let check_free_drive = localStorage.getItem('freeDrive');

    if( 
        check_free_drive && check_free_drive.length > 0 && check_free_drive == '1722474061' 
          && 
        dayjs( new Date() ).locale('ru').format('YYYY-MM-DD') <= dayjs( new Date("2024-08-20") ).locale('ru').format('YYYY-MM-DD')
      ){
      setFreeDrive(1);
    }

    if( addrList && addrList?.length > 0 && orderAddr ){
      let findAddr = addrList.find( addr => parseInt(addr?.id) == parseInt(orderAddr?.id) );

      if( findAddr ){
        setAddrDiv(findAddr);
        setSummDiv(findAddr.sum_div ?? 0);
      }
    }

  }, [])

  useEffect(() => {
    if( dayjs( new Date ).locale('ru').format('YYYY-MM-DD') > dateTimeOrder?.date ){
      setDataTimeOrder({ name: 'В ближайшее время', id: -1 });
    }
  }, [dateTimeOrder])

  useEffect(() => {
    if( token && token.length > 0 ) {
      getUserInfo('profile', thisCity, token);
    }
  }, [token]);

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

      if(isAuth !== 'auth') {
        setActiveModalBasket(false); 
        setActiveModalAuth(true);
        return;
      }

      if (matches) {
        setActiveMenuCart(true, nameList);
      } else {
        const points = pointList.filter((point) => point.name_ru === thisCityRu);
        setList(points);
        setAnchorEl(event.currentTarget);
      }
    }

    if (nameList === 'addr') {
      if(isAuth !== 'auth') {
        setActiveModalBasket(false); 
        setActiveModalAuth(true);
        return;
      }

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
      const point_id = typeOrder == 'pic' ? orderPic?.id : orderAddr?.point_id;

      if (point_id) {
        getDataPred();
        getTimesPred(point_id, null, typeOrder == 'pic' ? 1 : 0, []);

        if (matches) {
          setActiveMenuCart(true, nameList);
        } else {
          setAnchorEl(event.currentTarget);
          setList(type_pred);
        }
      } else {
        setActiveModalAlert(true, 'Необходимо выбрать ' + (typeOrder == 'pic' ? 'Кафе' : 'Адрес доставки'), false);
      }
    }

    if (nameList === 'pay') {
      if(isAuth !== 'auth') {
        setActiveModalBasket(false); 
        setActiveModalAuth(true);
        return;
      }

      if ( typeOrder == 'pic' ) {
        setList(type_pay_pic);
      } else {
        setList(type_pay_div);
      }

      if (matches) {
        setActiveMenuCart(true, nameList);
      } else {
        setAnchorEl(event.currentTarget);
      }
    }

    if (nameList === 'message') {
      
      if(isAuth !== 'auth') {
        setActiveModalBasket(false); 
        setActiveModalAuth(true);
        return;
      }

      setActiveMenuCart(true, nameList);
    }
  };

  const chooseItem = (item) => {

    if (nameList === 'city') {
      localStorage.setItem('setCity', JSON.stringify(item));
      setThisCityRu(item.name);
      setAnchorEl(null);
      push(`/${item.link}`);
      setPoint(null);
      setAddrDiv(null);
      setSummDiv(0);
      getMySavedAddr(item.link);
      getNewPriceItems(item.link)
    }

    if (nameList === 'point') {
      setPoint(item);
      setAnchorEl(null);
    }

    if (nameList === 'addr') {
      setAddrDiv(item);
      setSummDiv(item.sum_div ?? 0);
      setAnchorEl(null);

      setFreeDrive( parseInt(item?.free_drive) );

      if( item?.comment?.length > 0 ){
        changeComment(item?.comment)
      }

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

  async function create_order() {
    //token, typeOrder, city_id, point_id, addr, typePay, dateTimeOrder, comment, sdacha, promoName

    if(isAuth !== 'auth') {
      setActiveModalBasket(false); 
      setActiveModalAuth(true);
      return;
    }
    
    if(!thisCityRu) {
      setActiveModalAlert(true, 'Необходимо выбрать город', false);
      return;
    }

    if ( typeOrder == 'pic' ) {
      if (!orderPic) {
        setActiveModalAlert(true, 'Необходимо выбрать Кафе', false);
        return;
      }
    } 
    
    if ( typeOrder == 'dev' ) {
      if (!orderAddr) {
        setActiveModalAlert(true, 'Необходимо выбрать Адрес доставки', false);
        return;
      }
    }

    if(!typePay) {
      setActiveModalAlert(true, 'Необходимо выбрать способо оплаты', false);
      return;
    }

    if(!items.length && !itemsOffDops.length) {
      setActiveModalAlert(true, 'Необходимо добавить товар в корзину', false);
      return;
    }

    if(typePay.id === 'online' && !userInfo.mail) {
      setMailForm(true);
      return;
    }

      //if(typeOrder === 'dev') {
      
    //} else {
      showLoad(true);
  
      const res = await createOrder( token, thisCity, trueOrderCLose );
  
      showLoad(false);
  
      if( res == 'to_cart' || res == 'wait_payment' ){
        //trueOrderCLose();

        saveUserActions('cart_confirm', '', allPrice);

        setActiveModalBasket(false);
        setConfirmForm(true);
      }
    //}

  }

  function trueOrderCLose() {
    showLoad(true);

    setTimeout(() => {

      try{
        const ym_data = {
          city: thisCityRu,
          type_pay: typePay?.name,
          //summ: allPrice,
          typeOrder: typeOrder == 'pic' ? 'Самовывоз' : 'Доставка'
        }
  
        ym(47085879, 'reachGoal', 'pay_order', ym_data);

        if( thisCityRu == 'Самара' ){
          ym(100325084, 'reachGoal', 'pay_order', ym_data);

          let items = [];

          checkNewOrder?.items?.map( (item, index) => {
            items.push({
              "id": item?.id ?? 0,
              "name": item?.name ?? '',
              "price": item?.price ?? '',
              //"brand": "Яндекс / Яndex",
              "category": item?.cat_name ?? '',
              //"variant": "Оранжевый цвет",
              "quantity": item?.count ?? '',
              //"list": "Одежда",
              "position": index
            })
          } )

          dataLayer.push({
            "ecommerce": {
              "currencyCode": "RUB",
              "purchase": {
                "actionField": {
                  "id": checkNewOrder?.order?.order_id ?? 0,
                  "coupon": checkNewOrder?.order?.promo_name ?? '',
                  "revenue": checkNewOrder?.order?.sum_order ?? 0
                },
                "products": items ?? []
              }
            }
          });

          ym(100325084, 'reachGoal', 'pay_order_'+typeOrder+'_'+typePay?.id, ym_data);
        }

        if( thisCityRu == 'Тольятти' ){
          ym(100601350, 'reachGoal', 'pay_order', ym_data);

          let items = [];

          checkNewOrder?.items?.map( (item, index) => {
            items.push({
              "id": item?.id ?? 0,
              "name": item?.name ?? '',
              "price": item?.price ?? '',
              //"brand": "Яндекс / Яndex",
              "category": item?.cat_name ?? '',
              //"variant": "Оранжевый цвет",
              "quantity": item?.count ?? '',
              //"list": "Одежда",
              "position": index
            })
          } )

          dataLayer.push({
            "ecommerce": {
              "currencyCode": "RUB",
              "purchase": {
                "actionField": {
                  "id": checkNewOrder?.order?.order_id ?? 0,
                  "coupon": checkNewOrder?.order?.promo_name ?? '',
                  "revenue": checkNewOrder?.order?.sum_order ?? 0
                },
                "products": items ?? []
              }
            }
          });

          ym(100601350, 'reachGoal', 'pay_order_'+typeOrder+'_'+typePay?.id, ym_data);
        }
      }catch(e){
        console.log(e)
      }
      
      /*if( typePay?.id == 'cash' ){
        
      }*/

      setTimeout(() => {
        clearCartData();
        //clearOrderList();
        
        setActiveModalBasket(false);
        setPayForm(false);
        setConfirmForm(false);
  
        push(`/${thisCity}/zakazy`);
      }, 1500)


      

      setTimeout(() => {
        getOrderList('zakazy', thisCity, token);

        showLoad(false);

        localStorage.removeItem('freeDrive');
      }, 2000)
    }, 300)
  }

  function setPromoText(event){

    if (event.keyCode === 13) {
      getInfoPromo(promo, thisCity);

      setTimeout( () => {
        getInfoPromo(promo, thisCity)
      }, 300 )
    }
  }

  const handleComment = (event) => {
    if(isAuth !== 'auth') {
      setActiveModalBasket(false); 
      setActiveModalAuth(true);
    } else {
      changeComment(event)
    }
  }

  let NewSummDiv = typeOrder == 'pic' ? 0 : orderAddr?.sum_div ?? 0;

  let price1 = itemsOffDops.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);
  let price2 = dopListCart.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);

  let allPriceWithoutPromo_new = price1 + price2;

  if( parseInt(free_drive) == 1 ) {
    if( parseInt(allPriceWithoutPromo_new) > 0 || parseInt(allPrice) > 0 ) {
      NewSummDiv = 0;
    }else{
      NewSummDiv = 1;
    }
  }

  let date = new Date();
  let hours = date.getHours();

  /*const ym_data = {
    city: thisCityRu,
    type_pay: typePay?.name,
    summ: allPriceWithoutPromo_new + NewSummDiv,
    typeOrder: typeOrder == 'pic' ? 'Самовывоз' : 'Доставка'
  }*/

  useEffect( () => {
    if( typePay?.id == 'online' && [1,2,3].includes( parseInt(orderAddr?.point_id) ) ){
      if( dayjs( new Date ).locale('ru').format('YYYY-MM-DD') >= "2024-12-14" && dayjs( new Date ).locale('ru').format('YYYY-MM-DD') <= "2024-12-31" ){
        setActiveModalAlert(true, 'По техническим причинам оплата банковской картой временно недоступна. Оплату можно будет осуществить только наличными. Будем благодарны, если вы подготовите сумму без сдачи.', false);
      }
    }
  }, [typePay, orderAddr] )

  return (
    <>
      {matches ? (
        <div className="CartMobileContainer">
          <div className="CartMobileText">Оформить заказ</div>

          <Stack direction="row" alignItems="center" style={{ width: '86.324786324786vw', marginBottom: '6.8376068376068vw' }}>
            <MySwitchMobile onClick={(event) => setTypeOrder(event.target.checked) } checked={ typeOrder == 'pic' ? true : false} />
          </Stack>

          <Button className="CartChoose" onClick={(event) => openMenu(event, 'city')} endIcon={<ArrowDownCartMobile />}>
            <div>
              <Typography component="span">
                <CityBasketModalPC />
              </Typography>
              <Typography component="span">{thisCityRu}</Typography>
            </div>
          </Button>

          {typeOrder == 'pic' ? (
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

          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />} style={{ marginBottom: typeOrder == 'pic' ? '6.8376068376068vw' : '3.4188034188034vw' }} 
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

          {typeOrder == 'pic' ? null : typePay?.id !== 'cash' ? null : (
            <Button className="CartChoose">
              <div>
                <Typography component="span">
                  <MoneyIcon />
                </Typography>

                <MyTextInput
                  autoFocus
                  type="text"
                  value={sdacha ? sdacha : ''}
                  func={(event) => setSdacha(event)}
                  variant="outlined"
                  className="sdacha"
                  placeholder="Без сдачи"
                />
              </div>
            </Button>
          )}

          {typeOrder == 'pic' ? null : (
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

          <Accordion className='CartItemDopText_accordion' style={{ marginBottom: itemsOffDops.length ? null : '3.4188034188034vw' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Об аллергенах</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {dopText_2}
            </AccordionDetails>
          </Accordion>

          {/* <div className="CartItemDopText" style={{ marginBottom: itemsOffDops.length ? null : '3.4188034188034vw' }}>
            <span>{dopText_2}</span>
          </div> */}

          {itemsOffDops.map((item, key) => (
            <CartItemMobile key={key} count={item.count} item={item} last={ item === itemsOffDops.at(-1) ? 'last' : '' }/>
          ))}

          {dopListCart.length ? (
            <>
              <div className="CartItemDopText">
                <span>{dopText[cart_is]}</span>
              </div>
              {dopListCart.map((item, key) => (
                <CartItemMobile key={key} count={item.count} item={item} last={''} />
              ))}
            </>
          ) : null}

          {typeOrder == 'pic' ? null : (
            <div className="CartDelivery">
              <span>Доставка:</span>
              <span>{new Intl.NumberFormat('ru-RU').format(NewSummDiv)} ₽</span>
            </div>
          )}

          <div className="CartTotal" style={{ marginTop: typeOrder == 'pic' ? '5.1282051282051vw' : 0 }}>
            <span>
              Итого: {itemsCount} {getWord(itemsCount)}
            </span>
            <div>
              {/* <span className={ promoInfo?.items_on_price?.length ? promoItemsFind ? 'promoInfo' : null : promoInfo?.status_promo && itemsOffDops.length ? 'promoInfo' : null }> */}
              <span className={checkPromo ? checkPromo.st && itemsOffDops.length ? 'promoInfo' : null : null}>
                {new Intl.NumberFormat('ru-RU').format(parseInt(allPriceWithoutPromo_new) + parseInt(NewSummDiv))} ₽
              </span>
            </div>
          </div>

          <div className="CartPromo">
            <MyTextInput
              placeholder="Есть промокод"
              value={promo}
              label=""
              name="promo"
              id="promo"
              onKeyDown={setPromoText}
              onBlur={() => getInfoPromo(promo, thisCity)}
              func={ event => setPromo(event.target.value)}
              inputAdornment={
                <InputAdornment position="end">
                  {checkPromo ? checkPromo.st ? <div className="circleInput"></div> : <div className="circleInput" style={{ background: '#DD1A32' }}></div> : null}
                </InputAdornment>}
            />
            {/* {promoInfo?.items_on_price?.length ? promoItemsFind ?
                <div>{new Intl.NumberFormat('ru-RU').format(parseInt(allPrice) + parseInt(NewSummDiv))}{' '}₽</div> : null : promoInfo?.status_promo && itemsCount ? 
                <div>{new Intl.NumberFormat('ru-RU').format(parseInt(allPrice) + parseInt(NewSummDiv))}{' '}₽</div> : null} */}
                 {checkPromo ? checkPromo.st && itemsOffDops.length ? <div>{new Intl.NumberFormat('ru-RU').format(parseInt(allPrice) + parseInt(NewSummDiv))}{' '}₽</div> : null : null}
          </div>

          <div className="CartItemDescPromo">
            <span style={{ color: promoInfo?.status_promo ? 'rgba(0, 0, 0, 0.80)' : '#DD1A32' }}>
              {checkPromo?.text}
            </span>
          </div>

          {typeOrder == 'pic' ? 
            <span className="basketDopText">{ parseInt(hours) >= 21 ? 'Заказы на самовывоз выдаются до 22:00' : '' }</span> 
              : 
            <span className="basketDopText">Уважаемые клиенты, на сайте указано приблизительное время готовности заказа и доставки. В зависимости от ситуации на дорогах время доставки может быть увеличено. Благодарим за понимание!</span>
          }

          <Button className="CartOrder" variant="contained" disabled={!itemsCount} onClick={ () => { create_order(); } }>
            <span>{typeOrder === 'dev' ? 'Подтвердить' : 'Заказать'}</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="modalBasketContainer">
            <div className="basketHeader">
              <Typography component="span">Оформить заказ</Typography>
            </div>

            <Stack direction="row" alignItems="center" style={{ width: '28.880866425993vw', marginBottom: '2.8880866425993vw' }}>
              <MySwitchPC onClick={(event) => setTypeOrder(event.target.checked) } checked={ typeOrder == 'pic' ? true : false} />
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

            {typeOrder == 'pic' ? (
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

            <Button className="basketChoose" style={{ marginBottom: typeOrder == 'pic' ? '2.8880866425993vw' : '1.4440433212996vw' }}
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

            {typeOrder == 'pic' ? null : typePay?.id !== 'cash' ? null : (
              <Button className="basketChoose">
                <div>
                  <Typography component="span">
                    <MoneyIcon />
                  </Typography>

                  <MyTextInput
                    autoFocus
                    type="number"
                    value={sdacha ? sdacha : ''}
                    func={(event) => setSdacha(event)}
                    variant="outlined"
                    className="sdacha"
                    placeholder="Без сдачи"
                  />
                </div>
              </Button>
            )}

            {typeOrder == 'pic' ? null : (
              <div className="basketMessage">
                <Typography component="span">
                  <MessageBasketModalPC />
                </Typography>
                <MyTextInput
                  autoFocus
                  type="text"
                  value={comment}
                  func={(event) => handleComment(event)}
                  multiline
                  maxRows={3}
                  variant="outlined"
                  className="message"
                  placeholder="Сообщение курьеру"
                />
              </div>
            )}

            <div className="basketLine"></div>

            {typeOrder == 'pic' ? null : (
              <div className="basketDelivery">
                <span>Доставка:</span>
                <span>{new Intl.NumberFormat('ru-RU').format(NewSummDiv)} ₽</span>
              </div>
            )}
            
            <div className="basketTotal" style={{ marginTop: typeOrder == 'pic' ? '2.1660649819495vw' : '0.72202166064982vw' }}>
              <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
              <span>{new Intl.NumberFormat('ru-RU').format(allPrice ? parseInt(allPrice) + parseInt(NewSummDiv) : parseInt(allPriceWithoutPromo_new) + parseInt(NewSummDiv))}{' '}₽</span>
            </div>

            {typeOrder == 'pic' ? 
              <span className="basketDopText">{ parseInt(hours) >= 21 ? 'Заказы на самовывоз выдаются до 22:00' : '' }</span> 
                : 
              <span className="basketDopText">Уважаемые клиенты, на сайте указано приблизительное время готовности заказа и доставки. В зависимости от ситуации на дорогах время доставки может быть увеличено. Благодарим за понимание!</span>
            }

            <Button className="basketOrder" variant="contained" onClick={ () => { create_order(); } }>
              <span>{typeOrder === 'dev' ? 'Подтвердить' : 'Заказать'}</span>
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
                <div style={{ flexDirection: 'column' }}>
                  <div style={{ flexDirection: 'row' }}>
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
                  {nameList === 'addr' && item.name != 'Добавить новый адрес' ?
                    <span className='dopAddrInfo'>
                      {item?.pd?.length > 0 && parseInt(item?.pd) > 0 ? ('Пд: '+item?.pd + ', ') : ''}
                      {item?.et?.length > 0 && parseInt(item?.et) > 0 ? ('Этаж: '+item?.et + ', ') : ''}
                      { parseInt(item?.dom_true) == 0 ? 'Домофон: не работает' : 'Домофон: работает'}
                    </span>
                      :
                    false
                  }
                </div>
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </>
  );
}
