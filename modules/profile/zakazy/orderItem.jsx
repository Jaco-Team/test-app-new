import React from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { ReloadIcon, CheckIcon, CloseIcon } from '@/../ui/Icons.js';

function areEqual(prevProps, nextProps) {
  return parseInt(nextProps.order.is_delete) === parseInt(prevProps.order.is_delete) || parseInt(nextProps.order.type_status) === parseInt(prevProps.order.type_status);
}

export default React.memo(function OrderItem({order}){
  return (
    <TableRow>
      <TableCell> 
        <div>
          { parseInt(order.is_delete) == 1 ? <CloseIcon /> : parseInt(order.type_status) == 5 ? <CheckIcon /> : <ReloadIcon /> }  {order.status_order}
        </div>
      </TableCell>
      <TableCell>{order.order_id}</TableCell>
      <TableCell>{order.date}</TableCell>
      <TableCell>{order.time}</TableCell>
      <TableCell>
        { new Intl.NumberFormat('ru-RU').format(order.sum)} ₽
      </TableCell>
      <TableCell>
        <span>Открыть</span>
      </TableCell>
    </TableRow> 
  )
}, areEqual)