import { useState } from 'react';

import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { IconRuble } from '@/ui/Icons.js';

import { useHomeStore, useCitiesStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow'

export default function CardItem(props){

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

  const [ count, setCount ] = useState(0);

  const [ getItem ] = useHomeStore( state => [ state.getItem ], shallow );
  const [ thisCity ] = useCitiesStore( state => [ state.thisCity ], shallow );

  return (
    <Grid item className='_PC_ CardItem' xs={12} sm={6} md={4} lg={3} xl={3} sx={{ display: { xs: 'none', sm: 'flex' } }} style={{ padding: '30px 16px', width: '100%',  backgroundColor: count > 0 ? '#f2f2f2' : '#ffff' }}>

      <Image alt={item.name} src={"https://cdnimg.jacofood.ru/"+item.img_app+"_1420x1420.jpg"} width={1420} height={1420} priority={true} onClick={ () => getItem('home', thisCity, item.id) }/>

      <Typography className="CardNameItem" variant="h5" component="h3" style={{ flex: 1 }}>{item.name}</Typography>

      <div style={{ width: widthCardInfo, height: 20, display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10, marginLeft: "calc( calc(100% - "+widthCardInfo+"px) / 2)" }}>

        {parseInt( item.cat_id ) != 4 ? null :
          <span className='TEST123' style={{ height: 20, borderRight: '1px solid #dadada', flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.count_part_new}</span>
        }

        {parseInt( item.cat_id ) == 5 || parseInt( item.cat_id ) == 6 || parseInt( item.cat_id ) == 7 || parseInt( item.cat_id ) == 15 ? null :
          <span className='TEST123' style={{ height: 20, borderRight: '1px solid #dadada', flex: parseInt( item.cat_id ) == 4 ? 2 : 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ parseInt( item.cat_id ) == 14 ? item.size_pizza : item.count_part } { parseInt( item.cat_id ) == 14 ? 'см' : parseInt( item.cat_id ) == 6 ? 'л' : 'шт.'} </span>
        }
        
        <span className='TEST123' style={{ height: 20, flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ new Intl.NumberFormat('ru-RU').format(item.weight) } { parseInt( item.id ) == 17 || parseInt( item.id ) == 237 ? 'шт.' : parseInt( item.cat_id ) == 6 ? 'л' : 'г' }</span>
      </div>
      
      <div style={{ height: 120, width: '100%', textAlign: 'center', overflow: 'hidden' }}>
        <Typography component="span" className='hidddenText5'>{desc}</Typography>
      </div>

      {count == 0 ?
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button variant="outlined" className='ModalItemButtonCartPC' onClick={ () => { setCount( prev => prev + 1 ) } }>
            <span>{ new Intl.NumberFormat('ru-RU').format(item.price)}</span>
            <IconRuble style={{ width: 14, height: 14, fill: '#666666', marginLeft: 5, paddingBottom: 1  }} />
          </Button>
        </div>
          :
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div variant="contained" className='ModalItemButtonCartPC openPC'>
            <button className='minus' onClick={ () => { setCount( prev => prev - 1 ) } }>–</button>
            <span>{count}</span>
            <button className='plus' onClick={ () => { setCount( prev => prev + 1 ) } }>+</button>
          </div>
        </div>
      }
    

    </Grid>
  )
}
