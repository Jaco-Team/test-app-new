import React, { useState, useEffect } from 'react';

import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
//import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

//import JacoLogo from '@/public/Jaco-Logo-PC.png';
//import JacoLogo from '@/public/Jaco-Logo-120.png';
//Jaco-Logo-120.png
import {Filter, ArrowDownHeaderPC, ArrowUpHeaderPC, JacoDocsIcon, LocationHeaderIcon } from '@/ui/Icons.js';

import { Link as ScrollLink } from 'react-scroll';

import { useHeaderStore, useCartStore, useCitiesStore, useFooterStore, useHomeStore } from '@/components/store.js';
import useScroll from '../hook.js';

import BasketIconHeaderPC from '../basket/basketIconHeaderPC.js';
import ProfileIconHeaderPC from '../profile/profileIconHeaderPC.js';

const MenuBurger = React.memo(function MenuBurger({ anchorEl, city, isOpen, onClose }){
  const [links] = useFooterStore((state) => [state.links]);
  //const [ thisCityRu ] = useCitiesStore( state => [ state.thisCityRu ] );
  //const [ setActiveModalCity ] = useHeaderStore( state => [ state.setActiveModalCity ] );

  return(
    <Menu id='chooseHeaderCat' anchorEl={anchorEl} open={isOpen} onClose={ () => onClose() } anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top',  horizontal: 'center' }} autoFocus={false}>
         
      <MenuItem onClick={() => onClose()}>
        <Link href={`/${city}/about`}><span>О компании</span></Link>
      </MenuItem>
      
      <MenuItem onClick={() => onClose()}>
        <Link href={"/"+city+"/company-details"}><span>Реквизиты</span></Link>
      </MenuItem>

      <MenuItem onClick={() => onClose()}>
        <Link href={"/"+city+"/publichnaya-oferta"}><span>Публичная оферта</span></Link>
      </MenuItem>

      <MenuItem onClick={() => onClose()}>
        <Link href={"/"+city+"/politika-konfidencialnosti"}><span>Политика</span></Link>
      </MenuItem>

      <MenuItem onClick={() => onClose()}>
        <Link href={"/"+city+"/instpayorders"}><span>Правила оплаты</span></Link>
      </MenuItem>

      <MenuItem onClick={() => onClose()}>
        <Link href={links?.link_allergens ?? links} target="_blank"><span>Пищевая ценность</span></Link>
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
              offset={-70}
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

const MemoLogo = React.memo(function MemoLogo({city, activePage}){
  return(
    <>
      {activePage === 'home' ?
        <ScrollLink
          className="logoHeaderPC"
          to={'BannerPC'}
          spy={true}
          isDynamic={true}
          smooth={false}
          offset={-200}
        >
          <img alt="Жако доставка роллов и пиццы" src={'/Jaco-Logo-120.png'} />
        </ScrollLink>
          :
        <Link href={'/' + city} className="logoHeaderPC">
          <img alt="Жако доставка роллов и пиццы" src={'/Jaco-Logo-120.png'} />
        </Link>
      }
    </>
  )
})

export default React.memo(function NavBarPC({ city }) {
  useScroll();

  const router = useRouter()
  const pathname = usePathname()
  
  const [setActiveBasket, openBasket, setActiveModalCity, activePage] = useHeaderStore((state) => [state.setActiveBasket, state.openBasket, state.setActiveModalCity, state.activePage]);
  const [setThisCityRu, thisCityRu, setThisCity] = useCitiesStore((state) => [state.setThisCityRu, state.thisCityRu, state.setThisCity]);
  const [ getInfoPromo, getCartLocalStorage ] = useCartStore( state => [ state.getInfoPromo, state.getCartLocalStorage ])
  const [ category, setCategory, setActiveFilter, isOpenFilter ] = useHomeStore((state) => [ state.category, state.setCategory, state.setActiveFilter, state.isOpenFilter ]);

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

      if(sessionStorage.getItem('promo_name') && sessionStorage.getItem('promo_name').length > 0){
        getInfoPromo(sessionStorage.getItem('promo_name'), city)
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
    setIsOpenburger( false );
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

  const handleClose = () => {
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

  let activeProfile = false;
  let activeDoc = false;

  if( activePage == 'zakazy' || activePage == 'profile' || activePage == 'promokody' ){
    activeProfile = true;
  }else{
    if( activePage == 'home' || activePage == 'category' || activePage == 'cart' || activePage == 'akcii' || activePage == 'contacts' ){
      activeProfile = false;
      activeDoc = false;
    }else{
      activeProfile = false;
      activeDoc = true;
    }
  }

  return (
    <>
      <AppBar className="headerNew" id="headerNew" elevation={2} onClick={handleClose}>
        <Toolbar>
          <div>
            <MemoLogo city={city} activePage={activePage} />

            {category.map( (item, key) => 
              item.cats.length > 0 ?
                <div key={key} className={item?.expanded ? "headerCat activeCat" : 'headerCat'} onClick={(event) => openMenu(event, item.id)}>
                  <span>
                    {item.name} {item?.expanded ? <ArrowUpHeaderPC /> : <ArrowDownHeaderPC />}
                  </span>
                </div>
                  :
                  activePage === 'home' ?
                  <ScrollLink
                    key={key}
                    className={"headerCat "+ (key+1 == category.length ? 'last' : '') }
                    to={'cat' + item.id}
                    spy={true}
                    isDynamic={true}
                    smooth={false}
                    offset={-70}
                    //style={{marginRight: item.name === 'Пицца' ? 0 : '18.050541516245vw', width: item.name === 'Напитки' ? '7.2202166064982vw' : '5.7761732851986vw'}}
                  >
                    <span id={'link_' + item.id}>{item.name}</span> 
                  </ScrollLink>
                    :
                  <Link href={`/${city}`} onClick={() => chooseCat(item.id)} key={key} className={"headerCat "+ (key+1 == category.length ? 'last' : '') }>
                    <span>{item.name}</span>
                  </Link>
            )}

            <Link href={`/${city}/akcii`} className={"headerCat link " + (activePage === 'akcii'? 'activeCat' : '')}>
              <span>Акции</span>
            </Link>
          </div>

          <div>
            
            <div className={'chooseCity'} onClick={ () => setActiveModalCity(true) }>
              {thisCityRu}
            </div>

            {activePage === 'home' ?
              <div className={isOpenFilter ? 'filterHeaderPC active' : 'filterHeaderPC'} onClick={() => setActiveFilter(!isOpenFilter)}>
                <Filter className='filter_svg' />
              </div>
              : null
            }

            <Link href={'/' + city + '/contacts'}  className={activePage === 'contacts' ? 'mapHeaderPC active' : 'mapHeaderPC'}>
              <LocationHeaderIcon className='map_svg' />
            </Link>
            
            <div className={'burgerHeaderPC '+(activeDoc ? 'active' : '')} onClick={ (event) => openMenuBurger(event) }>
              <JacoDocsIcon className='burger_svg'/>
            </div>

            <ProfileIconHeaderPC activeProfile={activeProfile} />

            <BasketIconHeaderPC />

            <MenuCat anchorEl={anchorEl} isOpen={isOpenCat} onClose={closeMenu} chooseCat={chooseCat} city={city} list={list} active_page={activePage} />
            <MenuBurger anchorEl={anchorEl} isOpen={isOpenburger} onClose={closeMenuBurger} city={city} />
          </div>
        </Toolbar>
      </AppBar>
      <div className='blockShadow' />
    </>
  );
})
