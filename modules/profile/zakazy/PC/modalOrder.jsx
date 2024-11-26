import React, { useState, useEffect } from 'react';

import { useProfileStore, useCartStore, useHeaderStoreNew, useCitiesStore } from '@/components/store';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { IconClose, SharpIcon, CalendarIcon, MyAddrLocationIcon, EyeHide_modalOrder, EyeShow_modalOrder, CartModalOrderIcon, CookModalOrderIcon, DeliveryModalOrderIcon, HomeModalOrderIcon, AddrDotsModalOrderIcon, PicupModalOrderIcon } from '@/ui/Icons';
import LinearProgress from '@mui/material/LinearProgress';

import { roboto } from '@/ui/Font';

function ModalOrderStatusIconDelivery({types}){
  return (
    <Grid item xs={12} className='header_status_icon'>
      <div className={ parseInt(types?.type1) == 1 || parseInt(types?.type1) == 0 ? 'active' : '' }>
        <CartModalOrderIcon fill={'#fff'} />
      </div>
      { parseInt(types?.type2) == 1 || parseInt(types?.type2) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type2) == -1 ? '' : 'active'} value={ parseInt(types?.type2) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }

      <div className={ parseInt(types?.type2) == 1 || parseInt(types?.type2) == 0 ? 'active' : '' }>
        <CookModalOrderIcon fill={'#fff'} />
      </div>
      { parseInt(types?.type3) == 1 || parseInt(types?.type3) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type3) == -1 ? '' : 'active'} value={ parseInt(types?.type3) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }
      
      <div className={ parseInt(types?.type3) == 1 || parseInt(types?.type3) == 0 ? 'active' : '' }>
        <DeliveryModalOrderIcon fill={'#fff'} />
      </div>
      { parseInt(types?.type4) == 1 || parseInt(types?.type4) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type4) == -1 ? '' : 'active'} value={ parseInt(types?.type4) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }
      <div className={ parseInt(types?.type4) == 1 || parseInt(types?.type4) == 0 ? 'active' : '' }>
        <HomeModalOrderIcon fill={'#fff'} />
      </div>
    </Grid>
  )
}

function ModalOrderStatusIconPicup({types}){
  return (
    <Grid item xs={12} className='header_status_icon'>
      <div className={ parseInt(types?.type1) == 1 || parseInt(types?.type1) == 0 ? 'active' : '' }>
        <CartModalOrderIcon fill={'#fff'} />
      </div>
      { parseInt(types?.type2) == 1 || parseInt(types?.type2) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type2) == -1 ? '' : 'active'} value={ parseInt(types?.type2) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }

      <div className={ parseInt(types?.type2) == 1 || parseInt(types?.type2) == 0 ? 'active' : '' }>
        <CookModalOrderIcon fill={'#fff'} />
      </div>
      { parseInt(types?.type3) == 1 || parseInt(types?.type3) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type3) == -1 ? '' : 'active'} value={ parseInt(types?.type3) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }
      
      <div className={ parseInt(types?.type3) == 1 || parseInt(types?.type3) == 0 ? 'active' : '' }>
        <PicupModalOrderIcon fill={'#fff'} />
      </div>
      { parseInt(types?.type4) == 1 || parseInt(types?.type4) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type4) == -1 ? '' : 'active'} value={ parseInt(types?.type4) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }
      <div className={ parseInt(types?.type4) == 1 || parseInt(types?.type4) == 0 ? 'active' : '' }>
        <HomeModalOrderIcon fill={'#fff'} />
      </div>
    </Grid>
  )
}

