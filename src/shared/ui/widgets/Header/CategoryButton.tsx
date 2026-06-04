import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';

export type CategoryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  secondary?: boolean;
  iconOnly?: boolean;
  children: ReactNode;
};

export function CategoryButton({
  active = false,
  secondary = false,
  iconOnly = false,
  className,
  children,
  type = 'button',
  ...props
}: CategoryButtonProps) {
  return (
    <button
      className={cn(
        'ui-category-button',
        active && 'ui-category-button--active',
        secondary && 'ui-category-button--secondary',
        iconOnly && 'ui-category-button--icon',
        className
      )}
      type={type}
      aria-pressed={active && !iconOnly ? true : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
