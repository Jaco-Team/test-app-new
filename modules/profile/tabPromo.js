import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useProfileStore } from '../../components/store.js';

export default function TabPromo(props){

  const {this_module, city} = props;
  
  const { getPromoList, promoList } = useProfileStore( state => state );
  
  const [ PromoList, setPromoList ] = useState([]);

  useEffect(() => {
    getPromoList(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');

    console.log( 'load getPromoList' )
  }, [getPromoList]);
  
  useEffect(() => {
    setPromoList(promoList);

    console.log( 'load promoList', promoList )
  }, [promoList]);

  //onClick={activePromo.bind(this, item.info, item.promo_name)}

  return (
    <>
      <Table sx={{ display: { xs: 'none', lg: 'inline-table' } }} className="TablePromoPc">
        <TableHead>
          <TableRow>
            <TableCell>Промокод</TableCell>
            <TableCell>Промокод дает:</TableCell>
            <TableCell>Действует до</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {PromoList.map((item, key) => 
            <TableRow key={key}>
              <TableCell>{item.promo_name}</TableCell>
              <TableCell>{item.promo_text}</TableCell>
              <TableCell>{item.date_end}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Table sx={{ display: { xs: 'inline-table', lg: 'none' } }} className="TablePromoMobile">
        <TableBody>
          {PromoList.map((item, key) => 
            <TableRow key={key}>
              <TableCell>
                <div>
                  <Typography variant="h5" component="span" className="PromoName">Промокод: </Typography>
                  <Typography variant="h5" component="span" className="PromoName">{item.promo_name}</Typography>
                </div>
                <div style={{ width: '100%', paddingTop: 10 }}>
                  <Typography variant="h5" component="span" className="PromoDate">Действует до: </Typography>
                  <Typography variant="h5" component="span" className="PromoDate">{item.date_end}</Typography>
                </div>
                <div style={{ width: '100%', paddingTop: 10, textAlign: 'justify' }}>
                  <Typography variant="h5" component="span" className="PromoText">Промокод дает: </Typography>
                  <Typography variant="h5" component="span" className="PromoText">{item.promo_text}</Typography>
                </div>
                <div style={{ width: '100%', paddingTop: 10 }}>
                  <Button variant="contained" style={{ width: '100%' }}>Применить промокод</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}