export default React.memo(function ModalOrder() {
  const [modalOrder, openModal, closeOrder, openModalDel, getOrder] = useProfileStore( state => [ state.modalOrder, state.openModal, state.closeOrder, state.openModalDel, state.getOrder ])

  const [ repeatOrder ] = useCartStore( state => [ state.repeatOrder ])

  const [ isShowAddr, setShowAddr ] = useState(true);
  const [ showTimeWarn, setShowTimeWarn ] = useState(false);

  const [ token ] = useHeaderStoreNew( state => [ state.token ] )
  const [ thisCity ] = useCitiesStore( state => [ state.thisCity ] )

  let order_status = '';

  if( parseInt(modalOrder?.order?.is_delete) == 1 ){
    order_status = `Отменили в ${modalOrder?.order?.del_date_time}`;
  }else{
    if( parseInt(modalOrder?.order?.type_order_) == 1 ){
      if( parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 5 ){
        if( parseInt(modalOrder?.order?.is_preorder) == 1 ){
          order_status = `Доставим ${modalOrder?.order?.max_time_order}`;
        }else{
          order_status = `Доставим до ${modalOrder?.order?.max_time_order}`;
        }
      }else{
        order_status = `Доставили в ${modalOrder?.order?.close_date_time}`;
      }
    }else{
      if( parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 3 ){
        if( parseInt(modalOrder?.order?.is_preorder) == 1 ){
          order_status = `Будет готов ${modalOrder?.order?.max_time_order}`;
        }else{
          order_status = `Будет готов до ${modalOrder?.order?.max_time_order}`;
        }
      }else{
        if( parseInt(modalOrder?.order?.status_order) == 4 ){
          order_status = 'Ждёт в кафе, можно забирать';
        }else{
          order_status = `Отдали в ${modalOrder?.order?.close_date_time}`;
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
    <Dialog
      onClose={ () => closeOrder() }
      className={'modalOrderPC ' + roboto.variable}
      open={openModal}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      scroll="body"
    >
      <DialogContent style={{ padding: 0, borderRadius: '1.444045vw', overflow: 'hidden'}}>
        <div className="container">

          <IconButton className="closeButton" onClick={closeOrder}>
            <IconClose />
          </IconButton>

          <Grid container>
            <Grid item xs={12} className='header_status'>
              <Typography variant="h5" component="h1">Заказ {modalOrder?.order?.this_status_order}</Typography>
            </Grid>
            <Grid item xs={12} className='header_time'>
              <Typography variant="h5" component="span">{order_status}</Typography>
            </Grid>

            { parseInt(modalOrder?.order?.type_order_) == 1 ?
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

            <Grid item xs={12} className='header_addr_table'>
              <div >
                <SharpIcon /> 
                <span className='order_num'>{modalOrder?.order?.order_id}</span>
                <CalendarIcon />
                <span>{modalOrder?.order?.date_time_order_new}</span>
              </div>
              <div>
                <div>
                  <div>
                    <MyAddrLocationIcon />
                  </div>
                  
                  <div className='order_city'>
                    {isShowAddr ?
                      <span>
                        {modalOrder?.order?.city_name + ', '}
                        { parseInt(modalOrder?.order?.type_order_) == 1 ? modalOrder?.order?.street + ', ' + modalOrder?.order?.home + ', кв. ' + modalOrder?.order?.kv : modalOrder?.order?.point_name }
                      </span>
                        :
                      <span>
                        {modalOrder?.order?.city_name + ' '} 
                        <AddrDotsModalOrderIcon className="long" />
                      </span>
                    }
                  </div>
                </div>

                <div>
                  {isShowAddr ?
                    <EyeShow_modalOrder onClick={ () => {setShowAddr(false)} } />
                      :
                    <EyeHide_modalOrder onClick={ () => {setShowAddr(true)} } />
                  }
                </div>
              </div>
            </Grid>

            <Grid item xs={12} className='header_cart_table'>
              <div className='table_header'>
                <span>Состав и стоимость заказа:</span>
                <span>{new Intl.NumberFormat('ru-RU').format(modalOrder?.order?.sum_order)}{' '}₽</span>
              </div>

              {modalOrder?.order_items?.map( (item, key) =>
                <div key={key}>
                  <div>
                    <span>{item.count}</span>
                    <span>{item.name}</span>
                  </div>
                  <span>{new Intl.NumberFormat('ru-RU').format(item.price)}{' '}₽</span>
                </div>
              )}

              { parseInt(modalOrder?.order?.type_order_) == 1 ?
                <div>
                  <div>
                    <span>1</span>
                    <span>Доставка</span>
                  </div>
                  <span>{new Intl.NumberFormat('ru-RU').format(modalOrder?.order?.sum_div)}{' '}₽</span>
                </div>
                  :
                false
              }

            </Grid>

            <Grid item xs={12} className='header_btn'>
              { parseInt(modalOrder?.order?.status_order) > 0 && parseInt(modalOrder?.order?.status_order) < 6 && parseInt(modalOrder?.order?.is_delete) == 0 ? 
                <div onClick={ () => openModalDel() }>
                  <span>Отменить заказ</span>
                </div>
                  :
                <div onClick={ () => repeatOrder(modalOrder) }>
                  <span>Повторить заказ</span>
                </div>
              }
            </Grid>

          </Grid>
        </div>
      </DialogContent>
    </Dialog>
  );
})
