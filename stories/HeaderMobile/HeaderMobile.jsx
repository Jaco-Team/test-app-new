import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { BurgerIconMobile } from '../Icons';
import { NavBarMobile } from '../NavBarMobile/NavBarMobile';

import './HeaderMobile.scss';

export const HeaderMobile = ({ activeMenu, menu }) => {
  return (
    <>
    <AppBar className={['headerMobile'].join(' ')}>
      <Toolbar>
        <a className="logoPC">
          <img alt="Жако доставка роллов и пиццы" src={'/jaco-logo-mobile.png'}/>
        </a>
        <div><BurgerIconMobile className={activeMenu ? 'burgerActive' : null} /></div>
      </Toolbar>
    </AppBar>
      {activeMenu ? <NavBarMobile {...menu} /> : null}
    </>
  );
};

HeaderMobile.propTypes = {
  activeMenu: PropTypes.bool,
};
