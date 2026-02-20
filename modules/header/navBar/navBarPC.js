import React, { useState, useEffect } from 'react';

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import {ArrowDownHeaderPC, ArrowUpHeaderPC, JacoDocsIcon, LocationHeaderIcon, SvgLogo } from '@/ui/Icons.js';

import { Link as ScrollLink } from 'react-scroll';

import { useHeaderStoreNew, useCartStore, useCitiesStore, useFooterStore, useHomeStore, useProfileStore } from '@/components/store.js';
import useScroll from '../hook.js';

import BasketIconHeaderPC from '../basket/basketIconHeaderPC.js';
import ProfileIconHeaderPC from '../profile/profileIconHeaderPC.js';

import Cookies from 'js-cookie'

import { reachGoal } from '@/utils/metrika';

const MenuBurger = React.memo(function MenuBurger({ anchorEl, city, isOpen, onClose, goToPage }){
  const [links] = useFooterStore((state) => [state.links]);
  //const [ thisCityRu ] = useCitiesStore( state => [ state.thisCityRu ] );
  //const [ setActiveModalCity ] = useHeaderStoreNew( state => [ state.setActiveModalCity ] );

  const navigate = (page) => {
    goToPage(page)
    onClose();
  };

  return(
    <Menu id='chooseHeaderCat' anchorEl={anchorEl} open={isOpen} onClose={ () => onClose() } anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top',  horizontal: 'center' }} autoFocus={false}>
         
      <MenuItem onClick={() => navigate('О компании') }>
        <Link href={`/${city}/about`}><span>О компании</span></Link>
      </MenuItem>
      
      <MenuItem onClick={() => navigate('Реквизиты')}>
        <Link href={"/"+city+"/company-details"}><span>Реквизиты</span></Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Публичная оферта')}>
        <Link href={"/"+city+"/publichnaya-oferta"}><span>Публичная оферта</span></Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Политика')}>
        <Link href={"/"+city+"/politika-konfidencialnosti"}><span>Политика</span></Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Правила оплаты')}>
        <Link href={"/"+city+"/instpayorders"}><span>Правила оплаты</span></Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Пищевая ценность')}>
        <Link href={links?.link_allergens ?? links} target="_blank"><span>Пищевая ценность</span></Link>
      </MenuItem>
      
    </Menu>
  )
})

const MenuCat = React.memo(function MenuCat({ anchorEl, city, isOpen, onClose, chooseCat, list, active_page }){

  const thisChooseCat = (name, id) => {
    chooseCat(name, id)
    onClose();
  }

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
              onClick={ () => thisChooseCat(cat.name, cat.id) }
            >
              <span id={'link_' + cat.id}>{cat.name}</span>
            </ScrollLink>
          ) : (
            <Link href={`/${city}`} onClick={() => chooseCat(cat.name, cat.id)}>
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
          <SvgLogo />
        </ScrollLink>
          :
        <Link href={'/' + city} className="logoHeaderPC">
          <SvgLogo />
        </Link>
      }
    </>
  )
})

