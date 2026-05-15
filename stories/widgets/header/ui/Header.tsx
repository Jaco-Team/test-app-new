import React, { useState, MouseEvent } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import './Header.scss';
import { MyCatLink } from '../../../shared/MyTextLink/MyCatLink';
import { Icon } from '../../../shared/Icon/Icon';
import { MyMenu } from '../../../shared/MyMenu/MyMenu';
import { BurgerIconMobile } from '../../../shared/Icons';
import headerData from '../../../fixtures/header.togliatti.json';
import { CatItem, HeaderProps, SubCatItem } from '../model/types';
import { NavBarMobile } from '../../NavBarMobile/NavBarMobile';

const MAIN_CATS_TOGLIATTI: CatItem[] = headerData.main_cat;

export const Header: React.FC<HeaderProps> = ({
  viewport = 'desktop',
  scroll = false,
  count = '0',
  activeMenu = false,
  menu,
  onMenuToggle,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(activeMenu);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isOpenCat, setIsOpenCat] = useState<boolean>(false);
  const [currentSubCats, setCurrentSubCats] = useState<SubCatItem[]>([]);

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  // Обработчики для мобильного/планшетного меню
  const handleMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    onMenuToggle?.(false);
  };

  // Обработчики для десктопного меню категорий
  const openMenu = (
    event: MouseEvent<HTMLElement>,
    cats: SubCatItem[]
  ): void => {
    setAnchorEl(event.currentTarget);
    setCurrentSubCats(cats);
    setIsOpenCat(true);
  };

  const closeMenu = (): void => {
    setAnchorEl(null);
    setIsOpenCat(false);
    setCurrentSubCats([]);
  };

  // Мобильная версия
  if (isMobile) {
    return (
      <>
        <AppBar className="headerMobile">
          <Toolbar>
            <a className="site-header__logo" href="/">
              <img
                alt="Жако доставка роллов и пиццы"
                src="/jaco-logo-mobile.png"
              />
            </a>
            <div className="burger-wrapper" onClick={handleMenuToggle}>
              <BurgerIconMobile
                className={isMenuOpen ? 'burgerActive' : undefined}
              />
            </div>
          </Toolbar>
        </AppBar>

        {isMenuOpen && <div className="backdrop" onClick={handleCloseMenu} />}
        <div className={`navMenuWrapper ${isMenuOpen ? 'open' : 'closed'}`}>
          {menu && <NavBarMobile {...menu} onClose={handleCloseMenu} />}
        </div>
      </>
    );
  }

  // Планшетная версия
  if (isTablet) {
    return (
      <>
        <AppBar className="HeaderPad">
          <Toolbar>
            <div className="header-container">
              <div className="left-section">
                <a className="logoPad" href="/">
                  <img
                    alt="Жако доставка роллов и пиццы"
                    src="/Jaco-Logo-120.png"
                  />
                </a>
              </div>

              <div className="right-section">
                <div className="burger-menu" onClick={handleMenuToggle}>
                  <BurgerIconMobile
                    className={isMenuOpen ? 'burgerActive' : undefined}
                  />
                </div>

                <div className="icons-group">
                  <div className="city-wrapper">
                    <a className="city">
                      <MyCatLink children="Тольятти" />
                    </a>
                    <Icon icon="location" element="header" />
                  </div>
                  <Icon icon="docs" element="header" />
                  <Icon icon="profile" element="header" />
                  <Icon icon="basket" count={count} element="header" />
                </div>
              </div>
            </div>
          </Toolbar>
        </AppBar>

        {scroll && <div className="blockShadowPad" />}

        {isMenuOpen && menu && (
          <NavBarMobile {...menu} onClose={handleCloseMenu} />
        )}
      </>
    );
  }

  // Десктопная версия
  return (
    <>
      <AppBar className="site-header">
        <Toolbar>
          <div>
            <a className="site-header__logo" href="/">
              <img
                alt="Жако доставка роллов и пиццы"
                src="/Jaco-Logo-120.png"
              />
            </a>

            {MAIN_CATS_TOGLIATTI.map((item: CatItem) => (
              <MyCatLink
                key={item.id}
                children={item.name}
                arrow={item.cats && item.cats.length > 0}
                onClick={(e: MouseEvent<HTMLElement>) => openMenu(e, item.cats)}
              />
            ))}

            <a className="akcia" href="/promotions">
              <MyCatLink children="Акции" bordered={true} />
            </a>
          </div>
          <div>
            <a className="city" href="#">
              <MyCatLink children="Тольятти" />
            </a>
            <Icon icon="location" element="header" />
            <Icon icon="docs" element="header" />
            <Icon icon="profile" element="header" />
            <Icon icon="basket" count={count} element="header" />
          </div>
        </Toolbar>
      </AppBar>

      {scroll && <div className="blockShadow" />}

      <MyMenu
        list={currentSubCats}
        isOpen={isOpenCat}
        anchorEl={anchorEl}
        onClose={closeMenu}
        type="cat"
      />
    </>
  );
};
