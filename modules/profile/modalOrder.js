import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { IconRuble } from '@/ui/Icons.js';
import CloseIcon from '@mui/icons-material/Close';
import { roboto } from '@/ui/Font.js'

import { useProfileStore } from '@/components/store.js';

export default function ModalOrder(){

  const { modalOrder, openModal, closeOrder } = useProfileStore( state => state );

  const [ showOrder, setShowOrder ] = useState({});
  const [ isOpenModal, setIsOpenModal ] = useState(false);

  useEffect(() => {
    setShowOrder(modalOrder);
    setIsOpenModal(openModal);

    console.log( 'load modalOrder', modalOrder )
  }, [modalOrder, openModal]);

  function closeDialog(){
    closeOrder();
  }

  return (
    
    <Dialog 
      onClose={ () => closeDialog() } 
      className={"showOrderDialog "+roboto.variable}
      open={isOpenModal}
      fullWidth={true}
    >
      { !isOpenModal ? null :
        <DialogTitle style={{ margin: 0, padding: 8 }}>
          <Typography variant="h6" component="h6">Заказ {showOrder?.order.order_id}</Typography>
        
          <IconButton aria-label="close" style={{ position: 'absolute', top: 0, right: 0, color: '#000' }} onClick={ () => closeDialog() }>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      }
      
      { !isOpenModal ? null :
        <DialogContent className="showOrderDialogContent">
          <Typography variant="h6" component="span">{showOrder?.order.type_order}: {showOrder?.order.type_order_addr_new}</Typography>
          <Typography variant="h6" component="span">{showOrder?.order.time_order_name}: {showOrder?.order.time_order}</Typography>
          <Typography variant="h6" component="span">Статус заказа: {showOrder?.order.this_status_order}</Typography>
          { parseInt(showOrder?.order.is_preorder) == 1 ? null :
            <Typography variant="h6" component="span">{showOrder?.order.text_time}{showOrder?.order.time_to_client}</Typography>
          }
          { showOrder?.order.promo_name == null || showOrder?.order.promo_name.length == 0 ? null :
            <Typography variant="h6" component="span">Промокод: {showOrder?.order.promo_name}</Typography>
          }
          { showOrder?.order.promo_name == null || showOrder?.order.promo_name.length == 0 ? null :
            <Typography variant="h6" component="span" className="noSpace">{showOrder?.order.promo_text}</Typography>
          }
          { showOrder?.order.sdacha == null || showOrder?.order.sdacha.length == 0 || showOrder?.order.sdacha == 0 ? null :
            <Typography variant="h6" component="span">Сдача с: {showOrder?.order.sdacha}</Typography>
          }
          <Typography variant="h5" component="span" className="CardPriceItem">Сумма закза: {showOrder?.order.sum_order}<IconRuble style={{ width: 12, height: 12, fill: '#525252', marginBottom: -1 }} /></Typography>
            
          <Table className="tableOrderCheck" size='small'>
            <TableBody>
              {showOrder?.order_items.map((item, key) =>
                <TableRow key={key}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.count}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </DialogContent>
      }
      
      { isOpenModal && parseInt( showOrder?.order.is_delete ) == 0 && parseInt( showOrder?.order.status_order ) !== 6 ? 
        <DialogActions style={{ justifyContent: 'flex-end', padding: '15px 0px' }}>
          <ButtonGroup disableElevation={true} disableRipple={true} variant="contained" className="BtnBorderOther" style={{ marginRight: 24 }}>
            <Button variant="contained" className="BtnCardMain CardInCardItem" /*onClick={ this.closeOrder.bind(this, showOrder?.order.order_id, showOrder?.order.point_id) }*/>Отменить заказ</Button>
          </ButtonGroup>
        </DialogActions>
          :
        null
      }
      { isOpenModal && (parseInt( showOrder?.order.is_delete ) == 1 || parseInt( showOrder?.order.status_order ) == 6) ? 
        <DialogActions style={{ justifyContent: 'flex-end', padding: '15px 0px' }}>
          <ButtonGroup disableElevation={true} disableRipple={true} variant="contained" className="BtnBorderOther" style={{ marginRight: 24 }}>
            <Button variant="contained" className="BtnCardMain CardInCardItem" /*onClick={ this.repeatOrder.bind(this, showOrder?.order.order_id, showOrder?.order.point_id) }*/ >Повторить заказ</Button>
          </ButtonGroup>
        </DialogActions>
          :
        null
      }
    </Dialog>
  )
}