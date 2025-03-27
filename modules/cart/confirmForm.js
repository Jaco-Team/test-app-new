import { useEffect } from 'react';

import { useRouter } from 'next/router';

import Script from 'next/script';

import {useCartStore, useHeaderStoreNew, useCitiesStore, useProfileStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';

import { IconClose, ArrowLeftMobile, Cloud, TimeConfirm, CheckAuthMobile } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function ConfirmForm() {
  const { push } = useRouter();

  const [getOrderList] = useProfileStore((state) => [state.getOrderList]);

  const [matches, token, showLoad] = useHeaderStoreNew((state) => [state?.matches, state?.token, state?.showLoad]);

  const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);

  const [openPayForm, linkPaySBP] = useCartStore((state) => [state.openPayForm, state.linkPaySBP]);

  const [trueOrderCash, openConfirmForm, setConfirmForm, itemsCount, typePay, createOrder, typeOrder, clearCartData, setPayForm, setActiveModalBasket, checkNewOrder] = useCartStore((state) => [ state.trueOrderCash, state.openConfirmForm, state.setConfirmForm, state.itemsCount,
    state.typePay, state.createOrder, state.typeOrder, state.clearCartData, state.setPayForm, state.setActiveModalBasket, state.checkNewOrder]);

  function getWord(int, array) {
    return (
      (array = array || ['позиция', 'позиции', 'позиций']) && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]]
    );
  }

  async function create_order() {
    showLoad(true);

    //const res = await createOrder(token, thisCity, trueOrderCLose);
    const res = await trueOrderCash(token, checkNewOrder?.order?.point_id, checkNewOrder?.order?.order_id);

    showLoad(false);

    if (res == true) {
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
          typeOrder: typeOrder == 'pic' ? 'Самовывоз' : 'Доставка',
        };

        ym(47085879, 'reachGoal', 'pay_order', ym_data);

        

        if( thisCityRu == 'Самара' ){
          ym(100325084, 'reachGoal', 'pay_order', ym_data);

          let items = [];

          checkNewOrder?.items?.map( (item, index) => {
            items.push({
              "id": item?.id ?? 0,
              "name": item?.name ?? '',
              "price": item?.price ?? 0,
              //"brand": "Яндекс / Яndex",
              "category": item?.cat_name ?? '',
              //"variant": "Оранжевый цвет",
              "quantity": item?.count ?? 0,
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
                  "revenue": checkNewOrder?.order?.sum_order ?? 0,
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
              "price": item?.price ?? 0,
              //"brand": "Яндекс / Яndex",
              "category": item?.cat_name ?? '',
              //"variant": "Оранжевый цвет",
              "quantity": item?.count ?? 0,
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
                  "revenue": checkNewOrder?.order?.sum_order ?? 0,
                },
                "products": items ?? []
              }
            }
          });

          ym(100601350, 'reachGoal', 'pay_order_'+typeOrder+'_'+typePay?.id, ym_data);
        }
      } catch (e) {
        console.log(e);
      }

      setTimeout( () => {
        clearCartData();
        setConfirmForm(false);
        setPayForm(false);
        push(`/${thisCity}/zakazy`);
      }, 1500 )
      
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

  //<ArrowLeftMobile onClick={openFormOrder} />

  useEffect(() => {
    if(openConfirmForm === true) {
      let timerFunc = setTimeout(() => {
        setConfirmForm(false)
      }, 1000 * 60 * 12); //12 минут
      return () => clearTimeout(timerFunc);
    }
  }, [openConfirmForm]);

  //<span className="confirmText">Чтобы всё прошло по плану, проверьте, пожалуйста, условия получения и состав вашего заказа:</span>

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

            { openPayForm === false ? false :
              <Script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" />
            }

            <div className="line" />
            <span className="confirmHeader">Подтверждение заказа</span>
            

            { parseInt( checkNewOrder?.order?.type_order_ ) == 1 ? 
              <div className="confirmAddr">
                <span>Доставим по адресу:</span>
                <span>{thisCityRu + ', ' + checkNewOrder?.order?.street + ', ' + checkNewOrder?.order?.home + ', кв ' + checkNewOrder?.order?.kv}</span>
              </div>
                :
              <div className="confirmAddr">
                <span>Приготовим по адресу:</span>
                <span>{thisCityRu + ', ' + checkNewOrder?.order?.point_name}</span>
              </div>
            }
  
            <span className="confirmTime">
              { checkNewOrder?.order?.max_time_order }
            </span>
            
            <span className="confirmText_2"></span>

            { parseInt( checkNewOrder?.order?.type_order_ ) == 1 && parseInt( checkNewOrder?.order?.is_pred ) == 1 ? 
              <div className="confirmMessage">
                <TimeConfirm style={{ fill: '#fff' }} />

                <span>Пожалуйста, будьте по адресу в указанный промежуток времени.</span>
              </div>
                :
              false
            }

            { parseInt( checkNewOrder?.order?.type_order_ ) == 1 ?
              <div className="confirmMessage">
                <Cloud />
                <span>Из-за погодных условий сегодня курьер может ехать дольше, чем обычно</span>
              </div>
                :
              false
            }

            <div className="cofirmDivider" />

            <div className={'cofirmTable'}>
              {checkNewOrder?.items?.map((item, key) => (
                <div key={key}>
                  <span>{item.name}</span>
                  <span>{item.count}</span>
                  <span>{new Intl.NumberFormat('ru-RU').format(item.price)}{' '}₽</span>
                </div>
              ))}
            </div>

            

            <div className="confirmTotal">
              <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
              <span>
                {new Intl.NumberFormat('ru-RU').format( checkNewOrder?.order?.sum_order )}{' '}₽
              </span>
            </div>

            {checkNewOrder?.order?.promo_name?.length > 0 ?
              <div className="confirmPromo promo">
                <CheckAuthMobile />
                <span>{`Применили промокод ${checkNewOrder?.order?.promo_name}`}</span>
              </div>
                : 
              null
            }

            { parseInt(checkNewOrder?.order?.sdacha) > 0 ?
              <div className={'confirmPromo promo'}>
                <CheckAuthMobile />
                <span>{`Привезём сдачу с ${checkNewOrder?.order?.sdacha} ₽`}</span>
              </div>
                : 
              null
            }

            <div className="ContainerCart" style={{width: '100%'}}>
              <div className="Line"></div>
              <div id="payment-form" />
            </div>

            { typePay?.id == 'sbp' ? 
              <iframe
                src={linkPaySBP}
                width='100%'
                height={900}
                style={{marginTop: 20}}
                loading="lazy"
              ></iframe>
                :
              false
            }

            { typePay?.id == 'online' || typePay?.id == 'sbp' ? false :
              <button className="confirmBTN" onClick={ () => create_order() }>Заказать</button>
            }

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

            { openPayForm === false ? false :
              <Script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" />
            }

            <div className="confirmHeader">
              
              <span>Подтверждение заказа</span>
            </div>

            

            { parseInt( checkNewOrder?.order?.type_order_ ) == 1 ? 
              <div className="confirmAddr">
                <span>Доставим по адресу:</span>
                <span>{thisCityRu + ', ' + checkNewOrder?.order?.street + ', ' + checkNewOrder?.order?.home + ', кв ' + checkNewOrder?.order?.kv}</span>
              </div>
                :
              <div className="confirmAddr">
                <span>Приготовим по адресу:</span>
                <span>{thisCityRu + ', ' + checkNewOrder?.order?.point_name}</span>
              </div>
            }
            
            <span className="confirmTime">
              { checkNewOrder?.order?.max_time_order }
            </span>
            
            <span className="confirmText_2"></span>

            { parseInt( checkNewOrder?.order?.type_order_ ) == 1 && parseInt( checkNewOrder?.order?.is_pred ) == 1 ? 
              <div className="confirmMessage">
                <TimeConfirm style={{ fill: '#fff' }} />

                <span>Пожалуйста, будьте по адресу в указанный промежуток времени.</span>
              </div>
                :
              false
            }

            { parseInt( checkNewOrder?.order?.type_order_ ) == 1 ?
              <div className="confirmMessage">
                <Cloud />
                <span>Из-за погодных условий сегодня курьер может ехать дольше, чем обычно</span>
              </div>
                :
              false
            }

            <div className="cofirmDivider" />

            <div className={'cofirmTable'}>
              {checkNewOrder?.items?.map((item, key) => (
                <div key={key}>
                  <span>{item.name}</span>
                  <span>{item.count}</span>
                  <span>{new Intl.NumberFormat('ru-RU').format(item.price)}{' '}₽</span>
                </div>
              ))}
            </div>

            <div className="confirmTotal">
              <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
              <span>
                {new Intl.NumberFormat('ru-RU').format( checkNewOrder?.order?.sum_order )}{' '}₽
              </span>
            </div>

            {checkNewOrder?.order?.promo_name?.length > 0 ?
              <div className="confirmPromo promo">
                <CheckAuthMobile />
                <span>{`Применили промокод ${checkNewOrder?.order?.promo_name}`}</span>
              </div>
                : 
              null
            }

            { parseInt(checkNewOrder?.order?.sdacha) > 0 ?
              <div className={'confirmPromo promo'}>
                <CheckAuthMobile />
                <span>{`Привезём сдачу с ${checkNewOrder?.order?.sdacha} ₽`}</span>
              </div>
                : 
              null
            }

            <div className="ContainerCart" style={{width: '100%'}}>
              <div className="Line"></div>
              <div id="payment-form" />
            </div>

            { typePay?.id == 'sbp' ? 
              <iframe
                src={linkPaySBP}
                width='100%'
                height={900}
                style={{marginTop: 20}}
                loading="lazy"
              ></iframe>
                :
              false
            }

            { typePay?.id == 'online' || typePay?.id == 'sbp' ? false :
              <button className="confirmBTN" onClick={ () => create_order() }>Заказать</button>
            }

          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
