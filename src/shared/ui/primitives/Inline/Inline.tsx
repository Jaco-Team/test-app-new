import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Inline.scss';

export type InlineGap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type InlineAlign = 'start' | 'center' | 'end' | 'stretch';
export type InlineJustify = 'start' | 'center' | 'end' | 'between';

export type InlineProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  gap?: InlineGap;
  align?: InlineAlign;
  justify?: InlineJustify;
  wrap?: boolean;
  style?: CSSProperties;
};

export function Inline({
  as: Component = 'div',
  children,
  className,
  gap = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  style,
}: InlineProps) {
  return (
    <Component
      className={cn(
        'ui-inline',
        'ui-inline--gap-' + gap,
        'ui-inline--align-' + align,
        'ui-inline--justify-' + justify,
        wrap && 'ui-inline--wrap',
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}
