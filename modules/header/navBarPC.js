import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import JacoLogo from '@/public/jaco-logo.png';
import { shallow } from 'zustand/shallow';

import {BurgerIcon, MapPointIcon, ProfileIcon, BasketIcon } from '@/ui/Icons.js';

import { Link as ScrollLink } from 'react-scroll';

import { useHeaderStore } from '@/components/store.js';

let catList = [{id: '1', name: 'Роллы', link: 'rolly', count_2: '107', count: '0', list: [{id: '1', name: 'Сеты роллов'}, { id: '2', name: 'Фирменные' }, {id: '3', name: 'Жареные'}, 
{id: '4', name: 'Запеченные'}, {id: '5', name: 'Классика'}]}, {id: '14', name: 'Пицца', link: 'pizza', count_2: '0', count: '12'}, {id: '15', name: 'Блюда', link: null, count_2: '0',
count: '4', list: [{id: '5', name: 'Закуски', link: 'zakuski', count_2: '0', count: '9'}, {id: '7', name: 'Соусы', link: 'sousy', count_2: '0', count: '9'}, {id: '1', name: 'Салаты и фри', link: 'salat'}, {id: '2', name: 'Десерты', link: 'desert'}]}, {id: '6', name: 'Напитки', link: 'napitki', count_2: '0', count: '10'}];

const burger = [{id: '1', name: 'О компании', link: 'about'}, {id: '2', name: 'Документы', link: ''}];

export default function NavBarPC(props) {
  const { push } = useRouter();

  /// const { city, cityRu, catList, active_page } = props;
  const { city, cityRu, active_page } = props;

  const [setActiveModalCity, setActiveModalAuth] = useHeaderStore((state) => [state.setActiveModalCity, state.setActiveModalAuth], shallow);

  if (city == '') return null;

  const [anchorEl, setAnchorEl] = useState(null);
  const [list, setList] = useState([]);
  const [scroll, setScroll] = useState(false);

  const open = Boolean(anchorEl);

  const openMenu = (event, id) => {
    if (id === 'burger') {
      setScroll(false);
      setList(burger);
      setAnchorEl(event.currentTarget);
    } else {
      setScroll(true);
      setAnchorEl(event.currentTarget);
      catList.forEach((cat) => {
        if (cat.id === id) {
          cat.expanded = anchorEl ? false : true;
          setList(cat.list);
        }
      });
    }
  };

  const closeMenu = () => {
    setAnchorEl(null);
    catList.forEach((cat) => {
      if (cat.expanded) {
        cat.expanded = false;
      }
    });
    setScroll(false);
    setList([]);
  };

  const onProfile = () => {
    push(`/${city}/profile`);
    setActiveModalAuth(true);
  }

  return (
    <AppBar position="fixed" className="headerNew" id="headerNew" elevation={2} sx={{ display: { xs: 'none', md: 'block' } }}>
      <Toolbar>
        <div style={{ width: '4.51%' }} />
        <Link href={'/' + city} style={{ width: '14.8%' }}>
          <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true}/>
        </Link>

        <div style={{width: '7%', minWidth: 'max-content'}} onClick={() => setActiveModalCity(true)}>
          <span className='headerCat'>{cityRu}</span>
        </div>

        {active_page == 'home'
          ? catList.map((item, key) =>
              item.name === 'Пицца' || item.name === 'Напитки' ? (
                <React.Fragment key={key}>
                  <ScrollLink style={{width: '5%', minWidth: 'max-content', textDecoration: 'none'}}
                    to={'cat' + item.id}
                    spy={true}
                    isDynamic={true}
                    smooth={false}
                    offset={-100}
                  >
                    <span className="headerCat" id={'link_' + item.id}>{item.name}</span>
                  </ScrollLink>
                </React.Fragment>
              ) : (
                <React.Fragment key={key}>
                  <div style={{width: '5%', minWidth: 'max-content'}} onClick={(event) => openMenu(event, item.id)}>
                    <span className="headerCat" style={{ color: item.expanded ? item.expanded ? '#dd1a32' : null : null }}>
                      {item.name} {item.expanded ? item.expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> : <KeyboardArrowDownIcon />}
                    </span>
                  </div>
                </React.Fragment>
              )
            )
          : catList.map((item, key) => (
              <React.Fragment key={key}>
                <Link href={'/' + city} style={{width: '5%', minWidth: 'max-content', textDecoration: 'none'}}
                  onClick={() => {typeof window !== 'undefined' ? localStorage.setItem('goTo', item.id) : {}}}>
                  <span className='headerCat'>{item.name}</span>
                </Link>
              </React.Fragment>
            ))}

        <div style={{ width: '20%' }} />

        <div style={{ width: '2.5%' }} className={active_page === 'other' ? 'headerCat activeCat' : 'headerCat'} onClick={(event) => openMenu(event, 'burger')}>
          <BurgerIcon style={{ width: 40, height: 20 }}/>
        </div>

        <div style={{ width: '1%' }} />

        <div style={{ width: '10%' }} className='headerCat'>
          <MapPointIcon style={{ width: 40, height: 30 }}/>
          <p>Адреса кафе</p>
        </div>

        <div style={{ width: '1.5%' }} />

        <div style={{ width: '2.5%' }} className={active_page === 'profile' ? 'headerCat activeCat' : 'headerCat'} onClick={onProfile}>
          <ProfileIcon style={{ height: 80 }}/>
        </div>

        <div style={{ width: '1%' }} />

        <div style={{width: '100px', backgroundColor: '#DD1A32', borderRadius: '45px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
          <BasketIcon style={{ width: 30, height: 18 }}/>
        </div>

        <Menu id={'chooseHeaderCat'} anchorEl={anchorEl} open={open} onClose={closeMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top',  horizontal: 'center' }} autoFocus={false}>
          {list.map((cat, key) => (
            <MenuItem key={key} onClick={closeMenu}>
              {scroll ? (
                <ScrollLink
                  to={'cat' + cat.id}
                  spy={true}
                  isDynamic={true}
                  smooth={false}
                  offset={-100}
                  onClick={closeMenu}
                >
                  <span id={'link_' + cat.id}>{cat.name}</span>
                </ScrollLink>
              ) : (
                <Link href={`/${city}/${cat.link}`} onClick={closeMenu}>
                  <span>{cat.name}</span>
                </Link>
              )}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
