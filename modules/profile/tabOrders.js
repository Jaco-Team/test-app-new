import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';

import { IconRuble } from '../../ui/Icons.js';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { useProfileStore } from '../../components/store.js';

export default function TabPromo(props){

  const {this_module, city} = props;
  
  const { getOrderList, orderList, getOrder } = useProfileStore( state => state );
  
  const [ OrderList, setOrderList ] = useState([]);

  useEffect(() => {
    getOrderList(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');

    console.log( 'load getOrderList' )
  }, [getOrderList]);
  
  useEffect(() => {
    setOrderList(orderList);

    console.log( 'load promoList', orderList )
  }, [orderList]);

  //onClick={openOrder.bind(this, item.order_id, item.point_id)}

  function openOrder(order_id, point_id){
    //alert('openOrder')
    getOrder(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg', order_id, point_id)
  }

  return (
    <div className="TableOrders">
      <div className="thead">
        <Typography variant="h5" component="span" style={{ flex: 1 }}>№</Typography>
        <Typography variant="h5" component="span" style={{ flex: 3 }}>Дата</Typography>
        <Typography variant="h5" component="span" style={{ flex: 2 }}>Сумма</Typography>
        <Typography variant="h5" component="span" style={{ flex: 1 }}></Typography>
      </div>
      <div className="tbody">
        {OrderList.map((item, key) => 
          <div key={key} onClick={ () => openOrder(item.order_id, item.point_id) }>
            <div>
              <Typography variant="h5" component="span" style={{ flex: 1 }}>{item.order_id}</Typography>
              <Typography variant="h5" component="span" style={{ flex: 3 }}>{item.date_time_new}</Typography>
              <Typography variant="h5" component="span" className="CardPriceItem" style={{ flex: 2 }}>{item.sum} <IconRuble style={{ width: 13, height: 13, fill: '#525252', marginBottom: -1 }} /></Typography>
              <Typography variant="h5" component="span" style={{ flex: 1 }}>{parseInt(item.is_delete) == 1 ? <CloseIcon style={{ position: 'relative', top: 3 }} /> : parseInt(item.status_order) == 6 ? <CheckIcon style={{ position: 'relative', top: 3 }} /> : null}</Typography>
            </div>
              
            {(parseInt(item.status_order) == 6 || parseInt(item.is_delete) == 1) ? null :
              <div className="boxSteps">
                <div>
                  <div className={ parseInt(item.steps[0]['active']) == 0 || parseInt(item.steps[0]['active']) == 2 ? '' : 'active' }>
                    <Typography variant="h5" component="span">{item.steps[0]['name']}</Typography>
                  </div>
                  <div className={ parseInt(item.steps[1]['active']) == 0 || parseInt(item.steps[1]['active']) == 2 ? '' : 'active' }>
                    <Typography variant="h5" component="span">{item.steps[1]['name']}</Typography>
                  </div>
                  <div className={ parseInt(item.steps[2]['active']) == 0 || parseInt(item.steps[2]['active']) == 2 ? '' : 'active' }>
                    <Typography variant="h5" component="span">{item.steps[2]['name']}</Typography>
                  </div>
                  <div className={ parseInt(item.steps[3]['active']) == 0 || parseInt(item.steps[3]['active']) == 2 ? '' : 'active' }>
                    <Typography variant="h5" component="span">{item.steps[3]['name']}</Typography>                                                        
                  </div>
                </div>
                { item.time_to_client == 0 ? null :
                  <div>
                    <Typography variant="h5" component="span">Заказ { parseInt(item.type_order) == 1 ? 'привезут до: ' : 'будет готов до: ' }{item.time_to_client}</Typography>
                  </div>
                }
              </div> 
            }
          </div>
        )}
      </div>
    </div>
  )
}