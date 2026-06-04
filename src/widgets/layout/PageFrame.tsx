'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@ui/foundation/classNames';
import './PageFrame.scss';

export type PageFrameProps = HTMLAttributes<HTMLElement> & {
  intro?: ReactNode;
  children: ReactNode;
};

export function PageFrame({
  className,
  intro,
  children,
  ...props
}: PageFrameProps) {
  return (
    <main className={cn('page-frame', className)} {...props}>
      <div className="page-frame__inner">
        {intro ? <header className="page-frame__intro">{intro}</header> : null}
        <div className="page-frame__content">{children}</div>
      </div>
    </main>
  );
}
