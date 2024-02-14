import React, { useState } from 'react';

import { useProfileStore, useCartStore } from '@/components/store';

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
        <CartModalOrderIcon />
      </div>
      { parseInt(types?.type2) == 1 || parseInt(types?.type2) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type2) == -1 ? '' : 'active'} value={ parseInt(types?.type2) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }

      <div className={ parseInt(types?.type2) == 1 || parseInt(types?.type2) == 0 ? 'active' : '' }>
        <CookModalOrderIcon />
      </div>
      { parseInt(types?.type3) == 1 || parseInt(types?.type3) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type3) == -1 ? '' : 'active'} value={ parseInt(types?.type3) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }
      
      <div className={ parseInt(types?.type3) == 1 || parseInt(types?.type3) == 0 ? 'active' : '' }>
        <DeliveryModalOrderIcon />
      </div>
      { parseInt(types?.type4) == 1 || parseInt(types?.type4) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type4) == -1 ? '' : 'active'} value={ parseInt(types?.type4) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }
      <div className={ parseInt(types?.type4) == 1 || parseInt(types?.type4) == 0 ? 'active' : '' }>
        <HomeModalOrderIcon />
      </div>
    </Grid>
  )
}

function ModalOrderStatusIconPicup({types}){
  return (
    <Grid item xs={12} className='header_status_icon'>
      <div className={ parseInt(types?.type1) == 1 || parseInt(types?.type1) == 0 ? 'active' : '' }>
        <CartModalOrderIcon />
      </div>
      { parseInt(types?.type2) == 1 || parseInt(types?.type2) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type2) == -1 ? '' : 'active'} value={ parseInt(types?.type2) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }

      <div className={ parseInt(types?.type2) == 1 || parseInt(types?.type2) == 0 ? 'active' : '' }>
        <CookModalOrderIcon />
      </div>
      { parseInt(types?.type3) == 1 || parseInt(types?.type3) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type3) == -1 ? '' : 'active'} value={ parseInt(types?.type3) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }
      
      <div className={ parseInt(types?.type3) == 1 || parseInt(types?.type3) == 0 ? 'active' : '' }>
        <PicupModalOrderIcon />
      </div>
      { parseInt(types?.type4) == 1 || parseInt(types?.type4) == -1 ?
        <LinearProgress variant="determinate" className={parseInt(types?.type4) == -1 ? '' : 'active'} value={ parseInt(types?.type4) == 1 ? 100 : 0 } />
          :
        <LinearProgress />
      }
      <div className={ parseInt(types?.type4) == 1 || parseInt(types?.type4) == 0 ? 'active' : '' }>
        <HomeModalOrderIcon />
      </div>
    </Grid>
  )
}

export default React.memo(function ModalOrder() {
  const [modalOrder, openModal, closeOrder, openModalDel] = useProfileStore( state => [ state.modalOrder, state.openModal, state.closeOrder, state.openModalDel ])

  const [ repeatOrder ] = useCartStore( state => [ state.repeatOrder ])

  const [ isShowAddr, setShowAddr ] = useState(true);

  let order_status = '';

  if( parseInt(modalOrder?.order?.is_delete) == 1 ){
    order_status = `Отменили в ${modalOrder?.order?.del_date_time}`;
  }else{
    if( parseInt(modalOrder?.order?.type_order_) == 1 ){
      if( parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 5 ){
        order_status = `Доставим до ${modalOrder?.order?.max_time_order}`;
      }else{
        order_status = `Доставили в ${modalOrder?.order?.close_date_time}`;
      }
    }else{
      if( parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 3 ){
        order_status = `Будет готов до ${modalOrder?.order?.max_time_order}`;
      }else{
        if( parseInt(modalOrder?.order?.status_order) == 4 ){
          order_status = 'Ждёт в кафе, можно забирать';
        }else{
          order_status = `Отдали в ${modalOrder?.order?.close_date_time}`;
        }
      }
    }
  }

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
          <IconButton style={{position: 'absolute', left: '-3.3vw', paddingTop: '0', backgroundColor: 'transparent'}} onClick={closeOrder}>
            <IconClose style={{width: '2.1661vw', height: '2.1661vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)'}}/>
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