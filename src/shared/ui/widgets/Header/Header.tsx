import { useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { useBodyScrollLock, useClickOutside } from '@/src/shared/lib/overlay';
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
  ArrowUpHeader,
  BasketIconNew,
  BurgerIconMobile,
  JacoDocsIcon,
  LocationHeaderIcon,
  LocationIconMobile,
  MapContactsMobile,
  MenuIconMobile,
  ProfileIconMobile,
  ProfileIconNew,
  Sale,
} from '../../icons';
import { cn } from '../../foundation/classNames';
import { CompactMenu } from './CompactMenu';
import type { CompactMenuItem } from './CompactMenu';
import './Header.scss';
import useGetPageScroll from '@/src/shared/lib/useGetPageScroll';

export interface HeaderNavItem {
  label: string;
  href?: string;
  id?: string | number;
  link?: string;
  active?: boolean;
  variant?: 'outlined';
  children?: HeaderNavItem[];
}

export type HeaderCompactMenuLink = {
  label: string;
  href?: string;
  active?: boolean;
  button?: boolean;
};

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  navItems?: HeaderNavItem[];
  compactMenuLinks?: HeaderCompactMenuLink[];
  city?: string;
  cityHref?: string;
  cartLabel?: string;
  cartCount?: number;
  logoSrc?: string;
  logoHref?: string;
  compactMenuOpen?: boolean;
  desktopDocsOpen?: boolean;
  desktopDocsActive?: boolean;
  docsLinks?: HeaderNavItem[];
  openNavLabel?: string;
  onCompactMenuClick?: () => void;
  onCityClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onContactsClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onDesktopDocsClick?: () => void;
  onDropdownClose?: () => void;
  onCompactMenuItemClick?: (
    item: HeaderCompactMenuLink,
    event: MouseEvent<HTMLElement>
  ) => void;
  onNavItemClick?: (
    item: HeaderNavItem,
    event: MouseEvent<HTMLElement>
  ) => void;
  actions?: ReactNode;
}

const dropdownMotion: Pick<
  MotionProps,
  'initial' | 'animate' | 'exit' | 'transition'
