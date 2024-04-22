import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import './HeaderPC.scss';
import { MyCatLink } from '../MyTextLink/MyCatLink';
import { IconPC } from '../IconPC/IconPC';
import { MyMenu } from '../MyMenu/MyMenu';

const category = [{link: 'https://example.com', title: 'Сеты'}, {link: 'https://example.com', title: 'Фирменные роллы'}, {link: 'https://example.com', title: 'Жаренные роллы'}, {link: 'https://example.com', title: 'Запеченные роллы'}];

export const HeaderPC = ({ scroll, count }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenCat, setIsOpenCat] = useState(false);

  function openMenu(event) {
    setAnchorEl(event.currentTarget);
    setIsOpenCat(true);
  }

  function closeMenu() {
    setAnchorEl(null);
    setIsOpenCat(false);
  }

  return (
    <>
      <AppBar className={['HeaderPC'].join(' ')}>
        <Toolbar>
          <div>
            <a className="logoPC">
              <img alt="Жако доставка роллов и пиццы" src={'/Jaco-Logo-120.png'} />
            </a>

            <MyCatLink children={'Роллы'} arrow={true} onClick={openMenu} />
            <MyCatLink children={'Пицца'} arrow={false} />
            <MyCatLink children={'Блюда'} arrow={true} onClick={openMenu} />
            <MyCatLink children={'Напитки'} arrow={false} />

            <a className="akcia">
              <MyCatLink children="Акции" bordered={true} />
            </a>
          </div>
          <div>
            <a className="city">
              <MyCatLink children="Тольятти" />
            </a>
            <IconPC icon="location" element='header' />
            <IconPC icon="docs" element='header' />
            <IconPC icon="profile" element='header' />
            <IconPC icon="basket" count={count} element='header' />
          </div>
        </Toolbar>
      </AppBar>
      {scroll ? <div className="blockShadow" /> : null}

      <MyMenu list={category} isOpen={isOpenCat} anchorEl={anchorEl} onClose={closeMenu} type='cat' />
    </>
  );
};

HeaderPC.propTypes = {
  scroll: PropTypes.bool,
  count: PropTypes.string.isRequired,
};
