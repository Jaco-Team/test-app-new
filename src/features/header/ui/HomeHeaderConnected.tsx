'use client';

import { useMemo, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useCartStore } from '@src/entities/cart';
import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { useHomeStore } from '@src/entities/home';
import {
  reachGoal,
  trackCategoryClick,
  trackHeaderClick,
} from '@src/shared/lib/analytics/metrika';
import { previewCityBase, previewCityPath } from '@src/shared/lib/previewPaths';
import { Header } from '@ui/widgets/Header/Header';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import { formatCartLabel } from '../model/formatCartLabel';
import {
  buildHeaderDrawerLinks,
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
  const [cityAnchor, setCityAnchor] = useState<null | HTMLElement>(null);

  const citySlug =
    useCityStore((state) => state.slug) || fallbackCitySlug || '';
  const cityLabel =
    useCityStore((state) => state.labelRu) || fallbackCityLabel || citySlug;
  const cityList = useCityStore((state) => state.list);
  const categories = useHomeStore((state) => state.categories);
  const activePage = useHeaderStore((state) => state.activePage);
  const compactMenuOpen = useHeaderStore((state) => state.compactMenuOpen);
  const toggleCompactMenu = useHeaderStore((state) => state.toggleCompactMenu);
  const setCompactMenuOpen = useHeaderStore(
    (state) => state.setCompactMenuOpen
  );
  const setActiveModalCity = useHeaderStore(
    (state) => state.setActiveModalCity
  );
  const setActiveModalCityList = useHeaderStore(
    (state) => state.setActiveModalCityList
  );
  const setActiveBasket = useHeaderStore((state) => state.setActiveBasket);

  const itemsOffDops = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);
  const itemsCount = useCartStore((state) => state.itemsCount);

  const navItems = useMemo(() => {
    if (categories.length > 0 && citySlug) {
      return buildHeaderNavItems(citySlug, categories, { activePage });
    }
    return fallbackNav ?? [];
  }, [activePage, categories, citySlug, fallbackNav]);

  const drawerLinks = useMemo(
    () =>
      citySlug ? buildHeaderDrawerLinks(citySlug, cityLabel, activePage) : [],
    [activePage, cityLabel, citySlug]
  );

  const cartLabel = formatCartLabel(
    itemsOffDops,
    dopListCart,
    checkPromo,
    allPrice
  );
  const logoHref = citySlug ? previewCityBase(citySlug) : '/preview';

  return (
    <>
      <Header
        navItems={navItems}
        drawerLinks={drawerLinks}
        city={cityLabel}
        cartLabel={cartLabel}
        cartCount={itemsCount > 0 ? itemsCount : undefined}
        logoSrc="/Jaco-Logo-120.png"
        logoHref={logoHref}
        compactMenuOpen={compactMenuOpen}
        onMenuClick={toggleCompactMenu}
        onCityClick={(event) => {
          setCityAnchor(event.currentTarget);
          setActiveModalCityList(true);
        }}
        onCartClick={() => {
          setCompactMenuOpen(false);
          setActiveBasket(true);
          reachGoal('open_basket', undefined, citySlug);
          if (citySlug) {
            window.location.href = previewCityPath(citySlug, 'cart');
          }
        }}
        onNavItemClick={(item) => {
          trackCategoryClick(item.label, citySlug);
        }}
      />

      <Menu
        anchorEl={cityAnchor}
        open={Boolean(cityAnchor)}
        onClose={() => {
          setCityAnchor(null);
          setActiveModalCity(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {cityList.length > 0 ? (
          cityList.map((item) => {
            const slug = String(item.link ?? '').trim();
            const name = String(item.name ?? slug);
            if (!slug) {
              return null;
            }
            return (
              <MenuItem
                key={slug}
                selected={slug === citySlug}
                onClick={() => {
                  setCityAnchor(null);
                  trackHeaderClick(name, citySlug);
                  window.location.href = previewCityBase(slug);
                }}
              >
                {name}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem
            onClick={() => {
              setCityAnchor(null);
              setActiveModalCity(true);
            }}
          >
            {cityLabel}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
