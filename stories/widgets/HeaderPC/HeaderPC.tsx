import React, { useState, MouseEvent } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import './HeaderPC.scss';
import { MyCatLink } from '../../shared/MyTextLink/MyCatLink';
import { IconPC } from '../../shared/IconPC/IconPC';
import { MyMenu } from '../../shared/MyMenu/MyMenu';
import headerData from '../../fixtures/header.togliatti.json';

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

interface HeaderPCProps {
  scroll?: boolean;
  count: string;
}

const MAIN_CATS_TOGLIATTI: CatItem[] = headerData.main_cat;

export const HeaderPC: React.FC<HeaderPCProps> = ({ scroll, count }) => {
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

  return (
    <>
      <AppBar className={['HeaderPC'].join(' ')}>
        <Toolbar>
          <div>
            <a className="logoPC">
              <img alt="Жако доставка роллов и пиццы" src={'/Jaco-Logo-120.png'} />
            </a>

            {MAIN_CATS_TOGLIATTI.map((item: CatItem) => (
              <MyCatLink
                key={item.id}
                children={item.name}
                arrow={item.cats && item.cats.length > 0}
                onClick={(e: MouseEvent<HTMLElement>) => openMenu(e, item.cats)}
              />
            ))}

            <a className="akcia">
              <MyCatLink children="Акции" bordered={true} />
            </a>
          </div>
          <div>
            <a className="city">
              <MyCatLink children="Тольятти" />
            </a>
            <IconPC icon="location" element="header" />
            <IconPC icon="docs" element="header" />
            <IconPC icon="profile" element="header" />
            <IconPC icon="basket" count={count} element="header" />
          </div>
        </Toolbar>
      </AppBar>
      {scroll ? <div className="blockShadow" /> : null}

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
