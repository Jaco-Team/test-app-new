import type { HTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import './CategoryMenu.scss';

export interface CategoryMenuItem {
  label: string;
  active?: boolean;
}

export interface CategoryMenuProps extends HTMLAttributes<HTMLElement> {
  primaryItems?: CategoryMenuItem[];
  secondaryItems?: CategoryMenuItem[];
}

const primaryDefault: CategoryMenuItem[] = [
  { label: 'Роллы', active: true },
  { label: 'Пицца' },
  { label: 'Блюда' },
];

const secondaryDefault: CategoryMenuItem[] = [
  { label: 'Сеты', active: true },
  { label: 'Фирменные' },
  { label: 'Жареные' },
  { label: 'Запечённые' },
  { label: 'Классика' },
];

export function CategoryMenu({
  primaryItems = primaryDefault,
  secondaryItems = secondaryDefault,
  className,
  ...props
}: CategoryMenuProps) {
  return (
    <nav
      className={cn('ui-category-menu', className)}
      aria-label="Категории"
      {...props}
    >
      <div className="ui-category-menu__row ui-category-menu__row--primary">
        {primaryItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              'ui-category-menu__item',
              item.active && 'ui-category-menu__item--active'
            )}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="ui-category-menu__row ui-category-menu__row--secondary">
        {secondaryItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              'ui-category-menu__item',
              'ui-category-menu__item--secondary',
              item.active && 'ui-category-menu__item--active'
            )}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
