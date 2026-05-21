import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './IconButton.scss';
export type IconButtonTone = 'neutral' | 'brand' | 'inverse';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonProps = {
  children: ReactNode;
  tone?: IconButtonTone;
  size?: IconButtonSize;
  label: string;
  active?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;
export function IconButton({
  children,
  tone = 'neutral',
  size = 'md',
  label,
  active = false,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'ui-icon-button',
        'ui-icon-button--tone-' + tone,
        'ui-icon-button--size-' + size,
        active && 'ui-icon-button--active',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
