import { useState, memo, useEffect } from 'react';

import Link from 'next/link';
//import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { BurgerIconMobile, MenuIconMobile, AboutIconMobile, LocationIconMobile, MapContactsMobile, Sale, SvgLogoMobile } from '@/ui/Icons.js';
import { roboto } from '@/ui/Font.js';

import { useHeaderStoreNew, useCitiesStore, useProfileStore } from '@/components/store.js';

import BasketIconHeaderMobile from '../basket/basketIconHeaderMobile';
import ProfileIconHeaderMobile from '../profile/profileIconHeaderMobile';

import { Link as ScrollLink } from 'react-scroll';

const MemoLogo = memo(function MemoLogo({city, activePage}){
  return(
    <>
      {activePage === 'home' ?
        <ScrollLink
          to={'BannerMobile'}
          spy={true}
          isDynamic={true}
          smooth={false}
          offset={-200}
        >
          {/* <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true}/> */}
          <SvgLogoMobile />
        </ScrollLink>
          :
        <Link href={'/' + city}>
          <SvgLogoMobile />
          {/* <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true}/> */}
        </Link>
      }
    </>
  )
})

export default memo(function NavBarMobile({ city }) {
  const [activeMenu, setActiveMenu] = useState(false);

  const [setActiveBasket, openBasket, setActiveModalCityList, activePage, isAuth] = useHeaderStoreNew( state => [state?.setActiveBasket, state?.openBasket, state?.setActiveModalCityList, state?.activePage, state?.isAuth] );
  const [ getCountPromos_Orders ] = useProfileStore((state) => [ state.getCountPromos_Orders ]);

  const [ thisCityRu ] = useCitiesStore( state => [ state.thisCityRu ] );

  if (city == '') {
    return null;
  }

  const close = () => {
    if (openBasket) {
      setActiveBasket(false);
    }

    if(activeMenu) {
      setActiveMenu(false)
    }

  };

  useEffect(() => {
    getCountPromos_Orders(city);

    const intervalId = setInterval(() => {
      getCountPromos_Orders(city);
    }, 1000 * 30);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [isAuth]);

  const goToPage = (page) => {
    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'Клик в шапке '+page);
    }

    if( thisCityRu == 'Тольятти' ){
      ym(100601350, 'reachGoal', 'Клик в шапке '+page);
    }

    setActiveMenu(false)
  }

  return (
    <AppBar position="fixed" className="headerMobile" elevation={2} onClick={close} sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }}>
      <Toolbar>
        <MemoLogo city={city} activePage={activePage} />
        <>
          <BurgerIconMobile onClick={() => setActiveMenu(true)} className={activeMenu ? 'BurgerActive' : null}/>

          <SwipeableDrawer
            anchor={'top'}
            open={activeMenu}
            onClose={() => setActiveMenu(false)}
            onOpen={() => setActiveMenu(true)}
            id='headerMenuCat'
          >
            <List className={'LinkList ' + roboto.variable}>

              <ListItem onClick={() => setActiveMenu(false)}>
                <Link href={'/' + city} style={{background: activePage === 'home' ? 'rgba(0, 0, 0, 0.03)' : null}}>
                  <MenuIconMobile />
                  <span style={{color: activePage === 'home' ? ' #dd1a32' : null}}>Меню</span>
                </Link>
              </ListItem>

              <ListItem onClick={() => goToPage('Акции')}>
                <Link href={`/${city}/akcii`} style={{background: activePage === 'akcii' ? 'rgba(0, 0, 0, 0.03)' : null}}>
                  <Sale />
                  <span style={{color: activePage === 'akcii' ? ' #dd1a32' : null}}>Акции</span>
                </Link>
              </ListItem>

              <ListItem onClick={() => { setActiveModalCityList(true); setActiveMenu(false); }}>
                <a>
                  <MapContactsMobile className='otherSVG' />
                  <span>{thisCityRu}</span>
                </a>
              </ListItem>

              <ListItem onClick={() => goToPage('Контакты')}>
                <Link href={`/${city}/contacts`} style={{background: activePage === 'contacts' ? 'rgba(0, 0, 0, 0.03)' : null}}>
                  <LocationIconMobile  className='otherSVG' />
                  <span style={{color: activePage === 'contacts' ? ' #dd1a32' : null}}>Адреса</span>
                </Link>
              </ListItem>

              <ListItem onClick={() => setActiveMenu(false)}>
                <Link href={`/${city}/document`} style={{background: activePage === 'document' ? 'rgba(0, 0, 0, 0.03)' : null}}>
                  <AboutIconMobile />
                  <span style={{color: activePage === 'document' ? ' #dd1a32' : null}}>Жако</span>
                </Link>
              </ListItem>

              <ProfileIconHeaderMobile setActiveMenu={setActiveMenu} city={city} active_page={activePage} goToPage={goToPage}/>

              <BasketIconHeaderMobile setActiveMenu={setActiveMenu} active_page={activePage} city={city}/>

            </List>

            <div className="Line" />

          </SwipeableDrawer>
        </>

      </Toolbar>
    </AppBar>
  );
});
