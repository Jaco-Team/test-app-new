'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import {
  StoreBootstrap,
  type StoreBootstrapProps,
} from '@src/features/bootstrap/StoreBootstrap';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import { cn } from '@ui/foundation/classNames';
import { ConnectedHeader } from '@src/widgets/header/ConnectedHeader';
import { AppShell } from '@src/widgets/shell/AppShell';
import { PageFooter } from './PageFooter';
import './PageLayout.scss';

export type PageLayoutProps = HTMLAttributes<HTMLDivElement> & {
  storeSeed: StoreBootstrapProps;
  /** Yandex map script + MapLoader (cart checkout) */
  loadMap?: boolean;
  header?: {
    fallbackNav?: HeaderNavItem[];
    fallbackCityLabel?: string;
    fallbackCitySlug?: string;
  };
  children: ReactNode;
};

/**
 * Shared app shell: store bootstrap, global modals, connected header,
 * page body scaffold, and standard footer.
 */
export function PageLayout({
  storeSeed,
  loadMap = false,
  header,
  children,
  className,
  ...props
}: PageLayoutProps) {
  return (
    <div className="page-layout">
      <StoreBootstrap {...storeSeed} />
      <AppShell city={storeSeed.city} loadMap={loadMap} />
      <ConnectedHeader
        fallbackNav={header?.fallbackNav}
        fallbackCityLabel={header?.fallbackCityLabel}
        fallbackCitySlug={header?.fallbackCitySlug ?? storeSeed.city}
      />
      <div className={cn('page-layout__body', className)} {...props}>
        <div className="page-layout__inner">{children}</div>
      </div>
      <PageFooter storeSeed={storeSeed} cityLabel={header?.fallbackCityLabel} />
    </div>
  );
}
