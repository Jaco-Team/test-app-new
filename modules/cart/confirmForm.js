import { useRouter } from 'next/router';

import {useCartStore, useHeaderStore, useCitiesStore, useProfileStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';

import { IconClose, ArrowLeftMobile, Cloud, CheckAuthMobile } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function ConfirmForm() {
  const { push } = useRouter();

  const [getOrderList] = useProfileStore((state) => [state.getOrderList]);

  const [matches, token, showLoad] = useHeaderStore((state) => [state.matches, state.token, state.showLoad]);

  const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);

  const [openConfirmForm, setConfirmForm, orderAddr, itemsCount, allPrice, summDiv, itemsOffDops, dopListCart, free_drive, dateTimeOrder,
    promoInfo, sdacha, typePay, promoName, createOrder, typeOrder, clearCartData, setPayForm, setActiveModalBasket, dopListConfirm] = useCartStore((state) => [state.openConfirmForm, state.setConfirmForm, state.orderAddr, state.itemsCount, state.allPrice, state.summDiv, state.itemsOffDops,
    state.dopListCart, state.free_drive, state.dateTimeOrder, state.promoInfo, state.sdacha, state.typePay, state.promoName, state.createOrder,
    state.typeOrder, state.clearCartData, state.setPayForm, state.setActiveModalBasket, state.dopListConfirm]);

  function getWord(int, array) {
    return (
      (array = array || ['позиция', 'позиции', 'позиций']) && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]]
    );
  }

  let NewSummDiv = summDiv;

  let price1 = itemsOffDops.reduce(
    (all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price),
    0
  );
  let price2 = dopListCart.reduce(
    (all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price),
    0
  );

  let allPriceWithoutPromo_new = price1 + price2;

  if (parseInt(free_drive) == 1) {
    if (parseInt(allPriceWithoutPromo_new) > 0 || parseInt(allPrice) > 0) {
      NewSummDiv = 0;
    } else {
      NewSummDiv = 1;
    }
  }

  async function create_order() {
    showLoad(true);

    const res = await createOrder(token, thisCity, trueOrderCLose);

    showLoad(false);

    if (res == 'to_cart') {
      trueOrderCLose();
    }
  }

  function trueOrderCLose() {
    showLoad(true);

    setTimeout(() => {
      try {
        const ym_data = {
          city: thisCityRu,
          type_pay: typePay?.name,
          //summ: allPrice,
          typeOrder: typeOrder == 'pic' ? 'Самовывоз' : 'Доставка',
        };

        ym(47085879, 'reachGoal', 'pay_order', ym_data);
      } catch (e) {
        console.log(e);
      }

      clearCartData();
      setConfirmForm(false);
      setPayForm(false);
      push(`/${thisCity}/zakazy`);

      setTimeout(() => {
        getOrderList('zakazy', thisCity, token);

        showLoad(false);
      }, 2000);
    }, 300);
  }

  const openFormOrder = () => {
    setConfirmForm(false);
    setActiveModalBasket(true);
  };

  return (
    <>
      {matches ? (
        <SwipeableDrawer
          anchor={'bottom'}
          open={openConfirmForm}
          onClose={() => setConfirmForm(false)}
          onOpen={() => setConfirmForm(true)}
          className={'cartConfirmFormMobile ' + roboto.variable}
          disableSwipeToOpen
        >
          <div className="container">

            <div className="line" />
            <span className="confirmHeader">Подтверждение заказа</span>
            <span className="confirmText">Чтобы всё прошло по плану, проверьте, пожалуйста, условия получения и состав вашего заказа:</span>

            <div className="confirmAddr">
              <span>Доставим по адресу:</span>
              <span>{thisCityRu + ', ' + orderAddr?.name}</span>
            </div>

            <span className="confirmTime">
              {`Время доставки: ${dateTimeOrder ? (dateTimeOrder?.text ? dateTimeOrder?.text.toLowerCase() + ', ' : '') + dateTimeOrder?.name?.toLowerCase() : 'в ближайшее время'}`}
            </span>

            <span className="confirmText_2">Указано примерное время доставки, может меняться в зависимости от погодных условий и трафика.</span>

            <div className="confirmMessage">
              <Cloud />
              <span>Из-за погодных условий сегодня курьер может ехать дольше, чем обычно</span>
            </div>

            <div className="cofirmDivider" />

            <div className={dopListConfirm.length ? 'cofirmTable table' : 'cofirmTable'}>
              {itemsOffDops?.map((item, key) => (
                <div key={key}>
                  <span>{item.name}</span>
                  <span>{item.count}</span>
                  <span>
                    {new Intl.NumberFormat('ru-RU').format(promoInfo?.status_promo && item?.disabled ? item?.all_price : item.one_price)}{' '}₽
                  </span>
                </div>
              ))}
            </div>

            {dopListConfirm.length ? (
              <div className="cofirmTable">
                {dopListConfirm.map((item, key) => (
                  <div key={key}>
                    <span>{item.name}</span>
                    <span>{item.count}</span>
                    <span>{new Intl.NumberFormat('ru-RU').format(item.one_price)} ₽</span>
                  </div>
                ))}
              </div>
            ) : false}

            <div className="confirmTotal">
              <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
              <span>
                {new Intl.NumberFormat('ru-RU').format(
                  allPrice ? parseInt(allPrice) + parseInt(NewSummDiv) : parseInt(allPriceWithoutPromo_new) + parseInt(NewSummDiv))}{' '}₽
              </span>
            </div>

            {promoInfo ? promoInfo.status_promo ? 
                <div className="confirmPromo promo">
                  <CheckAuthMobile />
                  <span>{`Применили промокод ${promoName}`}</span>
                </div>
            : null : null}

            {sdacha && typePay?.id === 'cash' ? (
              <div className={promoInfo ? promoInfo.status_promo ? 'confirmPromo' : 'confirmPromo promo' : 'confirmPromo promo'}>
                <CheckAuthMobile />
                <span>{`Привезём сдачу с ${sdacha} ₽`}</span>
              </div>
            ) : null}

            <button className="confirmBTN" onClick={() => {create_order();}}>Заказать</button>

          </div>
        </SwipeableDrawer>
      ) : (
        <Dialog
          onClose={() => setConfirmForm(false)}
          className={'cartConfirmFormPC ' + roboto.variable}
          open={openConfirmForm}
          slots={Backdrop}
          slotProps={{ timeout: 500 }}
          scroll="body"
        >
          <DialogContent>
            <IconButton className="closeButton" onClick={() => setConfirmForm(false)}>
              <IconClose />
            </IconButton>

            <div className="confirmHeader">
              <ArrowLeftMobile onClick={openFormOrder} />
              <span>Подтверждение заказа</span>
            </div>

            <span className="confirmText">Чтобы всё прошло по плану, проверьте, пожалуйста, условия получения и состав вашего заказа:</span>

            <div className="confirmAddr">
              <span>Доставим по адресу:</span>
              <span>{thisCityRu + ', ' + orderAddr?.name}</span>
            </div>

            <span className="confirmTime">
              {`Время доставки: ${dateTimeOrder ? (dateTimeOrder?.text ? dateTimeOrder?.text.toLowerCase() + ', ' : '') + dateTimeOrder?.name?.toLowerCase() : 'в ближайшее время'}`}
            </span>

            <span className="confirmText_2">Указано примерное время доставки, может меняться в зависимости от погодных условий и трафика.</span>

            <div className="confirmMessage">
              <Cloud />
              <span>Из-за погодных условий сегодня курьер может ехать дольше, чем обычно</span>
            </div>

            <div className="cofirmDivider" />

            <div className={dopListConfirm.length ? 'cofirmTable table' : 'cofirmTable'}>
              {itemsOffDops?.map((item, key) => (
                <div key={key}>
                  <span>{item.name}</span>
                  <span>{item.count}</span>
                  <span>
                    {new Intl.NumberFormat('ru-RU').format(promoInfo?.status_promo && item?.disabled ? item?.all_price : item.one_price)}{' '}₽
                  </span>
                </div>
              ))}
            </div>

            {dopListConfirm.length ? (
              <div className="cofirmTable">
                {dopListConfirm.map((item, key) => (
                  <div key={key}>
                    <span>{item.name}</span>
                    <span>{item.count}</span>
                    <span>{new Intl.NumberFormat('ru-RU').format(item.one_price)} ₽</span>
                  </div>
                ))}
              </div>
            ) : false}

            <div className="confirmTotal">
              <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
              <span>
                {new Intl.NumberFormat('ru-RU').format(allPrice ? parseInt(allPrice) + parseInt(NewSummDiv) : parseInt(allPriceWithoutPromo_new) + parseInt(NewSummDiv))}{' '}₽
              </span>
            </div>

            {promoInfo ? promoInfo.status_promo ?
                <div className="confirmPromo promo">
                  <CheckAuthMobile />
                  <span>{`Применили промокод ${promoName}`}</span>
                </div>
            : null : null}

            {sdacha && typePay?.id === 'cash' ? (
              <div className={promoInfo ? promoInfo.status_promo ? 'confirmPromo' : 'confirmPromo promo' : 'confirmPromo promo'}>
                <CheckAuthMobile />
                <span>{`Привезём сдачу с ${sdacha} ₽`}</span>
              </div>
            ) : null}

            <button className="confirmBTN" onClick={() => {create_order();}}>Заказать</button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
