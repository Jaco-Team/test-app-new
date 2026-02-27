import {useCartStore, useHeaderStoreNew, useProfileStore, useCitiesStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';

import RowPC from '@/modules/header/basket/rowPC';
import CartItemMobile from '@/modules/cart/cartItemsMobile';

import { useRouter } from 'next/router';

import { reachGoal, reachGoalMain } from '@/utils/metrika';

export default function DopsForm() {
  // console.log('render DopsForm');

  const { push } = useRouter();

  const [matches, token, showLoad] = useHeaderStoreNew((state) => [state?.matches, state?.token, state?.showLoad]);

  const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);

  const [openDopsForm, setDopsForm, dopListCart, createOrder, setConfirmForm, setActiveModalBasket, clearCartData, typePay, typeOrder, checkNewOrder, allPrice, setPayForm] = useCartStore((state) => [state.openDopsForm, state.setDopsForm, state.dopListCart, state.createOrder, state.setConfirmForm, state.setActiveModalBasket, state.clearCartData, state.typePay, state.typeOrder, state.checkNewOrder, state.allPrice, state.setPayForm]);

  //  console.log('ecommerce purchase checkNewOrder:', checkNewOrder);

  const [saveUserActions, getOrderList] = useProfileStore((state) => [state.saveUserActions, state.getOrderList]);

  const handleClose = () => {
    setDopsForm(false);
  }

  const handleNext = () => {

    setDopsForm(false);

    showLoad(true);

    createOrder(token, thisCity, trueOrderCLose).then(res => {
      showLoad(false);

      if (res === 'to_cart' || res === 'wait_payment') {
        saveUserActions('cart_confirm', '', allPrice);
        setActiveModalBasket(false);
        setConfirmForm(true);
      }

    });

  };

  function trueOrderCLose() {
    showLoad(true);

    setTimeout(() => {
      try {
        const ym_data = {
          city: thisCityRu,
          type_pay: typePay?.name,
          typeOrder: typeOrder == 'pic' ? 'Самовывоз' : 'Доставка'
        };

        // Метрика: основной + городской
        reachGoal('pay_order', ym_data);
        reachGoal('pay_order_' + typeOrder + '_' + typePay?.id, ym_data);

        // новое событие "Покупка" + защита от повторного отправления цели "Покупка" при повторных кликах или возврате на страницу с помощью браузерных кнопок
        const orderId = checkNewOrder?.order?.order_id;
        if (orderId) {
          const key = `ym_purchase_${orderId}`;
          if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, 'pending');
            reachGoalMain('purchase', ym_data, () => {
              sessionStorage.setItem(key, 'sent');
            });
          }
        } else {
          //console.warn('[purchase] missing orderId');
        }

        // ecommerce purchase (пушим 1 раз — метрика раскидает по подключённым счётчикам)
        const items = (checkNewOrder?.items ?? []).map((item, index) => ({
          "id": item?.id ?? 0,
          "name": item?.name ?? '',
          "price": item?.price ?? '',
          "category": item?.cat_name ?? '',
          "quantity": item?.count ?? '',
          "position": index
        }));

        // console.log('ecommerce purchase items:', items);

        ymDataLayer.push({
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

        try{
          if( thisCityRu == 'Самара' ){
            // roistat.event.send('pay_order_samara');
            // roistat.event.send('pay_order_samara_'+typeOrder+'_'+typePay?.id);
          }

          if( thisCityRu == 'Тольятти' ){
            // roistat.event.send('pay_order_togliatti');
            // roistat.event.send('pay_order_togliatti_'+typeOrder+'_'+typePay?.id);
          }

          // roistat.event.send('pay_order');
          // roistat.event.send('pay_order_'+typeOrder+'_'+typePay?.id);
        } catch(e){ console.log(e) }

        localStorage.removeItem('freeDrive');

      } catch(e) {
        console.log(e);
      }

      setTimeout(() => {
        clearCartData();
        setActiveModalBasket(false);
        setPayForm(false);
        setConfirmForm(false);

        localStorage.removeItem('freeDrive');

        push(`/${thisCity}/zakazy`);
      }, 1800)

      setTimeout(() => {
        getOrderList('zakazy', thisCity, token);

        showLoad(false);

        localStorage.removeItem('freeDrive');
      }, 2000)

    }, 300)
  }

  return (
    <>
      {matches ? (
        <SwipeableDrawer
          anchor={'bottom'}
          open={openDopsForm}
          onClose={handleClose}
          onOpen={() => setDopsForm(true)}
          className={'cartDopsFormMobile ' + roboto.variable}
          disableSwipeToOpen
        >
          <div className="container">

            <div className="line" />
            <span className="dopsHeader">Кажется,</span>
            <span className="dopsHeader dopsHeader_2">вы кое-что забыли</span>

            <div className="dopsItems">
              {dopListCart.map((item, key) => (
                <CartItemMobile 
                  key={key} 
                  count={item.count} 
                  item={item}
                  last={key === dopListCart.length - 1 ? 'last' : ''}
                />
              ))}
            </div>
         
            <Button className="dopsButton" variant="contained" onClick={handleNext}>
              <span>Продолжить</span>
            </Button>

          </div>
        </SwipeableDrawer>
      ) : (
        <Dialog
          onClose={handleClose}
          className={'cartDopsFormPC ' + roboto.variable}
          open={openDopsForm}
          slots={Backdrop}
          slotProps={{ timeout: 500 }}
          scroll="body"
        >
          <DialogContent>
            <IconButton className="closeButton" onClick={handleClose}>
              <IconClose />
            </IconButton>
              
            <span className="dopsHeader dopsHeader_2">Кажется,</span>
            <span className="dopsHeader dopsHeader_3">вы кое-что забыли</span>

            <table className="dopsTable">
              <tbody>
                {dopListCart.length > 0 && dopListCart.map((item, key) => (
                  <RowPC 
                    key={key} 
                    count={item.count} 
                    item={item} 
                    last={key === dopListCart.length - 1}
                  />
                ))}
              </tbody>
            </table>

            <button className="dopsBTN" onClick={handleNext}>Продолжить</button>

          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
