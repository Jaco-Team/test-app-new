'use client';

import type { MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import { useCartStore } from '@src/entities/cart';
import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { useHomeStore } from '@src/entities/home';
import {
  reachGoal,
  trackCategoryClick,
  trackHeaderClick,
} from '@src/shared/lib/analytics/metrika';
import { saveUserAction } from '@src/features/telemetry';
import {
  APP_ROUTE_PREFIX,
  cityBase,
  cityPath,
} from '@src/shared/lib/sitePaths';
import { setLocalStorageItem } from '@/utils/browserStorage';
import { Header } from '@ui/widgets/Header/Header';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import { formatCartLabel } from '@src/features/header/model/formatCartLabel';
import {
  buildHeaderCompactMenuLinks,
  buildHeaderNavItems,
} from '@src/features/header/model/buildHeaderNav';

export type ConnectedHeaderProps = {
  /** SSR nav until catalog is hydrated in the store */
  fallbackNav?: HeaderNavItem[];
  fallbackCityLabel?: string;
  fallbackCitySlug?: string;
};

/**
 * App header wired to app stores (city, catalog, cart, auth, basket).
 * Use inside {@link PageLayout} on app routes.
 */
export function ConnectedHeader({
  fallbackNav,
  fallbackCityLabel,
  fallbackCitySlug,
}: ConnectedHeaderProps) {
  const [openNavLabel, setOpenNavLabel] = useState<string | undefined>();
  const [desktopDocsOpen, setDesktopDocsOpen] = useState(false);

  const compactMenuOpen = useHeaderStore((state) => state.compactMenuOpen);
  const setCompactMenuOpen = useHeaderStore(
    (state) => state.setCompactMenuOpen
  );
  const citySlug =
    useCityStore((state) => state.slug) || fallbackCitySlug || '';
  const cityLabel =
    useCityStore((state) => state.labelRu) || fallbackCityLabel || citySlug;
  const categories = useHomeStore((state) => state.categories);
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
  const allPriceWithoutPromo = useCartStore(
    (state) => state.allPriceWithoutPromo
  );
  const itemsCount = useCartStore((state) => state.itemsCount);

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
    allPrice,
    allPriceWithoutPromo
  );
  const hasPayableCart = cartLabel !== 'Корзина';
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

  const closeMenus = () => {
    setOpenNavLabel(undefined);
    setCompactMenuOpen(false);
    setDesktopDocsOpen(false);
  };

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
      closeMenus();
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

    closeMenus();
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
    <Header
      navItems={navItems}
      compactMenuLinks={compactMenuLinks}
      city={cityLabel}
      cartLabel={cartLabel}
      cartCount={hasPayableCart && itemsCount > 0 ? itemsCount : undefined}
      logoSrc="/Jaco-Logo-120.png"
      logoHref={logoHref}
      compactMenuOpen={compactMenuOpen}
      desktopDocsOpen={desktopDocsOpen}
      docsLinks={docsLinks}
      openNavLabel={openNavLabel}
      onCompactMenuClick={() => {
        setOpenNavLabel(undefined);
        setDesktopDocsOpen(false);
        setCompactMenuOpen(!compactMenuOpen);
      }}
      onDesktopDocsClick={() => {
        setOpenNavLabel(undefined);
        setCompactMenuOpen(false);
        setDesktopDocsOpen(!desktopDocsOpen);
      }}
      onCityClick={() => {
        closeMenus();
        setActiveModalCity(true);
      }}
      onContactsClick={() => {
        closeMenus();
        trackHeaderClick('Контакты', citySlug);
      }}
      onDropdownClose={closeMenus}
      onCartClick={() => {
        closeMenus();
        reachGoal('open_basket', undefined, citySlug);
        void saveUserAction({ event: 'open_card', price: 0 });
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
        closeMenus();
        if (isAuth === 'auth' && citySlug) {
          window.location.href = cityPath(citySlug, 'profile');
          return;
        }
        setActiveModalAuth(true);
      }}
    />
  );
}
