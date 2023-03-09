import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import { useHomeStore } from '../../components/store.js';
import { shallow } from 'zustand/shallow'

import CardItem from './cardItem.js';

export default React.memo(function CatItems(){

  const [ cats, setCats ] = useState([]);
  const [ CatsItems ] = useHomeStore( state => [ state.CatsItems ], shallow );

  useEffect( () => {
    if( cats.length == 0 ){
      setCats(CatsItems);
    }
  }, [CatsItems] )

  return (
    cats.map((cat, key) => 
      <Grid container spacing={2} key={key} name={"cat"+cat.main_id} id={"cat"+cat.id} sx={{ padding: { xs: '0px 5%', sm: '0px 20px' } }} style={{ margin: 0, flexWrap: 'wrap', width: '100%' }} className="MainItems mainContainer" >
        {cat.items.map((it, k) => (
          <CardItem key={k} data={it} />
        ))}
      </Grid>
    )                                 
  )
})