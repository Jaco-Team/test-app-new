'use client';

import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { cn } from '../../foundation/classNames';
import './TagFilter.scss';

export type TagFilterItem = {
  label: string;
  active?: boolean;
};

export interface TagFilterProps extends HTMLAttributes<HTMLDivElement> {
  items: TagFilterItem[];
  onChange?: (item: TagFilterItem, index: number) => void;
}

export function TagFilter({
  items,
  onChange,
  className,
  ...props
}: TagFilterProps) {
  const initialIndex = Math.max(
    0,
    items.findIndex((item) => item.active)
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    setActiveIndex(
      Math.max(
        0,
        items.findIndex((item) => item.active)
      )
    );
  }, [items]);

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
        {items.map((item, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={item.label}
              className={cn(
                'ui-tag-filter__item',
                active && 'ui-tag-filter__item--active'
              )}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setActiveIndex(index);
                onChange?.(item, index);
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
