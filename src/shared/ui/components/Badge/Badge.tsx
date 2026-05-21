import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Badge.scss';

export type BadgeTone = 'new' | 'hit' | 'sale' | 'neutral' | 'success';
export type BadgeSize = 'sm' | 'md' | 'lg';

const labels: Record<BadgeTone, string> = {
  new: 'новинка',
  hit: 'хит',
  sale: 'скидка',
  neutral: 'метка',
  success: 'готово',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  children?: ReactNode;
}

export function Badge({
  tone = 'neutral',
  size = 'md',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'ui-badge',
        'ui-badge--tone-' + tone,
        'ui-badge--size-' + size,
        className
      )}
      {...props}
    >
      {children ?? labels[tone]}
    </span>
  );
}
