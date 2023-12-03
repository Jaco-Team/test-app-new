import React, { useEffect } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import { roboto } from '../ui/Font.js';

import ModalCityPC from '@/modules/header/modalCity/modalCityPC.js';
import ModalCityMobile from '@/modules/header/modalCity/modalCityMobile.js';
import ModalAuth from '@/modules/header/modalAuth/page.js';
import NavBarPC from '@/modules/header/navBar/navBarPC.js';
import NavBarMobile from '@/modules/header/navBar/navBarMobile.js';
import BasketPC from '@/modules/header/basket/basketPC.js';
import BasketModalPC from '@/modules/header/basket/basketModalPC.js';
import ModalAddr from '@/modules/profile/profile/modalAddr.jsx';

import { useHeaderStore } from './store.js';

export default React.memo(function Header({ city, city_list, cats, active_page }) {
  //console.log('render Header')

  const thisCityRU = city_list.find((item) => item.link == city)['name'];

  const matchesDev = useMediaQuery('screen and (max-width: 1170px)');
  //const matchesDev = useMediaQuery('screen and (max-width: 601px)', { noSsr: false });

  const [setMatches, matches] = useHeaderStore((state) => [state.setMatches, state.matches]);
  
  console.log( 'matchesDev', matchesDev, matches )

  useEffect(() => {
    if(matches !== matchesDev) {
      setMatches(matchesDev);
    }
  }, [matchesDev, matches]);

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
          <BasketPC />
          <BasketModalPC />
          <ModalAddr />
        </>
      }
      <ModalAuth city={city} />
    </div>
  );
});
