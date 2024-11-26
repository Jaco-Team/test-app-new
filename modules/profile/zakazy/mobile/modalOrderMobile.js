import React, { useState, useEffect } from 'react';
import { useProfileStore, useCartStore, useHeaderStoreNew, useCitiesStore } from '@/components/store';

import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { roboto } from '@/ui/Font.js';

import { CartModalOrderIcon, CookModalOrderIcon, DeliveryModalOrderIcon, HomeModalOrderIcon, PicupModalOrderIcon,
  MyAddrLocationIcon, StoreOrderMobileModal, SharpIcon, CalendarIcon, AddrDotsModalOrderIcon, EyeShow_modalOrder, EyeHide_modalOrder } from '@/ui/Icons.js';

function ModalOrderStatusIconDelivery({ types }) {
  return (
    <div className="zakazySvgGroup" style={{ width: '78.632478632479vw' }}>
      <div className="zakazyCircle"
        style={{ background: parseInt(types?.type1) == 1 || parseInt(types?.type1) == 0 ? '#DD1A32' : 'rgba(0, 0, 0, 0.20)' }}
      >
        <CartModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type2) == 1 || parseInt(types?.type2) == -1 ? (
        <LinearProgress variant="determinate" style={{ background: parseInt(types?.type2) == -1 ? '' : '#DD1A32' }} value={parseInt(types?.type2) == 1 ? 100 : 0}/>
      ) : (
        <LinearProgress />
      )}

      <div className="zakazyCircle"
        style={{ background: parseInt(types?.type2) == 1 || parseInt(types?.type2) == 0 ? '#DD1A32' : 'rgba(0, 0, 0, 0.20)' }}>
        <CookModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type3) == 1 || parseInt(types?.type3) == -1 ? (
        <LinearProgress
          variant="determinate"
          style={{ background: parseInt(types?.type3) == -1 ? 'rgba(0, 0, 0, 0.20)' : '#DD1A32' }}
          value={parseInt(types?.type3) == 1 ? 100 : 0}
        />
      ) : (
        <LinearProgress />
      )}

      <div className="zakazyCircle"
        style={{ background: parseInt(types?.type3) == 1 || parseInt(types?.type3) == 0 ? '#DD1A32' : 'rgba(0, 0, 0, 0.20)' }}>
        <DeliveryModalOrderIcon fill={'#fff'} />
      </div>

      {parseInt(types?.type4) == 1 || parseInt(types?.type4) == -1 ? (
        <LinearProgress
          variant="determinate"
          style={{ background: parseInt(types?.type4) == -1 ? 'rgba(0, 0, 0, 0.20)' : '#DD1A32' }}
          value={parseInt(types?.type4) == 1 ? 100 : 0}
        />
      ) : (
        <LinearProgress />
      )}

      <div className="zakazyCircle"
        style={{ background: parseInt(types?.type4) == 1 || parseInt(types?.type4) == 0 ? '#DD1A32' : 'rgba(0, 0, 0, 0.20)' }}>
        <HomeModalOrderIcon fill={'#fff'} />
      </div>
    </div>
  );
}

function ModalOrderStatusIconPicup({ types }) {
  return (
    <div className="zakazySvgGroup" style={{ width: '56.837606837607vw' }}>
      <div className="zakazyCircle"
        style={{ background: parseInt(types?.type1) == 1 || parseInt(types?.type1) == 0 ? '#DD1A32' : 'rgba(0, 0, 0, 0.20)' }}
      >
        <CartModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type2) == 1 || parseInt(types?.type2) == -1 ? (
        <LinearProgress variant="determinate" style={{ background: parseInt(types?.type2) == -1 ? '' : '#DD1A32' }} value={parseInt(types?.type2) == 1 ? 100 : 0} />
      ) : (
        <LinearProgress />
      )}

      <div className="zakazyCircle"
        style={{ background: parseInt(types?.type2) == 1 || parseInt(types?.type2) == 0 ? '#DD1A32' : 'rgba(0, 0, 0, 0.20)' }}>
        <CookModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type3) == 1 || parseInt(types?.type3) == -1 ? (
        <LinearProgress variant="determinate"
          style={{ background: parseInt(types?.type3) == -1 ? 'rgba(0, 0, 0, 0.20)' : '#DD1A32' }}
          value={parseInt(types?.type3) == 1 ? 100 : 0}
        />
      ) : (
        <LinearProgress />
      )}

      <div className="zakazyCircle"
        style={{ background: parseInt(types?.type3) == 1 || parseInt(types?.type3) == 0 ? '#DD1A32' : 'rgba(0, 0, 0, 0.20)' }}>
        <PicupModalOrderIcon fill={'#fff'} />
      </div>
    </div>
  );
}

