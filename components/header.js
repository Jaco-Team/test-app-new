import React, { useEffect } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import { roboto } from '../ui/Font.js';

import ModalCityPC from '@/modules/header/modalCity/modalCityPC.js';
import ModalCityMobile from '@/modules/header/modalCity/modalCityMobile.js';
import ModalAuth from '@/modules/header/modalAuth/page.js';
import NavBarPC from '@/modules/header/navBar/navBarPC.js';
import NavBarMobile from '@/modules/header/navBar/navBarMobile.js';
import BasketPC from '@/modules/header/basket/basketPC.js';
import BasketModalPC from '@/modules/cart/basketModalPC.js';
import ModalAddr from '@/modules/profile/profile/modalAddr.jsx';
import ModalAlert from '@/modules/header/alert';
import SelectAddress from '@/modules/header/selectAddress.js'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useHeaderStore, useHomeStore } from './store.js';

export default React.memo(function Header({ city, city_list, cats, active_page }) {
  const thisCityRU = city_list.find((item) => item.link == city)['name'];

  const matchesDev = useMediaQuery('screen and (max-width: 1170px)');
  //const matchesDev = useMediaQuery('screen and (max-width: 601px)', { noSsr: false });

  const [setMatches, matches, checkToken, isShowLoad] = useHeaderStore( state => [state.setMatches, state.matches, state.checkToken, state.isShowLoad] ); 
  const [getItemsCat, category] = useHomeStore( state => [state.getItemsCat, state.category]);
  
  useEffect(() => {
    //if( category?.length == 0 ){
      //getItemsCat('home', city);

      //console.log('getItemsCat');
    //}

    checkToken();
  }, []);

  useEffect(() => {
    if( city && city.length > 0 ){
      getItemsCat('home', city);
      console.log('getItemsCat');
    }
  }, [city]);

  useEffect(() => {
    if(matches !== matchesDev) {
      setMatches(matchesDev);
    }
  }, [matchesDev, matches]);

  return (
    <div className={roboto.variable} style={{ overflow: 'auto' }}>

      <Backdrop
        sx={{ color: '#fff', zIndex: 5000 }}
        open={isShowLoad}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {matches ?
        <>
          <NavBarMobile city={city} active_page={active_page}/>
          <ModalCityMobile />
        </>
        :
        <>
          <NavBarPC city={city} cityRu={thisCityRU} catList={cats} active_page={active_page}/>
          <ModalCityPC />
          <BasketPC />
          <BasketModalPC />
          <ModalAddr />
        </>
      }
      <ModalAuth city={city} />
      <ModalAlert />
      <SelectAddress />
    </div>
  );
});
