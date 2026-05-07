import React, { useState, MouseEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { MyCatLink } from '../../shared/MyTextLink/MyCatLink';
import { IconPC } from '../../shared/IconPC/IconPC';
import { MyMenu } from '../../shared/MyMenu/MyMenu';
import { BurgerIconMobile } from '../../shared/Icons.js';
import headerData from '../../fixtures/header.togliatti.json';
import './HeaderPad.scss';

interface SubCatItem {
  id: string;
  name: string;
  link: string;
}

interface CatItem {
  id: string;
  name: string;
  cats: SubCatItem[];
}

interface HeaderPadProps {
  scroll?: boolean;
  count: string;
  activeMenu?: boolean;
  onMenuToggle?: () => void;
}

const MAIN_CATS_TOGLIATTI: CatItem[] = headerData.main_cat;

export const HeaderPad: React.FC<HeaderPadProps> = ({
  scroll = false,
  count = '0',
  activeMenu = false,
  onMenuToggle
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isOpenCat, setIsOpenCat] = useState<boolean>(false);
  const [currentSubCats, setCurrentSubCats] = useState<SubCatItem[]>([]);

  const openMenu = (event: MouseEvent<HTMLElement>, cats: SubCatItem[]): void => {
    setAnchorEl(event.currentTarget);
    setCurrentSubCats(cats);
    setIsOpenCat(true);
  };

  const closeMenu = (): void => {
    setAnchorEl(null);
    setIsOpenCat(false);
    setCurrentSubCats([]);
  };

  const handleBurgerClick = (): void => {
    onMenuToggle?.();
  };

  return (
    <>
      <AppBar className="HeaderPad">
        <Toolbar>
          <div className="header-container">
            <div className="left-section">
              <a className="logoPad">
                <img
                  alt="Жако доставка роллов и пиццы"
                  src="/Jaco-Logo-120.png"
                />
              </a>

              <div className="categories">
                {MAIN_CATS_TOGLIATTI.map((item: CatItem) => (
                  <MyCatLink
                    key={item.id}
                    children={item.name}
                    arrow={item.cats && item.cats.length > 0}
                    onClick={(e: MouseEvent<HTMLElement>) => openMenu(e, item.cats)}
                  />
                ))}
              </div>
            </div>

            <div className="right-section">
              <div className="burger-menu" onClick={handleBurgerClick}>
                <BurgerIconMobile className={activeMenu ? 'burgerActive' : undefined} />
              </div>

              <div className="icons-group">
                <div className="city-wrapper">
                  <a className="city">
                    <MyCatLink children="Тольятти" />
                  </a>
                  <IconPC icon="location" element="header" />
                </div>
                <IconPC icon="docs" element="header" />
                <IconPC icon="profile" element="header" />
                <IconPC icon="basket" count={count} element="header" />
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      {scroll && <div className="blockShadowPad" />}

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
