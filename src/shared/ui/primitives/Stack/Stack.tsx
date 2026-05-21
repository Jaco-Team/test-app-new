import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Stack.scss';

export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'stretch' | 'start' | 'center' | 'end';

export type StackProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  gap?: StackGap;
  align?: StackAlign;
  fullWidth?: boolean;
  style?: CSSProperties;
};

export function Stack({
  as: Component = 'div',
  children,
  className,
  gap = 'md',
  align = 'stretch',
  fullWidth = false,
  style,
}: StackProps) {
  return (
    <Component
      className={cn(
        'ui-stack',
        'ui-stack--gap-' + gap,
        'ui-stack--align-' + align,
        fullWidth && 'ui-stack--full',
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}
