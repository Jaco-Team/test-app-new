import { useState } from 'react';

import { shallow } from 'zustand/shallow';
import { useProfileStore } from '@/components/store';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { IconClose, SharpIcon, CalendarIcon, MyAddrLocationIcon, EyeHideNew, EyeShow, CartModalOrderIcon, CookModalOrderIcon, DeliveryModalOrderIcon, HomeModalOrderIcon, AddrDotsModalOrderIcon } from '@/ui/Icons';
import LinearProgress from '@mui/material/LinearProgress';

import { roboto } from '@/ui/Font';

function ModalOrderStatusIcon({types}){
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

export default function ModalOrder() {
  const [modalOrder, openModal, closeOrder, openModalDel] = useProfileStore( state => [ state.modalOrder, state.openModal, state.closeOrder, state.openModalDel ], shallow )

  const [ isShowAddr, setShowAddr ] = useState(true);

  return (
    <Dialog
      onClose={ () => closeOrder() }
      className={'modalOrderPC ' + roboto.variable}
      open={openModal}
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
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
              <Typography variant="h5" component="span">Доставим до {modalOrder?.order?.max_time_order}</Typography>
            </Grid>

            <ModalOrderStatusIcon types={modalOrder?.order?.types} />

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
                  
                  {isShowAddr ?
                    <span className='order_city'>{modalOrder?.order?.city_name}, { modalOrder?.order?.street + ', ' + modalOrder?.order?.home + ', кв. ' + modalOrder?.order?.kv }</span>
                      :
                    <span className='order_city'>{modalOrder?.order?.city_name} <AddrDotsModalOrderIcon className="long" /></span>
                  }
                </div>

                {isShowAddr ?
                  <EyeShow onClick={ () => {setShowAddr(false)} } />
                    :
                  <EyeHideNew onClick={ () => {setShowAddr(true)} } />
                }
              </div>
            </Grid>

            <Grid item xs={12} className='header_cart_table'>
              <div className='table_header'>
                <span>Состав и стоимость заказа:</span>
                <span>{modalOrder?.order?.sum_order} ₽</span>
              </div>

              {modalOrder?.order_items?.map( (item, key) =>
                <div key={key}>
                  <div>
                    <span>{item.count}</span>
                    <span>{item.name}</span>
                  </div>
                  <span>{item.price} ₽</span>
                </div>
              )}
            </Grid>

            <Grid item xs={12} className='header_btn'>
              { parseInt(modalOrder?.order?.status_order) > 0 && parseInt(modalOrder?.order?.status_order) < 6 && parseInt(modalOrder?.order?.is_delete) == 0 ? 
                <div onClick={ () => openModalDel() }>
                  <span>Отменить заказ</span>
                </div>
                  :
                <div onClick={ () => openModalDel() }>
                  <span>Повторить заказ</span>
                </div>
              }
            </Grid>

          </Grid>
        </div>
      </DialogContent>
    </Dialog>
  );
}
