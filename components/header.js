import React, { useEffect } from 'react';
import Script from 'next/script'

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

import ModalActiveVK_pc from '@/modules/header/modalActiveVK/modalActiveVK_pc';
import ModalActiveVK_mobile from '@/modules/header/modalActiveVK/modalActiveVK_mobile';

import ModalPointClose_pc from '@/modules/header/modalPointClose/modalPointClose_pc';
import ModalPointClose_mobile from '@/modules/header/modalPointClose/modalPointClose_mobile';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useHeaderStore, useHomeStore } from './store.js';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

import { usePathname, useSearchParams } from 'next/navigation'

export default React.memo(function header({ city, city_list, cats }) {
  
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('type')

  const firebaseConfig = {
    apiKey: "AIzaSyChAHowCT2C7GRwfcxwt1Pi4SCV4CaVpP4",
    authDomain: "jacofoodsite.firebaseapp.com",
    projectId: "jacofoodsite",
    storageBucket: "jacofoodsite.appspot.com",
    messagingSenderId: "692082803779",
    appId: "1:692082803779:web:39a39963cd8bff927000f6"
  };
    
  // Initialize Firebase
  

  let thisCityRU = '';

  if( city_list && city_list.length > 0 ) {
    thisCityRU = city_list.find((item) => item.link == city)['name'];
  }else{
    return ;
  }

  if( typeof window != 'undefined' ){
    const firebaseAPP = initializeApp(firebaseConfig);
    const analytics = getAnalytics(firebaseAPP);
    const perf = getPerformance(firebaseAPP);

    if (location.protocol !== 'https:' && location.hostname != 'localhost' ) {
      location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }

    if( location.hostname == 'new.jacofood.ru' ){
      location.replace(`https://jacofood.ru${location.href.substring(location.origin.length)}`);
    }
  }


  const matchesDev = useMediaQuery('screen and (max-width: 800px)');

  const [setMatches, matches, checkToken, isShowLoad, setShowClosePoint] = useHeaderStore( state => [state.setMatches, state.matches, state.checkToken, state.isShowLoad, state.setShowClosePoint] ); 
  const [getItemsCat, category] = useHomeStore( state => [state.getItemsCat, state.category]);
  
  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if( city && city.length > 0 ){
      getItemsCat('home', city);
    }
  }, [city]);

  useEffect(() => {
    if(matches !== matchesDev) {
      setMatches(matchesDev);
    }
  }, [matchesDev, matches]);

  useEffect(() => {
    if( search == 'pobeda_close' ){
      let state = { },
        title = '',
        url = window.location.pathname;

      window.history.pushState(state, title, url)

      setShowClosePoint(true);
    }
  }, [search]);

  return (
    <div className={roboto.variable} style={{ overflow: 'auto' }}>
      <Script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js" strategy="lazyOnload" />
      <Script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js" strategy="lazyOnload" />
      <Script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js" strategy="lazyOnload" />
      
      <Backdrop
        sx={{ color: '#fff', zIndex: 5000 }}
        open={isShowLoad}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {matches ?
        <>
          <NavBarMobile city={city}/>
          <ModalCityMobile />
          <ModalActiveVK_mobile />
          <ModalPointClose_mobile />
        </>
        :
        <>
          <NavBarPC city={city} cityRu={thisCityRU} catList={cats}/>
          <ModalCityPC />
          <BasketPC />
          <BasketModalPC />
          <ModalAddr />
          <ModalActiveVK_pc />
          <ModalPointClose_pc />
        </>
      }
      
      <ModalAuth city={city} />
      <ModalAlert />
      <SelectAddress />
    </div>
  );
});
