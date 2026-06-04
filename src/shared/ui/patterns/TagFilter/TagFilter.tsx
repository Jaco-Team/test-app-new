'use client';

import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { cn } from '../../foundation/classNames';
import './TagFilter.scss';

export type TagFilterItem = {
  label: string;
  active?: boolean;
  tone?: 'default' | 'new';
  id?: string;
};

export interface TagFilterProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  items: TagFilterItem[];
  onChange?: (item: TagFilterItem, index: number) => void;
  onClear?: () => void;
}

export function TagFilter({
  items,
  onChange,
  onClear,
  className,
  ...props
}: TagFilterProps) {
  const initialIndex = items.findIndex((item) => item.active);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    setActiveIndex(items.findIndex((item) => item.active));
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
          const active = activeIndex === index;
          return (
            <button
              key={item.label}
              className={cn(
                'ui-tag-filter__item',
                active && 'ui-tag-filter__item--active',
                item.tone === 'new' && 'ui-tag-filter__item--new'
              )}
              type="button"
              aria-pressed={active}
              onClick={() => {
                const nextIndex = active ? -1 : index;
                setActiveIndex(nextIndex);
                onChange?.(item, nextIndex);
              }}
            >
              <span className="ui-tag-filter__label">{item.label}</span>
              {active && item.tone !== 'new' ? (
                <span className="ui-tag-filter__close" aria-hidden="true">
                  ×
                </span>
              ) : null}
            </button>
          );
        })}
        {activeIndex >= 0 ? (
          <button
            className="ui-tag-filter__item ui-tag-filter__item--clear"
            type="button"
            onClick={() => {
              setActiveIndex(-1);
              onClear?.();
            }}
          >
            <div className="ui-tag-filter__label">Очистить</div>
          </button>
        ) : null}
      </div>
    </section>
  );
}
