import React from 'react';
import {
  MenuIconMobile,
  AboutIconMobile,
  LocationIconMobile,
  MapContactsMobile,
  ProfileIconMobile,
  BasketIconMobile
} from '../../shared/Icons.js';
import './NavBarMobile.scss';

interface NavBarMobileProps {
  activePage: 'home' | 'contacts' | 'other' | 'account' | 'profile' | 'address' | 'promokody' | 'zakazy' | 'cart';
  itemsCount?: number;
  isAuth: 'auth' | 'not_auth' | string;
}

export const NavBarMobile: React.FC<NavBarMobileProps> = ({
                                                            activePage,
                                                            itemsCount = 0,
                                                            isAuth
                                                          }) => {
  const bgColor = activePage === 'account' ||
    activePage === 'profile' ||
    activePage === 'address' ||
    activePage === 'promokody' ||
    activePage === 'zakazy';

  return (
    <div className="navBarMobile">
      <div className="listLink">
        {/* Меню */}
        <a style={{background: activePage === 'home' ? 'rgba(0, 0, 0, 0.03)' : undefined}}>
          <MenuIconMobile/>
          <span style={{color: activePage === 'home' ? '#dd1a32' : undefined}}>Меню</span>
        </a>

        {/* Город */}
        <a>
          <MapContactsMobile/>
          <span>Тольятти</span>
        </a>

        {/* Адреса */}
        <a style={{background: activePage === 'contacts' ? 'rgba(0, 0, 0, 0.03)' : undefined}}>
          <LocationIconMobile/>
          <span style={{color: activePage === 'contacts' ? '#dd1a32' : undefined}}>Адреса</span>
        </a>

        {/* Жако */}
        <a style={{background: activePage === 'other' ? 'rgba(0, 0, 0, 0.03)' : undefined}}>
          <AboutIconMobile/>
          <span style={{color: activePage === 'other' ? '#dd1a32' : undefined}}>Жако</span>
        </a>

        {/* Аккаунт */}
        <a style={{background: bgColor ? 'rgba(0, 0, 0, 0.03)' : undefined}}>
          <ProfileIconMobile/>
          <span style={{color: bgColor ? '#dd1a32' : undefined}}>Аккаунт</span>
          {isAuth !== 'auth' && <span className="circle profile">Икс</span>}
        </a>

        {/* Корзина */}
        <a style={{background: activePage === 'cart' ? 'rgba(0, 0, 0, 0.03)' : undefined}}>
          <BasketIconMobile/>
          <span style={{color: activePage === 'cart' ? '#dd1a32' : undefined}}>Корзина</span>
          {itemsCount !== undefined && itemsCount > 0 && (
            <span className="circle count">{itemsCount}</span>
          )}
        </a>
      </div>
      <div className="line"/>
    </div>
  );
};
