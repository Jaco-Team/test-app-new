import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { IconRuble } from '@/ui/Icons.js';

import { useHomeStore } from '../../components/store.js';
import { shallow } from 'zustand/shallow'

export default React.memo(function CardItemMobile(props){

  const item = props.data;

  const desc = item.marc_desc.length > 0 ? item.marc_desc : item.tmp_desc;

  let width = 0;
  let GRID = 0;

  if (typeof window !== 'undefined') {
    width = window.innerWidth;
  }else{
    width = 320;
  }

  GRID = (width- 7*20) / 6;

  const [ count, setCount ] = useState(0);

  //console.log( 'render_item_mobile' )

  return (
    <Grid item container xs={12} className="CardItem_mobile">
      <Grid item>
        <Image alt={item.name} src={"https://cdnimg.jacofood.ru/"+item.img_app+"_1420x1420.jpg"} width={((GRID*3) + (2*20))} height={((GRID*3) + (2*20))} priority={true} />
      </Grid>
      <Grid item>
        <Typography className="CardNameItem_" variant="h5" component="h3">{item.name}</Typography>

        {  parseInt( item.cat_id ) == 4 ?
          <div className="CardBageCount">
            <Typography component="span">{item.count_part_new}</Typography>
            <Typography component="span">{item.count_part} шт.</Typography>
          </div>
            :
          null
        }

        <Typography className="CardInfoItem_" component="p">{desc}</Typography>
          
        { count == 0 ?
          <Button variant="outlined" className='ModalItemButtonCart' onClick={ () => { setCount( prev => prev + 1 ) } } style={{ marginBottom: 10 }}>
            <span>В корзину за { new Intl.NumberFormat('ru-RU').format(item.price)}</span>
            <IconRuble style={{ width: 11, height: 11, fill: '#525252', marginLeft: 3, paddingBottom: 1  }} />
          </Button>
            :
          <div variant="contained" className='ModalItemButtonCart OPEN' style={{ marginBottom: 10 }}>
            <span className='minus' onClick={ () => { setCount( prev => prev - 1 ) } }>–</span>
            <span>{count}</span>
            <span className='plus' onClick={ () => { setCount( prev => prev + 1 ) } }>+</span>
          </div>
        }
        
      </Grid>
      
  </Grid>
  )
})