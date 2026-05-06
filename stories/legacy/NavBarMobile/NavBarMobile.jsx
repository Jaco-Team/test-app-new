import PropTypes from 'prop-types';
import {MenuIconMobile, AboutIconMobile, LocationIconMobile, MapContactsMobile, ProfileIconMobile, BasketIconMobile} from '../Icons';
import './NavBarMobile.scss';

export const NavBarMobile = ({ activePage, itemsCount, isAuth }) => {
  const bgColor = activePage === 'account' || activePage === 'profile' || activePage === 'address' || activePage === 'promokody' || activePage === 'zakazy';

  return (
    <div className="navBarMobile">
      <div className="listLink">
        <a style={{ background: activePage === 'home' ? 'rgba(0, 0, 0, 0.03)' : null}}>
          <MenuIconMobile />
          <span style={{ color: activePage === 'home' ? ' #dd1a32' : null }}>Меню</span>
        </a>
        <a>
          <MapContactsMobile />
          <span>Тольятти</span>
        </a>
        <a style={{ background: activePage === 'contacts' ? 'rgba(0, 0, 0, 0.03)' : null }}>
          <LocationIconMobile />
          <span style={{ color: activePage === 'contacts' ? ' #dd1a32' : null }}>Адреса</span>
        </a>
        <a style={{ background: activePage === 'other' ? 'rgba(0, 0, 0, 0.03)' : null }}>
          <AboutIconMobile />
          <span style={{ color: activePage === 'other' ? ' #dd1a32' : null }}>Жако</span>
        </a>
        <a style={{ background: bgColor ? 'rgba(0, 0, 0, 0.03)' : null }}>
          <ProfileIconMobile />
          <span style={{ color: bgColor ? ' #dd1a32' : null }}>Аккаунт</span>
          {isAuth !== 'auth' ? <span className="circle profile">Икс</span> : null}
        </a>
        <a style={{ background: activePage === 'cart' ? 'rgba(0, 0, 0, 0.03)' : null }}>
          <BasketIconMobile />
          <span style={{ color: activePage === 'cart' ? ' #dd1a32' : null }}>Корзина</span>
          {itemsCount ? <span className="circle count">{itemsCount}</span> : null}
        </a>
      </div>
      <div className="line" />
    </div>
  );
};

NavBarMobile.propTypes = {
  activePage: PropTypes.string.isRequired,
  itemsCount: PropTypes.number,
  isAuth: PropTypes.string.isRequired,
};
