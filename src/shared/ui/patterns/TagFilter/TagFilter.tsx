import type { HTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import './TagFilter.scss';

export type TagFilterItem = {
  label: string;
  active?: boolean;
};

export interface TagFilterProps extends HTMLAttributes<HTMLDivElement> {
  items: TagFilterItem[];
}

export function TagFilter({ items, className, ...props }: TagFilterProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('ui-tag-filter', className)}
      aria-label="Фильтры"
      {...props}
    >
      <div className="ui-tag-filter__list">
        {items.map((item) => (
          <button
            key={item.label}
            className={cn(
              'ui-tag-filter__item',
              item.active && 'ui-tag-filter__item--active'
            )}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
