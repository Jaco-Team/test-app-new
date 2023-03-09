import React, { useEffect, useState } from 'react';

import Image from 'next/image';



import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';



import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';


import { useHomeStore } from '../../components/store.js';
import { shallow } from 'zustand/shallow'

export default React.memo(function CardItem(props){

  const item = props.data;

  const desc = item.marc_desc.length > 0 ? item.marc_desc : item.tmp_desc;

  let width = 0;
  let GRID = 0;

  if (typeof window !== 'undefined') {
    width = window.innerWidth;
  }else{
    width = 1280;
  }

  GRID = (width- 7*20) / 6;

  const widthCardInfo = parseInt( item.cat_id ) == 4 ? 230 : parseInt( item.cat_id ) == 5 || parseInt( item.cat_id ) == 6 || parseInt( item.cat_id ) == 7 || parseInt( item.cat_id ) == 15 ? 75 : 135;

  return (
    <Grid item className='_PC_ CardItem' xs={12} sm={6} md={4} lg={3} xl={3} sx={{ display: { xs: 'none', sm: 'flex' } }} style={{ padding: '30px 16px', width: '100%' }}>
    
      <Image alt={item.name} src={"https://cdnimg.jacofood.ru/"+item.img_app+"_1420x1420.jpg"} width={1420} height={1420} priority={true} />

      <Typography className="CardNameItem" variant="h5" component="h3" style={{ flex: 1 }}>{item.name}</Typography>

      <div style={{ width: widthCardInfo, height: 34, border: '1px solid #dadada', borderRadius: 15, display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10, marginLeft: "calc( calc(100% - "+widthCardInfo+"px) / 2)" }}>
        { parseInt( item.cat_id ) != 4 ? null :
          <span className='TEST123' style={{ height: 34, borderRight: '1px solid #dadada', flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.count_part_new}</span>
        }

        { parseInt( item.cat_id ) == 5 || parseInt( item.cat_id ) == 6 || parseInt( item.cat_id ) == 7 || parseInt( item.cat_id ) == 15 ? null :
          <span className='TEST123' style={{ height: 34, borderRight: '1px solid #dadada', flex: parseInt( item.cat_id ) == 4 ? 2 : 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ parseInt( item.cat_id ) == 14 ? item.size_pizza : item.count_part } { parseInt( item.cat_id ) == 14 ? 'см' : parseInt( item.cat_id ) == 6 ? 'л' : 'шт.'} </span>
        }
        
        <span className='TEST123' style={{ height: 34, flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ new Intl.NumberFormat('ru-RU').format(item.weight) } { parseInt( item.id ) == 17 || parseInt( item.id ) == 237 ? 'шт.' : parseInt( item.cat_id ) == 6 ? 'л' : 'г' }</span>
      </div>
      
      <div style={{ height: 120, width: '100%', marginBottom: 10, textAlign: 'center', overflow: 'hidden' }}>
        <Typography component="span" className='hidddenText5'>{desc}</Typography>
      </div>

    </Grid>
  )
})