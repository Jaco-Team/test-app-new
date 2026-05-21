import type { ElementType, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Text.scss';

export type TextVariant = 'body' | 'caption' | 'title' | 'headline';
export type TextTone = 'primary' | 'muted' | 'brand' | 'inverse';
export type TextWeight = 'regular' | 'medium' | 'bold';
export type TextProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: TextVariant;
  tone?: TextTone;
  weight?: TextWeight;
};

export function Text({
  as: Component = 'span',
  children,
  className,
  variant = 'body',
  tone = 'primary',
  weight = 'regular',
}: TextProps) {
  return (
    <Component
      className={cn(
        'ui-text',
        'ui-text--' + variant,
        'ui-text--tone-' + tone,
        'ui-text--weight-' + weight,
        className
      )}
    >
      {children}
    </Component>
  );
}
