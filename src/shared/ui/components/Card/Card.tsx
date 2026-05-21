import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Card.scss';

export type CardTone = 'plain' | 'muted' | 'outlined' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  tone?: CardTone;
  padding?: CardPadding;
  as?: 'article' | 'div' | 'section';
  interactive?: boolean;
}

export function Card({
  children,
  tone = 'plain',
  padding = 'md',
  as: Component = 'div',
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        'ui-card',
        'ui-card--tone-' + tone,
        'ui-card--padding-' + padding,
        interactive && 'ui-card--interactive',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