> = {
  initial: { opacity: 0, scaleX: 0.75, scaleY: 0.56, x: '-50%' },
  animate: { opacity: 1, scaleX: 1, scaleY: 1, x: '-50%' },
  exit: { opacity: 0, scaleX: 0.75, scaleY: 0.56, x: '-50%' },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

function hrefFromBase(base: string, path: string): string {
  return `${base.replace(/\/$/, '')}${path}`;
}

function extractCartCount(cartCount?: number): string | undefined {
  return typeof cartCount === 'number' && cartCount > 0
    ? String(cartCount)
    : undefined;
}

const compactMenuIconByLabel: Record<
  string,
  ComponentType<{ 'aria-hidden'?: 'true'; className?: string }>
> = {
  Меню: MenuIconMobile,
  Акции: Sale,
  Тольятти: MapContactsMobile,
  Самара: MapContactsMobile,
  Адреса: LocationIconMobile,
  Жако: AboutIconMobile,
  Аккаунт: ProfileIconMobile,
  Корзина: BasketIconMobile,
};

function buildDefaultCompactMenuItems(
  logoHref: string,
  city: string,
  cityHref: string | undefined,
  cartBadge: string | undefined
): CompactMenuItem[] {
  return [
    { label: 'Меню', href: logoHref, active: true, icon: MenuIconMobile },
    {
      label: 'Акции',
      href: hrefFromBase(logoHref, '/akcii'),
      icon: Sale,
    },
    {
      label: city,
      href: cityHref,
      icon: MapContactsMobile,
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
  navItems = [],
  compactMenuLinks,
  city = 'Самара',
  cityHref,
  cartLabel = '2 818 ₽',
  cartCount,
  logoSrc = '/Jaco-Logo-120.png',
  logoHref = '/',
  compactMenuOpen = false,
  desktopDocsOpen = false,
  desktopDocsActive = false,
  docsLinks = [],
  openNavLabel,
  onCompactMenuClick,
  onCityClick,
  onContactsClick,
  onCartClick,
  onProfileClick,
  onDesktopDocsClick,
  onDropdownClose,
  onCompactMenuItemClick,
  onNavItemClick,
  actions,
  className,
  ...props
}: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const overlayOpen = desktopDocsOpen || Boolean(openNavLabel);
  const handleOutsideClick = useCallback(() => {
    onDropdownClose?.();
  }, [onDropdownClose]);

  useClickOutside(headerRef, handleOutsideClick, overlayOpen);
  useBodyScrollLock(overlayOpen);

  const cartBadge = extractCartCount(cartCount);
  const hasCartItems = Number(cartCount) > 0;
  const compactMenuItems: CompactMenuItem[] = compactMenuLinks?.length
    ? compactMenuLinks.map((item) => ({
        ...item,
        icon:
          compactMenuIconByLabel[item.label] ??
          (item.label === city ? LocationIconMobile : MenuIconMobile),
        badge: item.label === 'Корзина' ? cartBadge : undefined,
        button:
          item.button ?? (item.label === city || item.label === 'Аккаунт'),
      }))
    : buildDefaultCompactMenuItems(logoHref, city, cityHref, cartBadge);

  const { isScrolled } = useGetPageScroll();

  return (
    <header
      id="headerNew"
      ref={headerRef}
      className={cn(
        'ui-header',
        className,
        isScrolled && 'ui-header_scrolled',
        compactMenuOpen && 'ui-header--compact-menu-open'
      )}
      {...props}
    >
      <div className="ui-header__bar">
        <a className="ui-header__logo" href={logoHref} aria-label="Жако">
          <img src={logoSrc} alt="Жако" />
        </a>

        <nav className="ui-header__nav" aria-label="Основное меню">
          {navItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openNavLabel === item.label;
            return (
              <div
                key={item.label}
                className={cn(
                  'ui-header__nav-node',
                  isOpen && 'ui-header__nav-node--open'
                )}
              >
                {item.href && !hasChildren ? (
                  <a
                    className={cn(
                      'ui-header__nav-item',
                      item.variant === 'outlined' &&
                        'ui-header__nav-item--outlined'
                    )}
                    href={item.href}
                    onClick={(event) => onNavItemClick?.(item, event)}
                  >
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <button
                    className={cn(
                      'ui-header__nav-item',
                      item.variant === 'outlined' &&
                        'ui-header__nav-item--outlined'
                    )}
                    type="button"
                    aria-expanded={hasChildren ? isOpen : undefined}
                    onClick={(event) => onNavItemClick?.(item, event)}
                  >
                    <span>{item.label}</span>
                    {hasChildren ? (
                      isOpen ? (
                        <ArrowUpHeader
                          aria-hidden="true"
                          className="ui-header__nav-arrow"
                        />
                      ) : (
                        <ArrowDownHeader
                          aria-hidden="true"
                          className="ui-header__nav-arrow"
                        />
                      )
                    ) : null}
                  </button>
                )}
                {hasChildren ? (
                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        className="ui-header__submenu"
                        key={item.label}
                        {...dropdownMotion}
                      >
                        {item.children?.slice(0, 12).map((child) =>
                          child.href ? (
                            <a
                              key={child.label}
                              className="ui-header__submenu-item"
                              href={child.href}
                              onClick={(event) =>
                                onNavItemClick?.(child, event)
                              }
                            >
                              {child.label}
                            </a>
                          ) : (
                            <button
                              key={child.label}
                              className="ui-header__submenu-item"
                              type="button"
                              onClick={(event) =>
                                onNavItemClick?.(child, event)
                              }
                            >
                              {child.label}
                            </button>
                          )
                        )}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="ui-header__spacer" />

        <button className="ui-header__city" type="button" onClick={onCityClick}>
          <span>{city}</span>
          <LocationHeaderIcon />
        </button>

        <a
          className="ui-header__icon-button ui-header__contacts"
          href={hrefFromBase(logoHref, '/contacts')}
          aria-label="Контакты"
          onClick={onContactsClick}
        >
          <LocationHeaderIcon
            aria-hidden="true"
            className="ui-header__contacts-icon"
          />
        </a>

        <button
          className={cn(
            'ui-header__compact-menu-button',
            compactMenuOpen && 'ui-header__compact-menu-button--active'
          )}
          type="button"
          aria-label={compactMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={compactMenuOpen}
          onClick={onCompactMenuClick}
        >
          <BurgerIconMobile
            aria-hidden="true"
            className={cn(
              'ui-header__compact-menu-button-icon',
              compactMenuOpen && 'ui-header__compact-menu-button-icon--active'
            )}
          />
        </button>

        <div className="ui-header__docs-menu-node">
          <button
            className={cn(
              'ui-header__icon-button',
              'ui-header__docs-button',
              desktopDocsOpen && 'ui-header__icon-button--active',
              desktopDocsActive && 'ui-header__icon-button--active'
            )}
            type="button"
            aria-label={desktopDocsOpen ? 'Закрыть документы' : 'Документы'}
            aria-expanded={desktopDocsOpen}
            onClick={onDesktopDocsClick}
          >
            <JacoDocsIcon className="ui-header__docs-icon" />
          </button>

          {docsLinks.length > 0 ? (
            <AnimatePresence>
              {desktopDocsOpen ? (
                <motion.div
                  className="ui-header__docs-menu"
                  key="docs-menu"
                  {...dropdownMotion}
                >
                  {docsLinks.map((item) => (
                    <a
                      key={item.label}
                      className="ui-header__docs-link"
                      href={item.href ?? '#'}
                      target={
                        item.href?.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        item.href?.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      onClick={(event) => onNavItemClick?.(item, event)}
                    >
                      {item.label}
                    </a>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          ) : null}
        </div>

        <button
          className="ui-header__icon-button ui-header__profile"
          type="button"
          aria-label="Профиль"
          onClick={onProfileClick}
        >
          <ProfileIconNew aria-hidden="true" />
        </button>

        <button
          className={cn(
            'ui-header__cart',
            hasCartItems && 'ui-header__cart--filled'
          )}
          type="button"
          aria-label="Корзина"
          onClick={onCartClick}
        >
          <BasketIconNew aria-hidden="true" />
          {hasCartItems ? <span>{cartLabel}</span> : null}
        </button>

        {actions ? <div className="ui-header__actions">{actions}</div> : null}
      </div>

      <CompactMenu
        open={compactMenuOpen}
        items={compactMenuItems}
        onClose={onDropdownClose}
        onToggle={onCompactMenuClick}
        onProfileClick={onProfileClick}
        onItemClick={onCompactMenuItemClick}
      />
    </header>
  );
}
