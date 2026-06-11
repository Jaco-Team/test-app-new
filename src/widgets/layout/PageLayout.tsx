'use client';

import type { ReactNode } from 'react';
import {
  StoreBootstrap,
  type StoreBootstrapProps,
} from '@src/features/bootstrap/StoreBootstrap';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import { ConnectedHeader } from '@src/widgets/header/ConnectedHeader';
import { AppShell } from '@src/widgets/shell/AppShell';
import { PageFooter } from './PageFooter';
import './PageLayout.scss';

export type PageLayoutProps = {
  storeSeed: StoreBootstrapProps;
  header?: {
    fallbackNav?: HeaderNavItem[];
    fallbackCityLabel?: string;
    fallbackCitySlug?: string;
  };
  footerClassName?: string;
  children: ReactNode;
};

/**
 * Shared app shell: store bootstrap, global modals, connected header,
 * page body scaffold, and standard footer.
 */
export function PageLayout({
  storeSeed,
  header,
  footerClassName,
  children,
}: PageLayoutProps) {
  return (
    <div className="page-layout">
      <StoreBootstrap {...storeSeed} />
      <AppShell city={storeSeed.city} />
      <ConnectedHeader
        fallbackNav={header?.fallbackNav}
        fallbackCityLabel={header?.fallbackCityLabel}
        fallbackCitySlug={header?.fallbackCitySlug ?? storeSeed.city}
      />
      <div className="page-layout__content">{children}</div>
      <PageFooter
        storeSeed={storeSeed}
        cityLabel={header?.fallbackCityLabel}
        className={footerClassName}
      />
    </div>
  );
}
