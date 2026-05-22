import type {
  ComponentType,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from 'react';
import {
  AboutIconMobile,
  BasketIconMobile,
  ArrowDownHeader,
  BasketIconNew,
  BurgerIconMobile,
  BurgerIconPC,
  LocationHeaderIcon,
  LocationIconMobile,
  MenuIconMobile,
  ProfileIconMobile,
  ProfileIconNew,
} from '../../icons';
import { cn } from '../../foundation/classNames';
import './Header.scss';

export interface HeaderNavItem {
  label: string;
  href?: string;
  active?: boolean;
  children?: HeaderNavItem[];
}

export type HeaderDrawerLink = {
  label: string;
  href?: string;
  active?: boolean;
  button?: boolean;
};

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  navItems?: HeaderNavItem[];
  drawerLinks?: HeaderDrawerLink[];
  city?: string;
  cityHref?: string;
  cartLabel?: string;
  cartCount?: number;
  logoSrc?: string;
  logoHref?: string;
  compactMenuOpen?: boolean;
  onMenuClick?: () => void;
  onCityClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onNavItemClick?: (
    item: HeaderNavItem,
    event: MouseEvent<HTMLElement>
  ) => void;
  actions?: ReactNode;
}

type DrawerItem = HeaderNavItem & {
  icon: ComponentType<{ 'aria-hidden'?: 'true'; className?: string }>;
  badge?: string;
  button?: boolean;
};

const defaultNavItems: HeaderNavItem[] = [
  { label: 'Роллы', active: true },
  { label: 'Пицца' },
  { label: 'Блюда' },
  { label: 'Акции' },
];

function hrefFromBase(base: string, path: string): string {
  return `${base.replace(/\/$/, '')}${path}`;
}

function extractCartCount(cartCount?: number): string | undefined {
  return typeof cartCount === 'number' && cartCount > 0
    ? String(cartCount)
    : undefined;
}

const drawerIconByLabel: Record<
  string,
  ComponentType<{ 'aria-hidden'?: 'true'; className?: string }>
> = {
  Меню: MenuIconMobile,
  Акции: AboutIconMobile,
  Адреса: LocationIconMobile,
  Жако: AboutIconMobile,
  Аккаунт: ProfileIconMobile,
  Корзина: BasketIconMobile,
};

function buildDefaultDrawerItems(
  logoHref: string,
  city: string,
  cityHref: string | undefined,
  cartBadge: string | undefined
): DrawerItem[] {
  return [
    { label: 'Меню', href: logoHref, active: true, icon: MenuIconMobile },
    {
      label: 'Акции',
      href: hrefFromBase(logoHref, '/akcii'),
      icon: AboutIconMobile,
    },
    {
      label: city,
      href: cityHref,
      icon: LocationIconMobile,
      button: !cityHref,
    },
    {
      label: 'Адреса',
      href: hrefFromBase(logoHref, '/contacts'),
      icon: LocationIconMobile,
    },
    {
      label: 'Жако',
      href: hrefFromBase(logoHref, '/document'),
      icon: AboutIconMobile,
    },
    { label: 'Аккаунт', icon: ProfileIconMobile, button: true },
    {
      label: 'Корзина',
      href: hrefFromBase(logoHref, '/cart'),
      icon: BasketIconMobile,
      badge: cartBadge,
    },
  ];
}

