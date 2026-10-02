import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import {
  ArrowDownHeaderPC,
  ArrowUpHeaderPC,
  JacoDocsIcon,
  LocationHeaderIcon,
  SvgLogo,
} from '@/ui/Icons.js';

import { Link as ScrollLink } from 'react-scroll';
import { scroller } from 'react-scroll';

import {
  useHeaderStoreNew,
  useCitiesStore,
  useFooterStore,
  useHomeStore,
  useProfileStore,
} from '@/components/store.js';
import useScroll from '../hook.js';

import BasketIconHeaderPC from '../basket/basketIconHeaderPC.js';
import ProfileIconHeaderPC from '../profile/profileIconHeaderPC.js';

import { reachGoal } from '@/utils/metrika';
import { getLocalStorageJson } from '@/utils/browserStorage';
import { useCategoryClickReady } from '@/utils/useCategoryClickReady';
import { isEarlyCategoryClick } from '@/utils/earlyCategoryClick';
import {
  categoryHref,
  isCityHomePath,
  isPlainCategoryClick,
} from '@/utils/categoryNavigation';

const MenuBurger = React.memo(function MenuBurger({
  anchorEl,
  city,
  isOpen,
  onClose,
  goToPage,
}) {
  const [links] = useFooterStore((state) => [state.links]);
  //const [ thisCityRu ] = useCitiesStore( state => [ state.thisCityRu ] );
  //const [ setActiveModalCity ] = useHeaderStoreNew( state => [ state.setActiveModalCity ] );

  const navigate = (page) => {
    goToPage(page);
    onClose();
  };

  return (
    <Menu
      id="chooseHeaderCat"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={() => onClose()}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoFocus={false}
    >
      <MenuItem onClick={() => navigate('О компании')}>
        <Link href={`/${city}/about`}>
          <span>О компании</span>
        </Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Реквизиты')}>
        <Link href={'/' + city + '/company-details'}>
          <span>Реквизиты</span>
        </Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Публичная оферта')}>
        <Link href={'/' + city + '/publichnaya-oferta'}>
          <span>Публичная оферта</span>
        </Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Политика')}>
        <Link href={'/' + city + '/politika-konfidencialnosti'}>
          <span>Политика</span>
        </Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Правила оплаты')}>
        <Link href={'/' + city + '/instpayorders'}>
          <span>Правила оплаты</span>
        </Link>
      </MenuItem>

      <MenuItem onClick={() => navigate('Пищевая ценность')}>
        <Link href={links?.link_allergens ?? links} target="_blank">
          <span>Пищевая ценность</span>
        </Link>
      </MenuItem>
    </Menu>
  );
});

const MenuCat = React.memo(function MenuCat({
  anchorEl,
  city,
  isOpen,
  onClose,
  onCategoryClick,
  list,
  parentId,
  categoryClickReady,
}) {
  return (
    <Menu
      id={`chooseHeaderCat-${parentId}`}
      className="chooseHeaderCat"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      keepMounted
      disablePortal
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoFocus={false}
    >
      {list.map((cat) => (
        <MenuItem key={cat.id}>
          <Link
            href={categoryHref(city, cat?.link) || `/${city}/menu`}
            data-home-category={city}
            data-category-target={`cat${cat.id}`}
            data-category-ready={categoryClickReady ? 'true' : undefined}
            onClick={(event) => onCategoryClick(event, cat)}
          >
            <span id={'link_' + cat.id}>{cat.name}</span>
          </Link>
        </MenuItem>
      ))}
    </Menu>
  );
});

const MemoLogo = React.memo(function MemoLogo({ city, activePage }) {
  return (
    <>
      {activePage === 'home' ? (
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
      ) : (
        <Link href={'/' + city} className="logoHeaderPC">
          <SvgLogo />
        </Link>
      )}
    </>
  );
});