export default React.memo(function NavBarPC({ city }) {
  useScroll();

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams();

  const search_category = searchParams.get('category')
  
  const [setActiveBasket, openBasket, setActiveModalCity, activePage, isAuth] = useHeaderStoreNew((state) => [state?.setActiveBasket, state?.openBasket, state?.setActiveModalCity, state?.activePage, state.isAuth]);
  const [setThisCityRu, thisCityRu, setThisCity] = useCitiesStore((state) => [state.setThisCityRu, state.thisCityRu, state.setThisCity]);
  const [ getInfoPromo, getCartLocalStorage ] = useCartStore( state => [ state.getInfoPromo, state.getCartLocalStorage ])
  const [ category, setCategory, setActiveFilter, isOpenFilter, resetFilter ] = useHomeStore((state) => [ state.category, state.setCategory, state.setActiveFilter, state.isOpenFilter, state.resetFilter ]);

  const [ getCountPromos_Orders ] = useProfileStore((state) => [ state.getCountPromos_Orders ]);

  if (city == '') return null;

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenburger, setIsOpenburger] = useState(false);
  const [isOpenCat, setIsOpenCat] = useState(false);
  const [list, setList] = useState([]);
 
   

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     if( category.length > 0 && search_category.length > 0 ) {
  //       //console.log( 'search_category', search_category, category ) 

  //       category.map( main_cat => {
  //         if( main_cat.cats.length > 0 ){
  //           main_cat.cats.map( cat => {
  //             if( cat.link === search_category ){
  //               console.log( 'go_to', cat.name, cat.id ) 
  //               chooseCat(cat.name, cat.id)
  //             }
  //           })
  //         }else{
  //           if( main_cat.link === search_category ){
  //             console.log( 'go_to', main_cat.name, main_cat.id ) 
  //             chooseCat(main_cat.name, main_cat.id)
  //           }
  //         }
  //       } )
  //     }
  //   }
  // }, [search_category, category]);

  useEffect(() => {
    if (typeof window !== "undefined") {

      if (localStorage.getItem('setCity') && localStorage.getItem('setCity').length > 0) {
        const city_ = JSON.parse(localStorage.getItem('setCity'));

        if (city_.link !== city && city != '') {
          setThisCityRu(city_.name);
          setThisCity(city_.link);

          const search = window.location.search;

          const new_link = pathname.replace(new RegExp(city, 'g'), city_.link);

          router.push(`${new_link}${search}`, { scroll: true });

          //setTimeout( () => {
            //router.refresh();
          //}, 500 ) 
        }
      } else {
        setActiveModalCity(true);
      }

      let promo_name = Cookies.get('promo_name');

      if(promo_name && promo_name.length > 0){
        getInfoPromo(promo_name, city)
      }
 
      getCartLocalStorage();
    }
  }, []);

  useEffect(() => {
    getCountPromos_Orders(city);

    const intervalId = setInterval(() => {
      getCountPromos_Orders(city);
    }, 1000 * 30);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [isAuth]);

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
    resetFilter();
  };

  function chooseCat(id){
    localStorage.setItem('goTo', id)

    resetFilter();
    closeMenu();
  }

  const handleClose = () => {
    if(openBasket) {
      setActiveBasket(false);
    }
  }

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

  const thisChooseCat = (cat_name, cat_id) => {
    
    reachGoal(`Категория ${cat_name}`);

    if( parseInt(cat_id) > 0 ){
      chooseCat(cat_id)
    }else{
      resetFilter();
    }
  }

  const goToPage = (page) => {
    reachGoal(`Клик в шапке ${page}`);
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
                    onClick={() => thisChooseCat(item.name, -1)}
                    //style={{marginRight: item.name === 'Пицца' ? 0 : '18.050541516245vw', width: item.name === 'Напитки' ? '7.2202166064982vw' : '5.7761732851986vw'}}
                  >
                    <span id={'link_' + item.id}>{item.name}</span> 
                  </ScrollLink>
                    :
                  <Link href={`/${city}`} onClick={() => thisChooseCat(item.name, item.id)} key={key} className={"headerCat "+ (key+1 == category.length ? 'last' : '') }>
                    <span>{item.name}</span>
                  </Link>
            )}

            <Link href={`/${city}/akcii`} className={"headerCat link " + (activePage === 'akcii'? 'activeCat' : '')} onClick={ () => goToPage('Акции') }>
              <span>Акции</span>
            </Link>
          </div>

          <div>
            
            <div className={'chooseCity'} onClick={ () => setActiveModalCity(true) }>
              {thisCityRu}
            </div>

            <Link href={'/' + city + '/contacts'}  className={activePage === 'contacts' ? 'mapHeaderPC active' : 'mapHeaderPC'} onClick={ () => goToPage('Контакты') }>
              <LocationHeaderIcon className='map_svg' />
            </Link>
            
            <div className={'burgerHeaderPC '+(activeDoc ? 'active' : '')} onClick={ (event) => openMenuBurger(event) }>
              <JacoDocsIcon className='burger_svg'/>
            </div>

            <ProfileIconHeaderPC activeProfile={activeProfile} goToPage={goToPage} />

            <BasketIconHeaderPC />

            <MenuCat anchorEl={anchorEl} isOpen={isOpenCat} onClose={closeMenu} chooseCat={thisChooseCat} city={city} list={list} active_page={activePage} />
            <MenuBurger anchorEl={anchorEl} isOpen={isOpenburger} onClose={closeMenuBurger} city={city} goToPage={goToPage} />
          </div>
        </Toolbar>
      </AppBar>
      {/* <div className='blockShadow' /> */}
    </>
  );
})