export function Header({
  navItems = defaultNavItems,
  drawerLinks,
  city = 'Самара',
  cityHref,
  cartLabel = '2 818 ₽',
  cartCount,
  logoSrc = '/Jaco-Logo-120.png',
  logoHref = '/',
  compactMenuOpen = false,
  onMenuClick,
  onCityClick,
  onCartClick,
  onProfileClick,
  onNavItemClick,
  actions,
  className,
  ...props
}: HeaderProps) {
  const cartBadge = extractCartCount(cartCount);
  const drawerItems: DrawerItem[] = drawerLinks?.length
    ? drawerLinks.map((item) => ({
        ...item,
        icon:
          drawerIconByLabel[item.label] ??
          (item.label === city ? LocationIconMobile : MenuIconMobile),
        badge: item.label === 'Корзина' ? cartBadge : undefined,
        button:
          item.button ?? (item.label === city || item.label === 'Аккаунт'),
      }))
    : buildDefaultDrawerItems(logoHref, city, cityHref, cartBadge);

  return (
    <header id="headerNew" className={cn('ui-header', className)} {...props}>
      <div className="ui-header__bar">
        <a className="ui-header__logo" href={logoHref} aria-label="Жако">
          <img src={logoSrc} alt="Жако" />
        </a>

        <nav className="ui-header__nav" aria-label="Основное меню">
          {navItems.map((item) => {
            const Tag = item.href ? 'a' : 'button';
            return (
              <Tag
                key={item.label}
                className={cn(
                  'ui-header__nav-item',
                  item.active && 'ui-header__nav-item--active'
                )}
                href={item.href as string | undefined}
                type={item.href ? undefined : 'button'}
                onClick={(event: MouseEvent<HTMLElement>) =>
                  onNavItemClick?.(item, event)
                }
              >
                <span>{item.label}</span>
                {item.children?.length ? (
                  <ArrowDownHeader
                    aria-hidden="true"
                    className="ui-header__nav-arrow"
                  />
                ) : null}
                {item.children?.length ? (
                  <span className="ui-header__submenu">
                    {item.children.slice(0, 12).map((child) =>
                      child.href ? (
                        <a
                          key={child.label}
                          className="ui-header__submenu-item"
                          href={child.href}
                        >
                          {child.label}
                        </a>
                      ) : (
                        <span
                          key={child.label}
                          className="ui-header__submenu-item"
                        >
                          {child.label}
                        </span>
                      )
                    )}
                  </span>
                ) : null}
              </Tag>
            );
          })}
        </nav>

        <div className="ui-header__spacer" />

        <button className="ui-header__city" type="button" onClick={onCityClick}>
          <LocationHeaderIcon aria-hidden="true" />
          <span>{city}</span>
        </button>

        <button
          className={cn(
            'ui-header__icon',
            compactMenuOpen && 'ui-header__icon--active'
          )}
          type="button"
          aria-label={compactMenuOpen ? 'Закрыть меню' : 'Меню'}
          aria-expanded={compactMenuOpen}
          onClick={onMenuClick}
        >
          <BurgerIconMobile
            aria-hidden="true"
            className="ui-header__burger-compact"
          />
          <BurgerIconPC
            aria-hidden="true"
            className="ui-header__burger-expanded"
          />
        </button>

        <button
          className="ui-header__icon ui-header__profile"
          type="button"
          aria-label="Профиль"
          onClick={onProfileClick}
        >
          <ProfileIconNew aria-hidden="true" />
        </button>

        <button
          className="ui-header__cart"
          type="button"
          aria-label="Корзина"
          onClick={onCartClick}
        >
          <BasketIconNew aria-hidden="true" />
          <span>{cartLabel}</span>
        </button>

        {actions ? <div className="ui-header__actions">{actions}</div> : null}
      </div>

      <div
        className={cn(
          'ui-header__drawer',
          compactMenuOpen && 'ui-header__drawer--open'
        )}
      >
        <nav className="ui-header__drawer-nav" aria-label="Мобильное меню">
          {drawerItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon aria-hidden="true" className="ui-header__drawer-icon" />
                <span className="ui-header__drawer-text">{item.label}</span>
                {item.badge ? (
                  <span className="ui-header__drawer-badge">{item.badge}</span>
                ) : null}
              </>
            );

            return item.button ? (
              <button
                key={item.label}
                className={cn(
                  'ui-header__drawer-link',
                  item.active && 'ui-header__drawer-link--active'
                )}
                type="button"
                onClick={item.label === city ? onCityClick : undefined}
              >
                {content}
              </button>
            ) : (
              <a
                key={item.label}
                className={cn(
                  'ui-header__drawer-link',
                  item.active && 'ui-header__drawer-link--active'
                )}
                href={item.href ?? '#'}
              >
                {content}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