export default React.memo(function NavBarPC({ city, cityRu, catList = [] }) {
  useScroll();
  const categoryClickReady = useCategoryClickReady();

  const [
    setActiveBasket,
    openBasket,
    setActiveModalCity,
    activePage,
    isAuth,
    openCityModal,
  ] = useHeaderStoreNew((state) => [
    state?.setActiveBasket,
    state?.openBasket,
    state?.setActiveModalCity,
    state?.activePage,
    state.isAuth,
    state?.openCityModal,
  ]);
  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);
  const [category, itemsCatCity, resetFilter] = useHomeStore((state) => [
    state.category,
    state.itemsCatCity,
    state.resetFilter,
  ]);
  const navigationCategories =
    itemsCatCity === city && Array.isArray(category) && category.length > 0
      ? category
      : Array.isArray(catList)
        ? catList
        : [];

  const [getCountPromos_Orders] = useProfileStore((state) => [
    state.getCountPromos_Orders,
  ]);

  const displayCityRu = thisCityRu || cityRu || '';

  if (city == '') return null;

  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [isOpenburger, setIsOpenburger] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !getLocalStorageJson('setCity')?.link
    ) {
      setActiveModalCity(true);
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
    setCategoryAnchorEl(event.currentTarget);
    setOpenCategoryId(id);
  };

  function openMenuBurger(event) {
    setAnchorEl(event.currentTarget);
    setIsOpenburger(true);
  }

  function closeMenuBurger() {
    setIsOpenburger(false);
  }

  const closeMenu = () => {
    setCategoryAnchorEl(null);
    setOpenCategoryId(null);
    resetFilter();
  };

  const handleCategoryClick = (event, item) => {
    if (isEarlyCategoryClick(event)) {
      closeMenu();
      return;
    }
    if (!isPlainCategoryClick(event)) return;

    const isHome = isCityHomePath(window.location.pathname, city);
    if (isHome) event.preventDefault();

    reachGoal(`Категория ${item.name}`);
    closeMenu();

    if (!isHome) return;

    requestAnimationFrame(() => {
      scroller.scrollTo(`cat${item.id}`, {
        duration: 200,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -70,
        isDynamic: true,
      });
    });
  };

  const handleClose = () => {
    if (openBasket) {
      setActiveBasket(false);
    }
  };

  let activeProfile = false;
  let activeDoc = false;

  if (
    activePage == 'zakazy' ||
    activePage == 'profile' ||
    activePage == 'promokody'
  ) {
    activeProfile = true;
  } else {
    if (
      activePage == 'home' ||
      activePage == 'category' ||
      activePage == 'cart' ||
      activePage == 'akcii' ||
      activePage == 'contacts'
    ) {
      activeProfile = false;
      activeDoc = false;
    } else {
      activeProfile = false;
      activeDoc = true;
    }
  }

  const goToPage = (page) => {
    reachGoal(`Клик в шапке ${page}`);
  };

  return (
    <>
      <AppBar
        className="headerNew"
        id="headerNew"
        elevation={2}
        onClick={handleClose}
      >
        <Toolbar>
          <div>
            <MemoLogo city={city} activePage={activePage} />

            {navigationCategories.map((item, key) =>
              Array.isArray(item.cats) && item.cats.length > 0 ? (
                <div
                  key={item.id}
                  className={
                    openCategoryId === item.id
                      ? 'headerCat activeCat'
                      : 'headerCat'
                  }
                  onClick={(event) => openMenu(event, item.id)}
                >
                  <span>
                    {item.name}{' '}
                    {openCategoryId === item.id ? (
                      <ArrowUpHeaderPC />
                    ) : (
                      <ArrowDownHeaderPC />
                    )}
                  </span>
                </div>
              ) : (
                <Link
                  href={categoryHref(city, item?.link) || `/${city}/menu`}
                  data-home-category={city}
                  data-category-target={`cat${item.id}`}
                  data-category-ready={categoryClickReady ? 'true' : undefined}
                  onClick={(event) => handleCategoryClick(event, item)}
                  key={item.id}
                  className={
                    'headerCat ' +
                    (key + 1 === navigationCategories.length ? 'last' : '')
                  }
                >
                  <span id={'link_' + item.id}>{item.name}</span>
                </Link>
              )
            )}

            <Link
              href={`/${city}/akcii`}
              className={
                'headerCat link ' + (activePage === 'akcii' ? 'activeCat' : '')
              }
              onClick={() => goToPage('Акции')}
            >
              <span>Акции</span>
            </Link>
          </div>

          <div>
            <div
              className={
                'chooseCity' + (openCityModal ? ' chooseCity--open' : '')
              }
              onClick={() => setActiveModalCity(true)}
            >
              {displayCityRu}
            </div>

            <Link
              href={'/' + city + '/contacts'}
              className={
                activePage === 'contacts' ? 'mapHeaderPC active' : 'mapHeaderPC'
              }
              onClick={() => goToPage('Контакты')}
            >
              <LocationHeaderIcon className="map_svg" />
            </Link>

            <div
              className={'burgerHeaderPC ' + (activeDoc ? 'active' : '')}
              onClick={(event) => openMenuBurger(event)}
            >
              <JacoDocsIcon className="burger_svg" />
            </div>

            <ProfileIconHeaderPC
              activeProfile={activeProfile}
              goToPage={goToPage}
              city={city}
            />

            <BasketIconHeaderPC />

            {navigationCategories
              .filter(
                (item) => Array.isArray(item.cats) && item.cats.length > 0
              )
              .map((item) => (
                <MenuCat
                  key={item.id}
                  parentId={item.id}
                  anchorEl={categoryAnchorEl}
                  isOpen={openCategoryId === item.id}
                  onClose={closeMenu}
                  onCategoryClick={handleCategoryClick}
                  city={city}
                  list={item.cats}
                  categoryClickReady={categoryClickReady}
                />
              ))}
            <MenuBurger
              anchorEl={anchorEl}
              isOpen={isOpenburger}
              onClose={closeMenuBurger}
              city={city}
              goToPage={goToPage}
            />
          </div>
        </Toolbar>
      </AppBar>
      {/* <div className='blockShadow' /> */}
    </>
  );
});
