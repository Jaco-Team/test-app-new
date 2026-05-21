import type { ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Breadcrumbs.scss';
export type BreadcrumbItem = { label: ReactNode; href?: string };
export type BreadcrumbsProps = { items: BreadcrumbItem[]; className?: string };
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn('ui-breadcrumbs', className)}
      aria-label="Хлебные крошки"
    >
      <ol className="ui-breadcrumbs__list">
        {items.map((item, index) => (
          <li className="ui-breadcrumbs__item" key={index}>
            {item.href && index < items.length - 1 ? (
              <a className="ui-breadcrumbs__link" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span className="ui-breadcrumbs__current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
