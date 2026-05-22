import type { HTMLAttributes, ReactNode } from 'react';
import {
  BasketIconNew,
  BurgerIconMobile,
  LocationHeaderIcon,
  ProfileIconNew,
} from '../../icons';
import { cn } from '../../foundation/classNames';
import './Header.scss';

export interface HeaderNavItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  navItems?: HeaderNavItem[];
  city?: string;
  cartLabel?: string;
  logoSrc?: string;
  compactMenuOpen?: boolean;
  onMenuClick?: () => void;
  actions?: ReactNode;
}

const defaultNavItems: HeaderNavItem[] = [
  { label: 'Роллы', active: true },
  { label: 'Пицца' },
  { label: 'Блюда' },
  { label: 'Акции' },
];

export function Header({
  navItems = defaultNavItems,
  city = 'Самара',
  cartLabel = '2 818 ₽',
  logoSrc = '/Jaco-Logo-120.png',
  compactMenuOpen = false,
  onMenuClick,
  actions,
  className,
  ...props
}: HeaderProps) {
  const drawerItems: HeaderNavItem[] = [
    { label: 'Меню', active: true },
    { label: 'Акции' },
    { label: city },
    { label: 'Адреса' },
    { label: 'Жако' },
    { label: 'Аккаунт' },
    { label: cartLabel ? 'Корзина' + cartLabel.replace(/\D/g, '') : 'Корзина' },
  ];

  return (
    <header className={cn('ui-header', className)} {...props}>
      <div className="ui-header__bar">
        <a className="ui-header__logo" href="#" aria-label="Жако">
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
              >
                {item.label}
              </Tag>
            );
          })}
        </nav>

        <div className="ui-header__spacer" />

        <button className="ui-header__city" type="button">
          <LocationHeaderIcon aria-hidden="true" />
          <span>{city}</span>
        </button>

        <button
          className="ui-header__icon"
          type="button"
          aria-label="Меню"
          onClick={onMenuClick}
        >
          <BurgerIconMobile aria-hidden="true" />
        </button>

        <button
          className="ui-header__icon ui-header__profile"
          type="button"
          aria-label="Профиль"
        >
          <ProfileIconNew aria-hidden="true" />
        </button>

        <a className="ui-header__cart" href="#" aria-label="Корзина">
          <BasketIconNew aria-hidden="true" />
          <span>{cartLabel}</span>
        </a>

        {actions ? <div className="ui-header__actions">{actions}</div> : null}
      </div>

      <div
        className={cn(
          'ui-header__drawer',
          compactMenuOpen && 'ui-header__drawer--open'
        )}
      >
        <nav className="ui-header__drawer-nav" aria-label="Мобильное меню">
          {drawerItems.map((item) => (
            <a
              key={item.label}
              className={cn(
                'ui-header__drawer-link',
                item.active && 'ui-header__drawer-link--active'
              )}
              href={item.href ?? '#'}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
