'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@ui/foundation/classNames';
import './PreviewPageFrame.scss';

export type PreviewPageFrameProps = HTMLAttributes<HTMLElement> & {
  intro?: ReactNode;
  children: ReactNode;
};

export function PreviewPageFrame({
  className,
  intro,
  children,
  ...props
}: PreviewPageFrameProps) {
  return (
    <main className={cn('preview-page-frame', className)} {...props}>
      <div className="preview-page-frame__inner">
        {intro ? (
          <header className="preview-page-frame__intro">{intro}</header>
        ) : null}
        <div className="preview-page-frame__content">{children}</div>
      </div>
    </main>
  );
}
