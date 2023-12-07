import React, { useState, useEffect } from 'react';

import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import JacoLogo from '@/public/Jaco-Logo-PC.png';

import {MapPointIcon, ArrowDownHeaderPC, ArrowUpHeaderPC, BurgerIconPC } from '@/ui/Icons.js';

import { Link as ScrollLink } from 'react-scroll';

import { useHeaderStore, useCartStore, useCitiesStore, useFooterStore, useHomeStore } from '@/components/store.js';
import useScroll from '../hook.js';

import BasketIconHeaderPC from '../basket/basketIconHeaderPC.js';
import ProfileIconHeaderPC from '../profile/profileIconHeaderPC.js';

let catList = [{id: '1', name: 'Роллы', link: 'rolly', count_2: '107', count: '0', list: [{id: '1', name: 'Сеты роллов'}, { id: '2', name: 'Фирменные' }, {id: '3', name: 'Жареные'}, 
{id: '4', name: 'Запеченные'}, {id: '5', name: 'Классика'}]}, {id: '14', name: 'Пицца', link: 'pizza', count_2: '0', count: '12'}, {id: '15', name: 'Блюда', link: null, count_2: '0',
count: '4', list: [{id: '5', name: 'Закуски', link: 'zakuski', count_2: '0', count: '9'}, {id: '7', name: 'Соусы', link: 'sousy', count_2: '0', count: '9'}, {id: '1', name: 'Салаты и фри', link: 'salat'}, {id: '2', name: 'Десерты', link: 'desert'}]}, {id: '6', name: 'Напитки', link: 'napitki', count_2: '0', count: '10'}];

const MenuBurger = React.memo(function MenuBurger({ anchorEl, city, isOpen, onClose }){
  const [links] = useFooterStore((state) => [state.links]);
  return(
    <Menu id='chooseHeaderCat' anchorEl={anchorEl} open={isOpen} onClose={ () => onClose() } anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top',  horizontal: 'center' }} autoFocus={false}>
         
      <MenuItem onClick={() => onClose()}>
        <Link href={`/${city}/about`}><span>О компании</span></Link>
      </MenuItem>
      
      <MenuItem onClick={() => onClose()}>
        <Link href={"/"+city+"/publichnaya-oferta"}><span>Публичная оферта</span></Link>
      </MenuItem>

      <MenuItem onClick={() => onClose()}>
        <Link href={"/"+city+"/politika-konfidencialnosti"}><span>Политика конфиденциальности</span></Link>
      </MenuItem>

      <MenuItem onClick={() => onClose()}>
        <Link href={"/"+city+"/instpayorders"}><span>Правила оплаты</span></Link>
      </MenuItem>

      <MenuItem onClick={() => onClose()}>
        <Link href={"/"+city+"/legal"}><span>Согласие на обработку персональных данных</span></Link>
      </MenuItem>

      <MenuItem onClick={() => onClose()}>
        <Link href={links?.link_allergens ?? links} target="_blank"><span>Калорийность, состав, БЖУ</span></Link>
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
              offset={-140}
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

  const router = useRouter()
  const pathname = usePathname()
  
  const [setActiveBasket, openBasket, setActiveModalCity, activePage] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket, state.setActiveModalCity, state.activePage]);
  const [setThisCityRu, thisCityRu, setThisCity] = useCitiesStore((state) => [state.setThisCityRu, state.thisCityRu, state.setThisCity]);
  const [ getInfoPromo, getCartLocalStorage ] = useCartStore( state => [ state.getInfoPromo, state.getCartLocalStorage ])
  const [ category, setCategory ] = useHomeStore((state) => [ state.category, state.setCategory ]);

  if (city == '') return null;

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenburger, setIsOpenburger] = useState(false);
  const [isOpenCat, setIsOpenCat] = useState(false);
  const [list, setList] = useState([]);
 
  useEffect(() => {
    if (typeof window !== "undefined") {

      if (localStorage.getItem('setCity') && localStorage.getItem('setCity').length > 0) {
        const city_ = JSON.parse(localStorage.getItem('setCity'));

        if (city_.link !== city && city != '') {
          setThisCityRu(city_.name);
          setThisCity(city_.link);

          const new_link = pathname.replace(new RegExp(city, 'g'), city_.link);

          router.push(`${new_link}`, { scroll: true });

          setTimeout( () => {
            router.refresh();
          }, 500 ) 
        }
      } else {
        setActiveModalCity(true);
      }

      if( localStorage.getItem('promo_name') ){
        getInfoPromo(localStorage.getItem('promo_name'), city)
      }

      getCartLocalStorage();
    }
  }, []);

  const openMenu = (event, id) => {
    setIsOpenCat(true)
    setAnchorEl(event.currentTarget);
    category.forEach((cat) => {
      if( parseInt(cat.id) === parseInt(id) ) {
        cat.expanded = anchorEl ? false : true;
        setList(cat.cats);
      }
    });

    setCategory(category);
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
    category.forEach((cat) => {
      if (cat.expanded) {
        cat.expanded = false;
      }
    });
    setList([]);
    setIsOpenCat(false);

    setCategory(category);
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

  /*
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
  */


  return (
    <>
      <AppBar className="headerNew" id="headerNew" elevation={2} sx={{ display: { xs: 'none', md: 'none', lg: 'block' } }} onClick={closeBasket}>
        <Toolbar>
          <div>
            <Link href={'/' + city} className="logoHeaderPC">
              <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={500} height={120} priority={true}/>
            </Link>

            {category.map( (item, key) => 
              item.cats.length > 0 ?
                <div key={key} className={item?.expanded ? "headerCat activeCat" : 'headerCat'} onClick={(event) => openMenu(event, item.id)}>
                  <span>
                    {item.name} {item?.expanded ? <ArrowUpHeaderPC /> : <ArrowDownHeaderPC />}
                  </span>
                </div>
                  :
                active_page === 'home' ?
                  <ScrollLink
                    key={key}
                    className={"headerCat "+ (key+1 == category.length ? 'last' : '') }
                    to={'cat' + item.id}
                    spy={true}
                    isDynamic={true}
                    smooth={false}
                    offset={-140}
                    //style={{marginRight: item.name === 'Пицца' ? 0 : '18.050541516245vw', width: item.name === 'Напитки' ? '7.2202166064982vw' : '5.7761732851986vw'}}
                  >
                    <span id={'link_' + item.id}>{item.name}</span> 
                  </ScrollLink>
                    :
                  <Link href={`/${city}`} onClick={() => chooseCat(item.id)} key={key} className={"headerCat "+ (key+1 == category.length ? 'last' : '') }>
                    <span>{item.name}</span>
                  </Link>
            )}
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
