import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import OrderItem from './orderItem.jsx';

import { useProfileStore } from '@/components/store';

export default function OrdersList({ token, this_module, city }){

  const [ getOrder, orderList] = useProfileStore( state => [ state.getOrder, state.orderList ])

  const template = {
    token: token,
    this_module: this_module,
    city: city
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>статус заказа</TableCell>
          <TableCell>номер</TableCell>
          <TableCell>дата</TableCell>
          <TableCell>время</TableCell>
          <TableCell>сумма</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orderList?.map( order =>
          <OrderItem key={order.order_id} order={order} template={template} getOrder={getOrder} />
        )}
      </TableBody>
    </Table>
  )
}
