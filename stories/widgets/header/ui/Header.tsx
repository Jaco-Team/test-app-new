import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { CategoryMenu, CategoryMenuItem } from '../../../entities/navigation/ui/category-menu/CategoryMenu';
import { IconPC } from '../../../shared/IconPC/IconPC';
import { MyCatLink } from '../../../shared/MyTextLink/MyCatLink';
import { BurgerIconMobile } from '../../../shared/Icons.js';
import { NavBarMobile } from '../../NavBarMobile/NavBarMobile';

import './Header.scss';

export type HeaderViewport = 'mobile' | 'tablet' | 'desktop';

export interface HeaderProps {
  viewport?: HeaderViewport;
  categories: CategoryMenuItem[];
  cityName?: string;
  basketTotal?: string;
  scroll?: boolean;
  activeMenu?: boolean;
  mobileMenu?: React.ComponentProps<typeof NavBarMobile>;
}

export function Header({
  viewport = 'desktop',
  categories,
  cityName = 'Тольятти',
  basketTotal = '0',
  scroll = false,
  activeMenu = false,
  mobileMenu,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(activeMenu);
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  if (isMobile) {
    return (
      <>
        <AppBar className="headerMobile">
          <Toolbar>
            <a className="logoPC">
              <img alt="Жако доставка роллов и пиццы" src="/jaco-logo-mobile.png" />
            </a>
            <button
              className="headerBurgerButton"
              type="button"
              aria-label="Открыть меню"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
            >
              <BurgerIconMobile className={isMobileMenuOpen ? 'burgerActive' : undefined} />
            </button>
          </Toolbar>
        </AppBar>

        {isMobileMenuOpen && mobileMenu && <NavBarMobile {...mobileMenu} />}
      </>
    );
  }

  return (
    <>
      <AppBar className={isTablet ? 'HeaderPad' : 'HeaderPC'}>
        <Toolbar>
          <div className={isTablet ? 'header-container' : undefined}>
            <div className={isTablet ? 'left-section' : undefined}>
              <a className={isTablet ? 'logoPad' : 'logoPC'}>
                <img alt="Жако доставка роллов и пиццы" src="/Jaco-Logo-120.png" />
              </a>

              <CategoryMenu items={categories} withPromo={!isTablet} />
            </div>

            <div className={isTablet ? 'right-section' : undefined}>
              {isTablet && (
                <button
                  className="burger-menu"
                  type="button"
                  aria-label="Открыть меню"
                  onClick={() => setIsMobileMenuOpen((value) => !value)}
                >
                  <BurgerIconMobile className={isMobileMenuOpen ? 'burgerActive' : undefined} />
                </button>
              )}

              <div className={isTablet ? 'icons-group' : undefined}>
                <a className="city">
                  <MyCatLink>{cityName}</MyCatLink>
                </a>
                <IconPC icon="location" element="header" />
                <IconPC icon="docs" element="header" />
                <IconPC icon="profile" element="header" />
                <IconPC icon="basket" count={basketTotal} element="header" />
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      {scroll && <div className={isTablet ? 'blockShadowPad' : 'blockShadow'} />}
      {isMobileMenuOpen && isTablet && mobileMenu && <NavBarMobile {...mobileMenu} />}
    </>
  );
}
