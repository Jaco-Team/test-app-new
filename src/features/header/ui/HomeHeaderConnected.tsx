'use client';

import type { MouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@src/entities/cart';
import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { useHomeStore } from '@src/entities/home';
import {
  reachGoal,
  trackCategoryClick,
  trackHeaderClick,
} from '@src/shared/lib/analytics/metrika';
import {
  APP_ROUTE_PREFIX,
  cityBase,
  cityPath,
} from '@src/shared/lib/sitePaths';
import { setLocalStorageItem } from '@/utils/browserStorage';
import { Header } from '@ui/widgets/Header/Header';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import { formatCartLabel } from '../model/formatCartLabel';
import {
  buildHeaderCompactMenuLinks,
  buildHeaderNavItems,
} from '../model/buildHeaderNav';

export type HomeHeaderConnectedProps = {
  fallbackNav?: HeaderNavItem[];
  fallbackCityLabel?: string;
  fallbackCitySlug?: string;
};

export function HomeHeaderConnected({
  fallbackNav,
  fallbackCityLabel,
  fallbackCitySlug,
}: HomeHeaderConnectedProps) {
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);
  const [openNavLabel, setOpenNavLabel] = useState<string | undefined>();
  const [desktopDocsOpen, setDesktopDocsOpen] = useState(false);

  const citySlug =
    useCityStore((state) => state.slug) || fallbackCitySlug || '';
  const cityLabel =
    useCityStore((state) => state.labelRu) || fallbackCityLabel || citySlug;
  const categories = useHomeStore((state) => state.categories);
  const getItemsCat = useHomeStore((state) => state.getItemsCat);
  const activePage = useHeaderStore((state) => state.activePage);
  const setActiveBasket = useHeaderStore((state) => state.setActiveBasket);
  const setActiveModalAuth = useHeaderStore(
    (state) => state.setActiveModalAuth
  );
  const setActiveModalCity = useHeaderStore(
    (state) => state.setActiveModalCity
  );
  const setActiveModalCityList = useHeaderStore(
    (state) => state.setActiveModalCityList
  );
  const isAuth = useHeaderStore((state) => state.isAuth);

  const itemsOffDops = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);
  const itemsCount = useCartStore((state) => state.itemsCount);

  useEffect(() => {
    if (!citySlug || categories.length > 0) {
      return;
    }

    void getItemsCat('home', citySlug);
  }, [categories.length, citySlug, getItemsCat]);

  const navItems = useMemo(() => {
    if (categories.length > 0 && citySlug) {
      return buildHeaderNavItems(citySlug, categories, { activePage });
    }
    return fallbackNav ?? [];
  }, [activePage, categories, citySlug, fallbackNav]);

  const compactMenuLinks = useMemo(
    () =>
      citySlug
        ? buildHeaderCompactMenuLinks(citySlug, cityLabel, activePage)
        : [],
    [activePage, cityLabel, citySlug]
  );

  const cartLabel = formatCartLabel(
    itemsOffDops,
    dopListCart,
    checkPromo,
    allPrice
  );
  const logoHref = citySlug ? cityBase(citySlug) : APP_ROUTE_PREFIX;
  const docsLinks = useMemo<HeaderNavItem[]>(
    () =>
      citySlug
        ? [
            { label: 'О компании', href: cityPath(citySlug, 'about') },
            { label: 'Реквизиты', href: cityPath(citySlug, 'company-details') },
            {
              label: 'Публичная оферта',
              href: cityPath(citySlug, 'publichnaya-oferta'),
            },
            {
              label: 'Политика',
              href: cityPath(citySlug, 'politika-konfidencialnosti'),
            },
            {
              label: 'Правила оплаты',
              href: cityPath(citySlug, 'instpayorders'),
            },
          ]
        : [],
    [citySlug]
  );

  const handleNavItemClick = (
    item: HeaderNavItem,
    event: MouseEvent<HTMLElement>
  ) => {
    if (item.children?.length) {
      event.preventDefault();
      setDesktopDocsOpen(false);
      setOpenNavLabel((current) =>
        current === item.label ? undefined : item.label
      );
      return;
    }

    if (item.href) {
      setOpenNavLabel(undefined);
      setDesktopDocsOpen(false);
      trackHeaderClick(item.label, citySlug);
      return;
    }

    event.preventDefault();

    const safeLink = String(item.link ?? '').trim();
    const safeId = Number(item.id);
    if (safeLink.length > 0) {
      setLocalStorageItem('goToCategoryLink', safeLink);
      setLocalStorageItem('ignoreMenuCategoryOnce', '1');
    } else if (safeId > 0) {
      setLocalStorageItem('goTo', String(safeId));
    }

    setOpenNavLabel(undefined);
    setDesktopDocsOpen(false);
    trackCategoryClick(item.label, citySlug);

    const targetId = safeId > 0 ? `cat${safeId}` : '';
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) {
      const headerOffset =
        document.getElementById('headerNew')?.getBoundingClientRect().height ??
        0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'auto' });
      return;
    }

    if (activePage !== 'home' && logoHref) {
      window.location.href = logoHref;
    }
  };

  return (
    <>
      <Header
        navItems={navItems}
        compactMenuLinks={compactMenuLinks}
        city={cityLabel}
        cartLabel={cartLabel}
        cartCount={itemsCount > 0 ? itemsCount : undefined}
        logoSrc="/Jaco-Logo-120.png"
        logoHref={logoHref}
        compactMenuOpen={compactMenuOpen}
        desktopDocsOpen={desktopDocsOpen}
        docsLinks={docsLinks}
        openNavLabel={openNavLabel}
        onCompactMenuClick={() => {
          setOpenNavLabel(undefined);
          setDesktopDocsOpen(false);
          setCompactMenuOpen((open) => !open);
        }}
        onDesktopDocsClick={() => {
          setOpenNavLabel(undefined);
          setCompactMenuOpen(false);
          setDesktopDocsOpen((open) => !open);
        }}
        onCityClick={() => {
          setCompactMenuOpen(false);
          setDesktopDocsOpen(false);
          setActiveModalCity(true);
        }}
        onContactsClick={() => {
          setCompactMenuOpen(false);
          setDesktopDocsOpen(false);
          trackHeaderClick('Контакты', citySlug);
        }}
        onDropdownClose={() => {
          setOpenNavLabel(undefined);
          setCompactMenuOpen(false);
          setDesktopDocsOpen(false);
        }}
        onCartClick={() => {
          setCompactMenuOpen(false);
          setDesktopDocsOpen(false);
          reachGoal('open_basket', undefined, citySlug);
          setActiveBasket(true);
        }}
        onNavItemClick={handleNavItemClick}
        onCompactMenuItemClick={(item) => {
          setCompactMenuOpen(false);
          if (item.label === cityLabel) {
            setActiveModalCityList(true);
            return;
          }
          if (item.label !== cityLabel) {
            trackHeaderClick(item.label, citySlug);
          }
        }}
        onProfileClick={() => {
          setCompactMenuOpen(false);
          setDesktopDocsOpen(false);
          if (isAuth === 'auth' && citySlug) {
            window.location.href = cityPath(citySlug, 'profile');
            return;
          }
          setActiveModalAuth(true);
        }}
      />
    </>
  );
}
