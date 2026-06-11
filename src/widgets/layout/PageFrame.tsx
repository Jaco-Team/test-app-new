'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@ui/foundation/classNames';
import './PageFrame.scss';

export type PageFrameVariant = 'default' | 'flush' | 'cabinet' | 'hero';

export type PageFrameProps = HTMLAttributes<HTMLElement> & {
  intro?: ReactNode;
  children: ReactNode;
  variant?: PageFrameVariant;
};

export function PageFrame({
  className,
  intro,
  children,
  variant = 'default',
  ...props
}: PageFrameProps) {
  return (
    <main
      className={cn(
        'page-frame',
        variant !== 'default' && `page-frame--${variant}`,
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
