import React from 'react';

import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import OrderItem from './orderItem.jsx';

import { useProfileStore } from '@/components/store';

export default React.memo(function OrdersList({year, is_first, token, this_module, city}){

  const [getOrder] = useProfileStore( state => [ state.getOrder ])

  const template = {
    token: token,
    this_module: this_module,
    city: city
  };

  return (
    <Accordion defaultExpanded={ is_first }>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={'blockTitle'}
      >
        <Typography component="span">{year.year}</Typography>
      </AccordionSummary>
      <AccordionDetails className={'blockTable'}>
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
            {year.orders.map( (order, key) =>
              <OrderItem key={key} order={order} template={template} getOrder={getOrder} />
            )}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion> 
  )
})
