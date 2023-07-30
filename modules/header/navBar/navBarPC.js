import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import JacoLogo from '@/public/Jaco-Logo-PC.png';
import { shallow } from 'zustand/shallow';

import {MapPointIcon, ArrowDownHeaderPC, ArrowUpHeaderPC, BurgerIconPC } from '@/ui/Icons.js';

import { Link as ScrollLink } from 'react-scroll';

import { useHeaderStore, useCartStore, useCitiesStore } from '@/components/store.js';
import useScroll from '../hook.js';

import BasketIconHeaderPC from '../basket/basketIconHeaderPC.js';
import ProfileIconHeaderPC from '../profile/profileIconHeaderPC.js';

let catList = [{id: '1', name: 'Роллы', link: 'rolly', count_2: '107', count: '0', list: [{id: '1', name: 'Сеты роллов'}, { id: '2', name: 'Фирменные' }, {id: '3', name: 'Жареные'}, 
{id: '4', name: 'Запеченные'}, {id: '5', name: 'Классика'}]}, {id: '14', name: 'Пицца', link: 'pizza', count_2: '0', count: '12'}, {id: '15', name: 'Блюда', link: null, count_2: '0',
count: '4', list: [{id: '5', name: 'Закуски', link: 'zakuski', count_2: '0', count: '9'}, {id: '7', name: 'Соусы', link: 'sousy', count_2: '0', count: '9'}, {id: '1', name: 'Салаты и фри', link: 'salat'}, {id: '2', name: 'Десерты', link: 'desert'}]}, {id: '6', name: 'Напитки', link: 'napitki', count_2: '0', count: '10'}];

const MenuBurger = React.memo(function MenuBurger({ anchorEl, city, isOpen, onClose }){
  return(
    <Menu id='chooseHeaderCat' anchorEl={anchorEl} open={isOpen} onClose={ () => onClose() } anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top',  horizontal: 'center' }} autoFocus={false}>
         
      <MenuItem onClick={() => onClose()}>
        <Link href={`/${city}/about`}><span>О компании</span></Link>
      </MenuItem>
      
      <MenuItem onClick={() => onClose()}>
        <Link href={`/${city}`}><span>Документы</span></Link>
      </MenuItem>
      
    </Menu>
  )
})

const MenuCat = React.memo(function MenuCat({ anchorEl, city, isOpen, onClose, chooseCat, list, active_page }){
  return(
    <Menu id='chooseHeaderCat' anchorEl={anchorEl} open={isOpen} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top',  horizontal: 'center' }} autoFocus={false}>
      {list.map((cat, key) => (
        <MenuItem key={key}>
          {active_page === 'home' ? (
            <ScrollLink
              to={'cat' + cat.id}
              spy={true}
              isDynamic={true}
              smooth={false}
              offset={-100}
              onClick={onClose}
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

export default function NavBarPC({ city, active_page }) {
  useScroll();

  const { push } = useRouter();
  
  const [setActiveBasket, openBasket, setActiveModalCity] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket, state.setActiveModalCity], shallow);
  const [setThisCityRu, thisCityRu] = useCitiesStore((state) => [state.setThisCityRu, state.thisCityRu], shallow);
  const [ getInfoPromo ] = useCartStore( state => [ state.getInfoPromo ], shallow )

  if (city == '') return null;

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenburger, setIsOpenburger] = useState(false);
  const [isOpenCat, setIsOpenCat] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {

      if (localStorage.getItem('setCity') && localStorage.getItem('setCity').length > 0) {
        const city = JSON.parse(localStorage.getItem('setCity'));

        if (city.name !== thisCityRu) {
          setThisCityRu(city.name);

          //push(`/${city.link}`);
        }
        
      } else {
        setActiveModalCity(true);
      }

      if( localStorage.getItem('promo_name') ){
        getInfoPromo(localStorage.getItem('promo_name'), city)
      }

    }
  }, []);

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
      <AppBar className="headerNew" id="headerNew" elevation={2} sx={{ display: { xs: 'none', md: 'block' } }} onClick={closeBasket}>
        <Toolbar>
          <div>
            <Link href={'/' + city} className="logoHeaderPC">
              <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={500} height={120} priority={true}/>
            </Link>

            {catList.map((item, key) =>
              item.name === 'Пицца' || item.name === 'Напитки' ? (
                active_page === 'home' ? 
                  <ScrollLink
                    key={key}
                    className={"headerCat "+ (key+1 == catList.length ? 'last' : '') }
                    to={'cat' + item.id}
                    spy={true}
                    isDynamic={true}
                    smooth={false}
                    offset={-100}
                    //style={{marginRight: item.name === 'Пицца' ? 0 : '18.050541516245vw', width: item.name === 'Напитки' ? '7.2202166064982vw' : '5.7761732851986vw'}}
                  >
                    <span id={'link_' + item.id}>{item.name}</span> 
                  </ScrollLink>
                  :
                  <Link href={`/${city}`} onClick={() => chooseCat(item.id)} key={key} className={"headerCat "+ (key+1 == catList.length ? 'last' : '') }
                    //style={{marginRight: item.name === 'Пицца' ? 0 : '18.050541516245vw', width: item.name === 'Напитки' ? '7.2202166064982vw' : '5.7761732851986vw'}}
                  >
                    <span>{item.name}</span>
                  </Link>
                  
              ) : (
                  <React.Fragment key={key}>
                    <div className={item?.expanded ? item.expanded ? "headerCat activeCat" : 'headerCat' : 'headerCat'} onClick={(event) => openMenu(event, item.id)} 
                      //style={{ marginRight: '1.4440433212996vw'}}
                    >
                      <span>
                        {item.name} {item?.expanded ? item.expanded ? <ArrowUpHeaderPC /> : <ArrowDownHeaderPC /> : <ArrowDownHeaderPC />}
                      </span>
                    </div>
                  </React.Fragment>
                )
              )
            }
          </div>

          <div>
            <div className={active_page === 'other' || isOpenburger ? 'burgerHeaderPC activeCatSvg' : 'burgerHeaderPC'} onClick={ (event) => openMenuBurger(event) }>
              <BurgerIconPC />
            </div>

            <Link href={'/' + city + '/contacts'}  className={active_page === 'contacts' ? 'mapHeaderPC activeCatMap' : 'mapHeaderPC'}>
              <MapPointIcon />
              <p>Адреса кафе</p>
            </Link>
            
            <ProfileIconHeaderPC />

            <BasketIconHeaderPC />

            <MenuCat anchorEl={anchorEl} isOpen={isOpenCat} onClose={closeMenu} chooseCat={chooseCat} city={city} list={list} active_page={active_page} />
            <MenuBurger anchorEl={anchorEl} isOpen={isOpenburger} onClose={closeMenuBurger} city={city} />
          </div>
        </Toolbar>
      </AppBar>
      <div className='blockShadow' />
    </>
  );
}
