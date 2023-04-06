import React, { useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { ReloadIcon, CheckIcon, CloseIcon, IconRuble } from '../../../ui/Icons.js';

import ProfileBreadcrumbs from '../profileBreadcrumbs.jsx';
import PromoCard from './orderItem.jsx';

import Meta from '@/components/meta.js';

import { useProfileStore } from '@/components/store.js';

export default function ContactsPage(props){

  const { page, this_module, city } = props;

  const [ getOrderList, orderList ] = useProfileStore( state => [ state.getOrderList, state.orderList ] );

  useEffect(() => {
    getOrderList(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');
  }, []);

  return (
    <Meta title={page.title} description={''}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item className="Zakazy mainContainer">
          
          <Grid item xs={12}>
            <Typography variant="h5" component="h1">История заказов</Typography>
          </Grid>

          <Grid item xs={12}>
            
            { orderList.map( (year, ykey) =>
              <Accordion key={ykey} defaultExpanded={ ykey == 0 ? true : false }>
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
                        <TableRow key={key} >
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
                      )}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            ) }

          </Grid>

        </Grid>
        <ProfileBreadcrumbs />
      </Grid>
    </Meta>
  )
}