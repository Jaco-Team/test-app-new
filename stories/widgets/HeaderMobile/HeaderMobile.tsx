import React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { BurgerIconMobile } from '../../shared/Icons.js';
import { NavBarMobile } from '../NavBarMobile/NavBarMobile';

import './HeaderMobile.scss';

interface HeaderMobileProps {
  activeMenu?: boolean;
  menu?: any;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({ activeMenu = false, menu }) => {
  return (
    <>
      <AppBar className={['headerMobile'].join(' ')}>
        <Toolbar>
          <a className="logoPC">
            <img alt="Жако доставка роллов и пиццы" src={'/jaco-logo-mobile.png'} />
          </a>
          <div>
            <BurgerIconMobile className={activeMenu ? 'burgerActive' : undefined} />
          </div>
        </Toolbar>
      </AppBar>
      {activeMenu && <NavBarMobile {...menu} />}
    </>
  );
};
