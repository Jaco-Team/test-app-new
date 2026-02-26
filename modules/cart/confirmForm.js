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

import CartConfirmMap from '@/modules/cart/cartConfirmMap';

import { reachGoal, reachGoalMain } from '@/utils/metrika';

export default function ConfirmForm() {
  const { push } = useRouter();

  const [getOrderList] = useProfileStore((state) => [state.getOrderList]);

  const [matches, token, showLoad, setActiveModalAlert] = useHeaderStoreNew((state) => [state?.matches, state?.token, state?.showLoad, state.setActiveModalAlert]);

  const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);

  const [openPayForm, linkPaySBP] = useCartStore((state) => [state.openPayForm, state.linkPaySBP]);

  const [trueOrderCash, openConfirmForm, setConfirmForm, itemsCount, typePay, createOrder, typeOrder, clearCartData, setPayForm, setActiveModalBasket, checkNewOrder, orderAddr, itemsOffDops, dopListCart, allPrice, free_drive] = useCartStore((state) => {
    return [ state.trueOrderCash, state.openConfirmForm, state.setConfirmForm, state.itemsCount,
      state.typePay, state.createOrder, state.typeOrder, state.clearCartData, state.setPayForm, state.setActiveModalBasket, state.checkNewOrder, state.orderAddr, state.itemsOffDops, state.dopListCart, state.allPrice, state.free_drive ];
    });

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

    //setTimeout(() => {
    try {
      const ym_data = {
        city: thisCityRu,
        type_pay: typePay?.name,
        typeOrder: typeOrder == 'pic' ? 'Самовывоз' : 'Доставка',
      };

      // 1) цели: основной + городской
      reachGoal('pay_order', ym_data);
      reachGoal(`pay_order_${typeOrder}_${typePay.id}`, ym_data);

      // новое событие "Покупка" + защита от повторного отправления цели "Покупка" при повторных кликах или возврате на страницу с помощью браузерных кнопок
      const orderId = checkNewOrder?.order?.order_id;
      if (!orderId) {
        console.warn('YM purchase skipped: no orderId');
      } else {
        const key = `ym_purchase_${orderId}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          reachGoalMain('purchase', ym_data);
        }
      }

      // 2) ecommerce purchase
      const items = (checkNewOrder?.items ?? []).map((item, index) => ({
        id: item?.id ?? 0,
        name: item?.name ?? '',
        price: item?.price ?? 0,
        category: item?.cat_name ?? '',
        quantity: item?.count ?? 0,
        position: index,
      }));

      ymDataLayer.push({
        ecommerce: {
          currencyCode: 'RUB',
          purchase: {
            actionField: {
              id: checkNewOrder?.order?.order_id ?? 0,
              coupon: checkNewOrder?.order?.promo_name ?? '',
              revenue: checkNewOrder?.order?.sum_order ?? 0,
            },
            products: items ?? [],
          },
        },
      });
 
      try {
        if (thisCityRu == 'Самара') {
          // roistat.event.send('pay_order_samara');
          // roistat.event.send('pay_order_samara_'+typeOrder+'_'+typePay?.id);
        }

        if (thisCityRu == 'Тольятти') {
          // roistat.event.send('pay_order_togliatti');
          // roistat.event.send('pay_order_togliatti_'+typeOrder+'_'+typePay?.id);
        }

        // roistat.event.send('pay_order');
        // roistat.event.send('pay_order_'+typeOrder+'_'+typePay?.id);
      } catch (e) {
        console.log(e);
      }

    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      clearCartData();
      setConfirmForm(false);
      setPayForm(false);
      push(`/${thisCity}/zakazy`);
    }, 1800);

    setTimeout(() => {
      getOrderList('zakazy', thisCity, token);
      showLoad(false);
    }, 2000);
    //}, 300);
  }

  // const openFormOrder = () => {
  //   setConfirmForm(false);
  //   setActiveModalBasket(true);
  // };

  //<ArrowLeftMobile onClick={openFormOrder} />

  // useEffect(() => {
  //   if(openConfirmForm === true) {
  //     let timerFunc = setTimeout(() => {
  //       setConfirmForm(false)
  //     }, 1000 * 60 * 12); //12 минут
  //     return () => clearTimeout(timerFunc);
  //   }
  // }, [openConfirmForm]);

  useEffect(() => {
    if (!openConfirmForm) return;

    const TIMEOUT_MS = 1000 * 60 * 10;

    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setHours(21, 35, 0, 0);
    const cutoffTs = cutoff.getTime();

    const isAfterCutoff = () => Date.now() >= cutoffTs;

    let closed = false;
    const close = (reason) => {
      if (closed) return;
      closed = true;

      if (reason === 'cutoff') {
        setActiveModalAlert(true, 'Сегодня заказы больше не принимаются!', false);
      }
      setConfirmForm(false);
    };

    if (isAfterCutoff()) {
      close('cutoff');
      return;
    }

    const startedAt = Date.now();

    const interval = setInterval(() => {
      if (!openConfirmForm) return;

      if (isAfterCutoff()) {
        close('cutoff');
        clearInterval(interval);
        return;
      }

      if (Date.now() - startedAt >= TIMEOUT_MS) {
        close('timeout');
        clearInterval(interval);
      }
    }, 1000);

    const onVisible = () => {
      if (document.visibilityState === 'visible' && isAfterCutoff()) {
        close('cutoff');
        clearInterval(interval);
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [openConfirmForm, setConfirmForm, setActiveModalAlert]);

  //<span className="confirmText">Чтобы всё прошло по плану, проверьте, пожалуйста, условия получения и состав вашего заказа:</span>

  let price1 = itemsOffDops.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);
  let price2 = dopListCart.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);

  let allPriceWithoutPromo_new = price1 + price2;

  let NewSummDiv = typeOrder == 'pic' ? 0 : orderAddr?.sum_div ?? 0;

  if(parseInt(free_drive) == 1) {
    if(parseInt(allPriceWithoutPromo_new) > 0 || parseInt(allPrice) > 0) {
      NewSummDiv = 0;
    } else {
      NewSummDiv = 1;
    }
  }

  return (
    <>
      {matches ? (
        <SwipeableDrawer
          anchor={'bottom'}
          open={openConfirmForm}
          onClose={() => setConfirmForm(false)}
          onOpen={() => setConfirmForm(true)}
          className={(typePay?.id === 'cash' ? 'cartConfirmFormMobile_cash ' : 'cartConfirmFormMobile ') + roboto.variable}
          disableSwipeToOpen
        >
          {typePay?.id === 'cash' ?
            <div className="container">

              <div className="confirmHeaderBlock">

                {/* { openPayForm === false ? false :
                  <Script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" />
                } */}

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

                <CartConfirmMap
                  open={openConfirmForm}
                  checkNewOrder={checkNewOrder}
                />

                <div className="cofirmDivider" />

              </div>

              <div className="confirmScroll">

                <div className={'cofirmTable'}>
                  {checkNewOrder?.items?.map((item, key) => (
                    <div key={key}>
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                      <span>{new Intl.NumberFormat('ru-RU').format(item.price)}{' '}₽</span>
                    </div>
                  ))}
                </div>

              </div>

              <div className="confirmFooter">

                <div className="cofirmDivider" />

                {typeOrder == 'pic' ? null : (
                  <div className="confirmDelivery">
                    <span>Доставка:</span>
                    <span>{new Intl.NumberFormat('ru-RU').format(NewSummDiv)} ₽</span>
                  </div>
                )}

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

                {/* <div className="ContainerCart" style={{width: '100%'}}>
                  <div className="Line"></div>
                  <div id="payment-form" />
                </div> */}

                {/* { typePay?.id == 'sbp' ? 
                  <iframe
                    src={linkPaySBP}
                    width='100%'
                    height={900}
                    style={{marginTop: 20}}
                    loading="lazy"
                  ></iframe>
                    :
                  false
                } */}

                {/* { typePay?.id == 'online' || typePay?.id == 'sbp' ? false : */}
                  <button className="confirmBTN" onClick={ () => create_order() }>Заказать</button>
                {/* } */}
              </div>

            </div>
          :

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

              <CartConfirmMap
                open={openConfirmForm}
                checkNewOrder={checkNewOrder}
              />

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

              <div className="cofirmDivider" />

              {typeOrder == 'pic' ? null : (
                <div className="confirmDelivery">
                  <span>Доставка:</span>
                  <span>{new Intl.NumberFormat('ru-RU').format(NewSummDiv)} ₽</span>
                </div>
              )}

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

              {/* { typePay?.id == 'online' || typePay?.id == 'sbp' ? false :
                <button className="confirmBTN" onClick={ () => create_order() }>Заказать</button>
              } */}

            </div>
          }

        </SwipeableDrawer>
      ) : (
        typePay?.id === 'cash' ?
          <Dialog
            onClose={() => setConfirmForm(false)}
            className={'cartConfirmFormPC_cash ' + roboto.variable}
            open={openConfirmForm}
            slots={Backdrop}
            slotProps={{ timeout: 500 }}
          >
            <DialogContent>
              <IconButton className="closeButton" onClick={() => setConfirmForm(false)}>
                <IconClose />
              </IconButton>

              {/* 
              { openPayForm === false ? false :
                <Script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" />
              } */}

              <div className="confirmHeaderBlock">

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

                <CartConfirmMap
                  open={openConfirmForm}
                  checkNewOrder={checkNewOrder}
                />

                <div className="cofirmDivider" />

              </div>

              <div className="confirmScroll">

                <div className={'cofirmTable'}>
                  {checkNewOrder?.items?.map((item, key) => (
                    <div key={key}>
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                      <span>{new Intl.NumberFormat('ru-RU').format(item.price)}{' '}₽</span>
                    </div>
                  ))}
                </div>

              </div>

              <div className="confirmFooter">

                <div className="cofirmDivider" />

                {typeOrder == 'pic' ? null : (
                  <div className="confirmDelivery">
                    <span>Доставка:</span>
                    <span>{new Intl.NumberFormat('ru-RU').format(NewSummDiv)} ₽</span>
                  </div>
                )}

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

                {/* <div className="ContainerCart" style={{width: '100%'}}>
                  <div className="Line"></div>
                  <div id="payment-form" />
                </div> */}

                {/* { typePay?.id == 'sbp' ? 
                  <iframe
                    src={linkPaySBP}
                    width='100%'
                    height={900}
                    style={{marginTop: 20}}
                    loading="lazy"
                  ></iframe>
                    :
                  false
                } */}

                {/* { typePay?.id == 'online' || typePay?.id == 'sbp' ? false : */}
                  <button className="confirmBTN" onClick={ () => create_order() }>Заказать</button>
                {/* } */}

              </div>

            </DialogContent>
          </Dialog>
          :
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

              <CartConfirmMap
                open={openConfirmForm}
                checkNewOrder={checkNewOrder}
              />

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

              <div className="cofirmDivider" />

              {typeOrder == 'pic' ? null : (
                <div className="confirmDelivery">
                  <span>Доставка:</span>
                  <span>{new Intl.NumberFormat('ru-RU').format(NewSummDiv)} ₽</span>
                </div>
              )}

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

              {/* { typePay?.id == 'online' || typePay?.id == 'sbp' ? false :
                <button className="confirmBTN" onClick={ () => create_order() }>Заказать</button>
              } */}

            </DialogContent>
          </Dialog>
        
      )}
    </>
  );
}
