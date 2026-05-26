import type { HTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import './CategoryMenu.scss';

export interface CategoryMenuItem {
  label: string;
  active?: boolean;
  targetId?: string;
}

export interface CategoryMenuProps extends HTMLAttributes<HTMLElement> {
  primaryItems?: CategoryMenuItem[];
  secondaryItems?: CategoryMenuItem[];
  activeTargetId?: string;
  onItemSelect?: (item: CategoryMenuItem) => void;
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
  activeTargetId,
  onItemSelect,
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
              (activeTargetId
                ? activeTargetId === item.targetId
                : item.active) && 'ui-category-menu__item--active'
            )}
            type="button"
            onClick={() => onItemSelect?.(item)}
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
              (activeTargetId
                ? activeTargetId === item.targetId
                : item.active) && 'ui-category-menu__item--active'
            )}
            type="button"
            onClick={() => onItemSelect?.(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
