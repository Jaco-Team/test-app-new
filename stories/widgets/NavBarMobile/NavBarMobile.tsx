import React from 'react';
import {
  MenuIconMobile,
  AboutIconMobile,
  LocationIconMobile,
  MapContactsMobile,
  ProfileIconMobile,
  BasketIconMobile,
} from '../../shared/Icons';
import './NavBarMobile.scss';

type ActivePageType =
  | 'home'
  | 'contacts'
  | 'other'
  | 'account'
  | 'profile'
  | 'address'
  | 'promokody'
  | 'zakazy'
  | 'cart';

type AuthType = 'auth' | 'guest' | 'pending';

interface NavBarMobileProps {
  activePage?: ActivePageType;
  itemsCount?: number;
  isAuth?: AuthType;
  onClose?: () => void;
  onNavigate?: (page: ActivePageType) => void;
}

export const NavBarMobile: React.FC<NavBarMobileProps> = ({
  activePage = 'home',
  itemsCount = 0,
  isAuth = 'guest',
  onClose,
  onNavigate,
}) => {
  const accountPages: ActivePageType[] = [
    'account',
    'profile',
    'address',
    'promokody',
    'zakazy',
  ];
  const bgColor = accountPages.includes(activePage);

  const handleNavigate =
    (page: ActivePageType) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onNavigate?.(page);
      onClose?.();
    };

  return (
    <div className="navBarMobile">
      <div className="listLink">
        <a
          href="/menu"
          style={{
            background:
              activePage === 'home' ? 'rgba(0, 0, 0, 0.03)' : undefined,
          }}
          onClick={handleNavigate('home')}
        >
          <MenuIconMobile />
          <span
            style={{ color: activePage === 'home' ? '#dd1a32' : undefined }}
          >
            Меню
          </span>
        </a>

        <a href="/city" onClick={handleNavigate('contacts')}>
          <MapContactsMobile />
          <span>Тольятти</span>
        </a>

        <a
          href="/contacts"
          style={{
            background:
              activePage === 'contacts' ? 'rgba(0, 0, 0, 0.03)' : undefined,
          }}
          onClick={handleNavigate('contacts')}
        >
          <LocationIconMobile />
          <span
            style={{ color: activePage === 'contacts' ? '#dd1a32' : undefined }}
          >
            Адреса
          </span>
        </a>

        <a
          href="/about"
          style={{
            background:
              activePage === 'other' ? 'rgba(0, 0, 0, 0.03)' : undefined,
          }}
          onClick={handleNavigate('other')}
        >
          <AboutIconMobile />
          <span
            style={{ color: activePage === 'other' ? '#dd1a32' : undefined }}
          >
            Жако
          </span>
        </a>

        <a
          href="/account"
          style={{ background: bgColor ? 'rgba(0, 0, 0, 0.03)' : undefined }}
          onClick={handleNavigate('account')}
        >
          <ProfileIconMobile />
          <span style={{ color: bgColor ? '#dd1a32' : undefined }}>
            Аккаунт
          </span>
          {isAuth !== 'auth' && <span className="circle profile">Икс</span>}
        </a>

        <a
          href="/cart"
          style={{
            background:
              activePage === 'cart' ? 'rgba(0, 0, 0, 0.03)' : undefined,
          }}
          onClick={handleNavigate('cart')}
        >
          <BasketIconMobile />
          <span
            style={{ color: activePage === 'cart' ? '#dd1a32' : undefined }}
          >
            Корзина
          </span>
          {itemsCount > 0 && <span className="circle count">{itemsCount}</span>}
        </a>
      </div>
      <div className="line" />
    </div>
  );
};
