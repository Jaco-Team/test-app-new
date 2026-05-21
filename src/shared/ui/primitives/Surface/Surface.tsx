import type { ElementType, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Surface.scss';

export type SurfaceTone = 'plain' | 'muted' | 'outlined' | 'brand';
export type SurfaceRadius = 'none' | 'sm' | 'md' | 'lg';
export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';
export type SurfaceProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  tone?: SurfaceTone;
  radius?: SurfaceRadius;
  padding?: SurfacePadding;
};

export function Surface({
  as: Component = 'div',
  children,
  className,
  tone = 'plain',
  radius = 'md',
  padding = 'md',
}: SurfaceProps) {
  return (
    <Component
      className={cn(
        'ui-surface',
        'ui-surface--tone-' + tone,
        'ui-surface--radius-' + radius,
        'ui-surface--padding-' + padding,
        className
      )}
    >
      {children}
    </Component>
  );
}
