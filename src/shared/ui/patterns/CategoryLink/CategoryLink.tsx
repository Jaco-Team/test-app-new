import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowDownHeaderPC } from '../../icons';
import { cn } from '../../foundation/classNames';
import './CategoryLink.scss';
export type CategoryLinkTone = 'plain' | 'bordered' | 'active';
export type CategoryLinkProps = {
  children: ReactNode;
  tone?: CategoryLinkTone;
  withArrow?: boolean;
  as?: 'a' | 'button';
} & AnchorHTMLAttributes<HTMLAnchorElement>;
export function CategoryLink({
  children,
  tone = 'plain',
  withArrow = false,
  className,
  as = 'a',
  ...props
}: CategoryLinkProps) {
  const content = (
    <>
      {children}
      {withArrow ? <ArrowDownHeaderPC /> : null}
    </>
  );
  if (as === 'button')
    return (
      <button
        type="button"
        className={cn(
          'ui-category-link',
          'ui-category-link--tone-' + tone,
          className
        )}
      >
        {content}
      </button>
    );
  return (
    <a
      className={cn(
        'ui-category-link',
        'ui-category-link--tone-' + tone,
        className
      )}
      {...props}
    >
      {content}
    </a>
  );
}
