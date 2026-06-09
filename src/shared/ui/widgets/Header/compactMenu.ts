import type { ComponentType } from 'react';
import {
  AboutIconMobile,
  BasketIconMobile,
  LocationIconMobile,
  MapContactsMobile,
  MenuIconMobile,
  ProfileIconMobile,
  Sale,
} from '../../icons';

export const HEADER_COMPACT_MENU_ITEM = {
  menu: 'menu',
  promotions: 'promotions',
  city: 'city',
  contacts: 'contacts',
  about: 'about',
  account: 'account',
  cart: 'cart',
} as const;

export type HeaderCompactMenuItemId =
  (typeof HEADER_COMPACT_MENU_ITEM)[keyof typeof HEADER_COMPACT_MENU_ITEM];

export type HeaderCompactMenuLink = {
  id: HeaderCompactMenuItemId;
  label: string;
  href?: string;
  active?: boolean;
  button?: boolean;
};

export type CompactMenuIcon = ComponentType<{
  'aria-hidden'?: 'true';
  className?: string;
}>;

export type CompactMenuItem = HeaderCompactMenuLink & {
  icon: CompactMenuIcon;
  badge?: string;
};

const COMPACT_MENU_ICON_BY_ID: Record<
  HeaderCompactMenuItemId,
  CompactMenuIcon
> = {
  [HEADER_COMPACT_MENU_ITEM.menu]: MenuIconMobile,
  [HEADER_COMPACT_MENU_ITEM.promotions]: Sale,
  [HEADER_COMPACT_MENU_ITEM.city]: MapContactsMobile,
  [HEADER_COMPACT_MENU_ITEM.contacts]: LocationIconMobile,
  [HEADER_COMPACT_MENU_ITEM.about]: AboutIconMobile,
  [HEADER_COMPACT_MENU_ITEM.account]: ProfileIconMobile,
  [HEADER_COMPACT_MENU_ITEM.cart]: BasketIconMobile,
};

export function compactMenuIconFor(
  id: HeaderCompactMenuItemId
): CompactMenuIcon {
  return COMPACT_MENU_ICON_BY_ID[id];
}

export function isCompactMenuAuthItem(item: HeaderCompactMenuLink): boolean {
  return item.id === HEADER_COMPACT_MENU_ITEM.account;
}

export function isCompactMenuCityItem(item: HeaderCompactMenuLink): boolean {
  return item.id === HEADER_COMPACT_MENU_ITEM.city;
}

export function resolvesAsCompactMenuButton(
  item: HeaderCompactMenuLink
): boolean {
  if (typeof item.button === 'boolean') {
    return item.button;
  }

  return (
    isCompactMenuCityItem(item) || (isCompactMenuAuthItem(item) && !item.href)
  );
}

export function enrichCompactMenuLinks(
  links: HeaderCompactMenuLink[],
  options: {
    profileAuthenticated: boolean;
    profileLabel: string;
    profileAvatar: CompactMenuIcon;
    cartBadge?: string;
  }
): CompactMenuItem[] {
  const { profileAuthenticated, profileLabel, profileAvatar, cartBadge } =
    options;

  return links.map((item) => {
    const authItem = isCompactMenuAuthItem(item);

    return {
      ...item,
      label: authItem && profileAuthenticated ? profileLabel : item.label,
      icon:
        authItem && profileAuthenticated
          ? profileAvatar
          : compactMenuIconFor(item.id),
      badge: item.id === HEADER_COMPACT_MENU_ITEM.cart ? cartBadge : undefined,
      button: resolvesAsCompactMenuButton(item),
    };
  });
}

function hrefFromBase(base: string, path: string): string {
  return `${base.replace(/\/$/, '')}${path}`;
}

export function buildDefaultCompactMenuLinks(
  logoHref: string,
  cityLabel: string,
  cityHref: string | undefined
): HeaderCompactMenuLink[] {
  return [
    {
      id: HEADER_COMPACT_MENU_ITEM.menu,
      label: 'Меню',
      href: logoHref,
      active: true,
    },
    {
      id: HEADER_COMPACT_MENU_ITEM.promotions,
      label: 'Акции',
      href: hrefFromBase(logoHref, '/akcii'),
    },
    {
      id: HEADER_COMPACT_MENU_ITEM.city,
      label: cityLabel,
      href: cityHref,
      button: !cityHref,
    },
    {
      id: HEADER_COMPACT_MENU_ITEM.contacts,
      label: 'Адреса',
      href: hrefFromBase(logoHref, '/contacts'),
    },
    {
      id: HEADER_COMPACT_MENU_ITEM.about,
      label: 'Жако',
      href: hrefFromBase(logoHref, '/document'),
    },
    {
      id: HEADER_COMPACT_MENU_ITEM.account,
      label: 'Аккаунт',
      button: true,
    },
    {
      id: HEADER_COMPACT_MENU_ITEM.cart,
      label: 'Корзина',
      href: hrefFromBase(logoHref, '/cart'),
    },
  ];
}
