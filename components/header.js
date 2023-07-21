import React, { useEffect } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import { roboto } from '../ui/Font.js';

import ModalCityPC from '../modules/header/modalCity/modalCityPC.js';
import ModalCityMobile from '../modules/header/modalCity/modalCityMobile.js';
import ModalAuth from '../modules/header/modalAuth';
import NavBarPC from '../modules/header/navBar/navBarPC.js';
import NavBarMobile from '@/modules/header/navBar/navBarMobile.js';
import BasketPC from '../modules/header/basket/basketPC.js';
import BasketModalPC from '../modules/header/basket/basketModalPC.js';

import { useHeaderStore } from './store.js';
import { shallow } from 'zustand/shallow';

export default React.memo(function Header({ city, city_list, cats, active_page }) {

  const thisCityRU = city_list.find((item) => item.link == city)['name'];

  const matchesDev = useMediaQuery('screen and (max-width: 1170px)', { noSsr: false });
  //const matchesDev = useMediaQuery('screen and (max-width: 601px)', { noSsr: false });

  const [setMatches, matches] = useHeaderStore((state) => [state.setMatches, state.matches], shallow);
  
  useEffect(() => {
    setMatches(matchesDev);
  }, [matchesDev]);

  return (
    <div className={roboto.variable} style={{ overflow: 'auto' }}>

      {matches ?
        <>
          <NavBarMobile city={city} active_page={active_page}/>
          <ModalCityMobile />
        </>
        :
        <>
          <NavBarPC city={city} cityRu={thisCityRU} catList={cats} active_page={active_page}/>
          <ModalCityPC />
          <BasketModalPC />
        </>
      }

      <ModalAuth />
      <BasketPC />
    </div>
  );
});