export default React.memo(function ModalOrderMobile() {
  const [isShowAddr, setShowAddr] = useState(false);
  const [ showTimeWarn, setShowTimeWarn ] = useState(false);

  const [openModal, closeOrder, modalOrder, openModalDel, getOrder] = useProfileStore((state) => [state.openModal, state.closeOrder, state.modalOrder, state.openModalDel, state.getOrder]);

  const [ repeatOrder ] = useCartStore( state => [ state.repeatOrder ])

  const [ token ] = useHeaderStoreNew( state => [ state.token ] )
  const [ thisCity ] = useCitiesStore( state => [ state.thisCity ] )

  let text_status = '';

  if( parseInt(modalOrder?.order?.is_delete) == 1 ){
    text_status = `Отменили в ${modalOrder?.order?.del_date_time}`;
  }else{
    if( parseInt(modalOrder?.order?.type_order_) == 1 ){
      if( parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 5 ){
        if( parseInt(modalOrder?.order?.is_preorder) == 1 ){
          text_status = `Доставим ${modalOrder?.order?.max_time_order}`;
        }else{
          text_status = `Доставим до ${modalOrder?.order?.max_time_order}`;
        }
      }else{
        text_status = `Доставили в ${modalOrder?.order?.close_date_time}`;
      }
    }else{
      if( parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 3 ){
        if( parseInt(modalOrder?.order?.is_preorder) == 1 ){
          text_status = `Будет готов ${modalOrder?.order?.max_time_order}`;
        }else{
          text_status = `Будет готов до ${modalOrder?.order?.max_time_order}`;
        }
      }else{
        if( parseInt(modalOrder?.order?.status_order) == 4 ){
          text_status = 'Ждёт в кафе, можно забирать';
        }else{
          text_status = `Отдали в ${modalOrder?.order?.close_date_time}`;
        }
      }
    }
  }

  useEffect( () => {
    if( openModal == true ){
      const timer = setInterval(() => {
        if( token && token?.length > 0 ) {
          getOrder('zakazy', thisCity, token, modalOrder?.order?.order_id, modalOrder?.order?.point_id)
        }
      }, 30 * 1000);
      
      return () => clearInterval(timer);
    }
  }, [openModal] )

  useEffect( () => {
    if( modalOrder ){
      if( parseInt(modalOrder?.order?.type_order_) == 2 && modalOrder?.order?.max_time_order_time && modalOrder?.order?.max_time_order_time.length > 3 ){
        let max_time_order = modalOrder?.order?.max_time_order_time.split(':');

        if( parseInt(max_time_order[0]) >= 21 && parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 5 && parseInt(modalOrder?.order?.is_delete) == 0 ){
          setShowTimeWarn( true )
        } 
      }
    }
  }, [modalOrder] )

  return (
      <SwipeableDrawer
        anchor={'bottom'}
        open={openModal}
        onClose={closeOrder}
        onOpen={() => {}}
        id="ZakazyModalOrder"
        className={roboto.variable}
        disableSwipeToOpen
      >
        <div className="ContainerZakazyModalOrder">
          <div className="Line" />

          <div className="zakazyLogin">
            <span>Заказ {modalOrder?.order?.this_status_order}</span>
          </div>

          <div className="zakazyTimeText">
            <span>{text_status}</span>
          </div>

          {parseInt(modalOrder?.order?.status_order) === 6 || parseInt(modalOrder?.order?.status_order) === 1 ? null : 
            parseInt(modalOrder?.order?.type_order_) === 1 ?
            <ModalOrderStatusIconDelivery types={modalOrder?.order?.types} />
            :
            <ModalOrderStatusIconPicup types={modalOrder?.order?.types} />
          }

          { showTimeWarn ?
            <div className='header_warning_time'>
              <span>
                Пожалуйста, заберите заказ в кафе до 22:00. В праздничные дни время получения заказа может быть увеличено до 22:30. Обращайте внимание на время, указанное после оформления заказа. Спасибо!
              </span>
            </div>
              :
            false
          }

          <div className="zakazyDivider" />

          <div className="zakazy_dop_1">
            <SharpIcon />
            <span>{modalOrder?.order?.order_id}</span>
            <CalendarIcon />
            <span>{modalOrder?.order?.date_time_order_new}</span>
          </div>

          <div className="zakazy_dop_2">

            {parseInt(modalOrder?.order?.type_order_) === 1 ? <MyAddrLocationIcon /> : <StoreOrderMobileModal />}

            {parseInt(modalOrder?.order?.type_order_) === 1 ? (
               <>
                {isShowAddr ?
                  <span>
                    {modalOrder?.order?.city_name},{' '}
                    {modalOrder?.order?.street + ', ' + modalOrder?.order?.home + ', кв. ' + modalOrder?.order?.kv}
                  </span>
                   :
                  <div className='divGroup'>
                    <span>{modalOrder?.order?.city_name}</span>
                    <AddrDotsModalOrderIcon className="svgGroup" />
                  </div>
                }
                {isShowAddr ?
                  <EyeShow_modalOrder className="svgEye" onClick={ () => {setShowAddr(false)} } />
                    :
                  <EyeHide_modalOrder className="svgEye" onClick={ () => {setShowAddr(true)} } />
                }
              </>
            ) : 
              <div style={{ maxWidth: '68.376068376068vw' }}>
                <span>{modalOrder?.order?.city_name},{' '}</span>
                {/* адрес точки надо указать */}
                <span>{ modalOrder?.order?.point_name }</span>
              </div>
            }
            
          </div>

          <div className="zakazyDivider" style={{ marginBottom: '6.3247863247863vw' }}/>

          <div className="zakazySum">
            <span>Состав заказа и стоимость:</span>
            <span>{new Intl.NumberFormat('ru-RU').format(modalOrder?.order?.sum_order)}{' '}₽</span>
          </div>

          {modalOrder?.order_items?.map((order, key) => (
            <div key={key} className="zakazyOrder"
              style={{ marginBottom: order === modalOrder?.order_items?.at(-1) && parseInt(modalOrder?.order?.type_order_) !== 1 ? '8.5470085470085vw' : null,
                height: order?.name?.length > 29 ? '11.111111111111vw' : '6.8376068376068vw' }}>
              <span>{order.count}</span>
              <span>{order.name}</span>
              <span>{new Intl.NumberFormat('ru-RU').format(order.price)}{' '}₽</span>
            </div>
          ))}

          { parseInt(modalOrder?.order?.type_order_) == 1 ?
            <div 
              className="zakazyOrder"
              style={{ 
                marginBottom: '8.5470085470085vw',
                height: '6.8376068376068vw' 
              }}
            >
              <span>1</span>
              <span>Доставка</span>
              <span>{new Intl.NumberFormat('ru-RU').format(modalOrder?.order?.sum_div)}{' '}₽</span>
            </div>
              :
            false
          }

          { parseInt(modalOrder?.order?.is_delete) == 0 && parseInt(modalOrder?.order?.status_order) != 6 ? (
            <Button className="zakazyBTN" variant="outlined" onClick={openModalDel}>
              <span>Отменить заказ</span>
            </Button>
          ) : (
            <Button className="zakazyRepeat" variant="contained"
              onClick={ () => repeatOrder(modalOrder) }
            >
              <span>Повторить заказ</span>
            </Button>
          )}
        </div>
      </SwipeableDrawer>
  );
})
