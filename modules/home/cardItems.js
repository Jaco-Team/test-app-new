import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import useMediaQuery from '@mui/material/useMediaQuery';

import { useHomeStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow'

import CardItemPc from './cardItemPc.js';
import CardItemMobile from './cardItemMobile.js';
import useCheckCat from './hooks.js';

import * as Scroll from 'react-scroll';

var Element  = Scroll.Element;
var Events  = Scroll.Events;
var scroller = Scroll.scroller;

export default React.memo(function CatItems(){

  const [ cats, setCats ] = useState([]);
  const [ CatsItems ] = useHomeStore( state => [ state.CatsItems ], shallow );

  let activeId = useCheckCat(CatsItems);

  console.log( 'activeId', activeId )

  useEffect( () => {
    if( cats.length == 0 ){
      setCats(CatsItems);
    }
  }, [CatsItems] )

  useEffect( () => {
    setTimeout( () => {
      if( localStorage.getItem('goTo') ){
        let hash = localStorage.getItem('goTo')
        
        //localStorage.removeItem('goTo');
        
        let offset = 100;
        
        if( document.querySelector('.scrollCat.mobile') ){
          offset += 100;
        }
        
        setTimeout(()=>{
          scroller.scrollTo('cat'+hash, {
            duration: 200,
            delay: 0,
            smooth: "easeInOutQuart",
            offset: -offset
          });
        }, 150)
      }


      
      
    }, 300 )



    
  }, [] )

  const matches = useMediaQuery('screen and (min-width: 40em)', { noSsr: true });

  if( cats.length == 0 ){
    return (
      <div style={{ height: 1000 }} />
    )
  }

  
  if( !matches ){
    return (
      cats.map((cat, key) => 
        <Grid container spacing={2} key={key} name={"cat"+cat.main_id} id={"cat"+cat.id} sx={{ padding: { xs: '0px 5%', sm: '0px 20px' } }} style={{ margin: 0, flexWrap: 'wrap', width: '100%' }} className="MainItems mainContainer" >
          {cat.items.map((it, k) => (
            <CardItemMobile key={k} data={it} />
          ))}
        </Grid>
      )                                 
    )
  }

  let state_id = 0;
  let state_count = 0;

  function abc(main_id){
    if( parseInt(main_id) == parseInt(state_id) ){
      state_count ++;
      return main_id+'_'+state_count;
    }else{
      state_count = 0;
      state_id = main_id;
      return main_id+'_'+state_count;
    }
  }


  

      //console.log( 'cats', cats )

      

  return (
    cats.map((cat, key) => 
      <Grid container spacing={2} key={key} name={"cat"+cat.main_id} id={"cat"+cat.id} style={{ margin: 0, flexWrap: 'wrap', width: '100%', marginTop: 138 }} className="MainItems mainContainer" >
        {cat.items.map((it, k) => (
          <CardItemPc key={k} data={it} />
        ))}
      </Grid>
    )                           
  )
})