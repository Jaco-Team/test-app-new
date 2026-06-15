'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@ui/foundation/classNames';
import './PageFrame.scss';

export type PageFrameVariant = 'default' | 'flush' | 'cabinet' | 'hero';
export type PageFrameSpacing = 'default' | 'tight-top';

export type PageFrameProps = HTMLAttributes<HTMLElement> & {
  intro?: ReactNode;
  children: ReactNode;
  variant?: PageFrameVariant;
  spacing?: PageFrameSpacing;
};

export function PageFrame({
  className,
  intro,
  children,
  variant = 'default',
  spacing = 'default',
  ...props
}: PageFrameProps) {
  return (
    <main
      className={cn(
        'page-frame',
        variant !== 'default' && `page-frame--${variant}`,
        spacing !== 'default' && `page-frame--spacing-${spacing}`,
        className
      )}
      {...props}
    >
      <div className="page-frame__inner">
        {intro ? <header className="page-frame__intro">{intro}</header> : null}
        <div className="page-frame__content">{children}</div>
      </div>
    </main>
  );
}
