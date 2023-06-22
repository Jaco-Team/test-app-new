import { useState, memo } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { BurgerIconMobile, MenuIconMobile, AboutIconMobile, DocumentIconMobile } from '@/ui/Icons.js';
import JacoLogo from '@/public/jaco-logo-mobile.png';
import { roboto } from '@/ui/Font.js';

import { shallow } from 'zustand/shallow';

import { useHeaderStore } from '@/components/store.js';

import BasketIconHeaderMobile from '../basket/basketIconHeaderMobile';
import ProfileIconHeaderMobile from '../profile/profileIconHeaderMobile';

export default memo(function NavBarMobile(props) {

  console.log('NavBarMobile render');

  const { city, cityRu } = props;

  const [activeMenu, setActiveMenu] = useState(false);

  const [setActiveBasket, openBasket] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket], shallow);

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

  return (
    <AppBar position="fixed" className="headerMobile" elevation={2} onClick={close}>
      <Toolbar>
        <Link href={`/${city}`}>
          <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true}/>
        </Link>

        <>
          <BurgerIconMobile onClick={() => setActiveMenu(true)} className={activeMenu ? 'BurgerActive' : null}/>
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
                      <MenuIconMobile />
                    </div>
                    <span>Меню</span>
                  </div>
                </Link>
              </ListItem>

              <ProfileIconHeaderMobile setActiveMenu={setActiveMenu} city={city}/>

              <ListItem onClick={() => setActiveMenu(false)}>
                <Link href={`/${city}/about`}>
                  <div>
                    <div>
                      <AboutIconMobile />
                    </div>
                    <span>О компании</span>
                  </div>
                </Link>
              </ListItem>

              <ListItem onClick={() => setActiveMenu(false)}>
                <Link href={`/${city}`}>
                  <div>
                    <div>
                      <DocumentIconMobile />
                    </div>
                    <span>Документы</span>
                  </div>
                </Link>
              </ListItem>

              <BasketIconHeaderMobile setActiveMenu={setActiveMenu}/>

            </List>

            <div className="Line"></div>

          </SwipeableDrawer>
        </>

      </Toolbar>
    </AppBar>
  );
});
