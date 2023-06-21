import { useState, memo } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { BurgerIconTablet, MenuIconTablet, AboutIconTablet, DocumentIconTablet } from '@/ui/Icons.js';
import JacoLogo from '@/public/jaco-logo-tablet.png';
import { roboto } from '@/ui/Font.js';

import { shallow } from 'zustand/shallow';

import { useHeaderStore } from '@/components/store.js';

import BasketIconHeaderTablet from '../basket/basketIconHeaderTablet';
import ProfileIconHeaderTablet from '../profile/profileIconHeaderTablet';

export default memo(function NavBarTablet(props) {

  console.log('NavBarTablet render');

  const { city, cityRu } = props;

  const [activeMenu, setActiveMenu] = useState(false);

  const [setActiveBasket, openBasket] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket], shallow);

  if (city == '') {
    return null;
  }

  const closeBasket = () => {
    if (openBasket) {
      setActiveBasket(false);
    }
  };

  return (
    <AppBar position="fixed" className="headerTablet" elevation={2} onClick={closeBasket}>
      <Toolbar>
        <Link href={`/${city}`}>
          <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true}/>
        </Link>

        <>
          <BurgerIconTablet onClick={() => setActiveMenu(true)} className={activeMenu ? 'BurgerActive' : null}/>
          <SwipeableDrawer
            anchor={'top'}
            open={activeMenu}
            onClose={() => setActiveMenu(false)}
            onOpen={() => setActiveMenu(true)}
          >
            <List className={'LinkList ' + roboto.variable}>
              <ListItem onClick={() => setActiveMenu(false)}>
                <Link href={'/' + city}>
                  <div>
                    <div>
                      <MenuIconTablet />
                    </div>
                    <span>Меню</span>
                  </div>
                </Link>
              </ListItem>

              <ProfileIconHeaderTablet setActiveMenu={setActiveMenu} city={city}/>

              <ListItem onClick={() => setActiveMenu(false)}>
                <Link href={`/${city}/about`}>
                  <div>
                    <div>
                      <AboutIconTablet />
                    </div>
                    <span>О компании</span>
                  </div>
                </Link>
              </ListItem>

              <ListItem onClick={() => setActiveMenu(false)}>
                <Link href={`/${city}`}>
                  <div>
                    <div>
                      <DocumentIconTablet />
                    </div>
                    <span>Документы</span>
                  </div>
                </Link>
              </ListItem>

              <BasketIconHeaderTablet setActiveMenu={setActiveMenu}/>

            </List>

            <div className="Line"></div>

          </SwipeableDrawer>
        </>

      </Toolbar>
    </AppBar>
  );
});
