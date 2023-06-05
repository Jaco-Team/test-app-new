import React, { useState } from 'react';

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

import {BurgerIcon, MapPointIcon, ProfileIcon } from '@/ui/Icons.js';

import { Link as ScrollLink } from 'react-scroll';

import { useHeaderStore } from '@/components/store.js';
import useScroll from './hook.js';

import BasketIconHeaderPC from './basket/basketIconHeaderPC.js';

let catList = [{id: '1', name: 'Роллы', link: 'rolly', count_2: '107', count: '0', list: [{id: '1', name: 'Сеты роллов'}, { id: '2', name: 'Фирменные' }, {id: '3', name: 'Жареные'}, 
{id: '4', name: 'Запеченные'}, {id: '5', name: 'Классика'}]}, {id: '14', name: 'Пицца', link: 'pizza', count_2: '0', count: '12'}, {id: '15', name: 'Блюда', link: null, count_2: '0',
count: '4', list: [{id: '5', name: 'Закуски', link: 'zakuski', count_2: '0', count: '9'}, {id: '7', name: 'Соусы', link: 'sousy', count_2: '0', count: '9'}, {id: '1', name: 'Салаты и фри', link: 'salat'}, {id: '2', name: 'Десерты', link: 'desert'}]}, {id: '6', name: 'Напитки', link: 'napitki', count_2: '0', count: '10'}];

const MenuBurger = React.memo(function MenuBurger({ anchorEl, city, isOpen, onClose }){
  return(
    <Menu id={'chooseHeaderDoc'} anchorEl={anchorEl} open={isOpen} onClose={ () => onClose() } anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top',  horizontal: 'center' }} autoFocus={false}>
         
      <MenuItem onClick={() => onClose()}>
        <Link href={`/${city}/about`}>О компании</Link>
      </MenuItem>
      
      <MenuItem onClick={() => onClose()}>
        <Link href={`/${city}`}>Документы</Link>
      </MenuItem>
      
    </Menu>
  )
})

const MenuCat = React.memo(function MenuCat({ anchorEl, city, isOpen, onClose, chooseCat, list, active_page }){
  return(
    <Menu id={'chooseHeaderCat'} anchorEl={anchorEl} open={isOpen} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top',  horizontal: 'center' }} autoFocus={false}>
      {list.map((cat, key) => (
        <MenuItem key={key} onClick={onClose}>
          {active_page === 'home' ? (
            <ScrollLink
              to={'cat' + cat.id}
              spy={true}
              isDynamic={true}
              smooth={false}
              offset={-100}
            >
              <span id={'link_' + cat.id}>{cat.name}</span>
            </ScrollLink>
          ) : (
            <Link href={`/${city}`} onClick={() => chooseCat(cat.id)}>
              <span>{cat.name}</span>
            </Link>
          )}
        </MenuItem>
      ))}
    </Menu>
  )
})

export default function NavBarPC(props) {
  console.log('NavBarPC render');

  useScroll();

  const { city, cityRu, active_page } = props;
  
  const [setActiveModalCity, setActiveModalAuth, setActiveBasket, openBasket] = useHeaderStore((state) => [state.setActiveModalCity, state.setActiveModalAuth, state.setActiveBasket, state.openBasket], shallow);

  if (city == '') return null;

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenburger, setIsOpenburger] = useState(false);
  const [isOpenCat, setIsOpenCat] = useState(false);
  const [list, setList] = useState([]);

  const openMenu = (event, id) => {
    setIsOpenCat(true)
    setAnchorEl(event.currentTarget);
    catList.forEach((cat) => {
      if (cat.id === id) {
        cat.expanded = anchorEl ? false : true;
        setList(cat.list);
      }
    });
  };

  function openMenuBurger(event){
    setAnchorEl(event.currentTarget);
    setIsOpenburger( true )
  }

  function closeMenuBurger(){
    setIsOpenburger( false )
  }

  const closeMenu = () => {
    setAnchorEl(null);
    catList.forEach((cat) => {
      if (cat.expanded) {
        cat.expanded = false;
      }
    });
    setList([]);
    setIsOpenCat(false)
  };

  function chooseCat(id){
    localStorage.setItem('goTo', id)

    closeMenu();
  }

  const closeBasket = () => {
    if(openBasket) {
      setActiveBasket(false);
    }
  }

  return (
    <>
      <AppBar position="fixed" className="headerNew" id="headerNew" elevation={2} sx={{ display: { xs: 'none', md: 'block' } }} onClick={closeBasket}>
        <Toolbar>
          <div style={{ width: '5.3%' }} />
          <Link href={'/' + city} style={{ width: '18.4%' }}>
            <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true}/>
          </Link>

          <div style={{width: '7%', minWidth: 'max-content'}} onClick={() => setActiveModalCity(true)}>
            <span className='headerCat'>{cityRu}</span>
          </div>

          <div style={{ width: '2.2%' }} />

          { catList.map((item, key) =>
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
                  <div style={{ width: '2.2%' }} />
                </React.Fragment>
              ) : (
                <React.Fragment key={key}>
                  <div style={{width: '5%', minWidth: 'max-content', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onClick={(event) => openMenu(event, item.id)}>
                    <span className="headerCat">
                      {item.name} {item.expanded ? item.expanded ? <KeyboardArrowUpIcon style={{ fill: '#525252', paddingTop: 3 }} /> : <KeyboardArrowDownIcon style={{ fill: '#525252', paddingTop: 3 }} /> : <KeyboardArrowDownIcon style={{ fill: '#525252', paddingTop: 3 }} />}
                    </span>
                  </div>
                  <div style={{ width: '2.2%' }} />
                </React.Fragment>
              )
            )
          }

          <div style={{ width: '7%' }} />

          <div style={{ width: '2.5%' }} className={active_page === 'other' ? 'headerCat activeCat' : 'headerCat'} onClick={ (event) => openMenuBurger(event) }>
            <BurgerIcon style={{ width: '2vw', height: '2vw' }}/>
          </div>

          <div style={{ width: '2.2%' }} />

          <Link href={'/' + city + '/contacts'} style={{ width: '12%' }} className={active_page === 'contacts' ? 'headerCat activeCat' : 'headerCat'}>
            <MapPointIcon style={{ width: '2vw', height: '2vw' }}/>
            <p>Адреса кафе</p>
          </Link>

          <div style={{ width: '2.2%' }} />

          
          <div href={'/' + city + '/zakazy'} style={{ width: '3.5%' }} className={active_page === 'profile' ? 'headerCat activeCat' : 'headerCat'} onClick={ () => setActiveModalAuth(true) }>
            <ProfileIcon style={{ width: '4vw', height: '4vw' }}/>
          </div>
          
          <div style={{ width: '2.2%' }} />

          <BasketIconHeaderPC />

          <div style={{ width: '5.3%' }} />

          <MenuCat anchorEl={anchorEl} isOpen={isOpenCat} onClose={closeMenu} chooseCat={chooseCat} city={city} list={list} active_page={active_page} />
          <MenuBurger anchorEl={anchorEl} isOpen={isOpenburger} onClose={closeMenuBurger} city={city} />

          
        </Toolbar>
      </AppBar>
      <div className='blockShadow' />
    </>
  );
}
