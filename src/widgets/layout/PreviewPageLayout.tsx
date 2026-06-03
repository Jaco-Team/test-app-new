'use client';

import type { ReactNode } from 'react';
import {
  StoreBootstrap,
  type StoreBootstrapProps,
} from '@src/features/bootstrap/StoreBootstrap';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import { ConnectedHeader } from '@src/widgets/header/ConnectedHeader';
import { AppShell } from '@src/widgets/shell/AppShell';
import { PreviewPageFooter } from './PreviewPageFooter';
import './PreviewPageLayout.scss';

export type PreviewPageLayoutProps = {
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
 * Shared preview shell: store bootstrap, global modals, connected header,
 * page body, and standard preview footer.
 */
export function PreviewPageLayout({
  storeSeed,
  loadMap = false,
  header,
  children,
}: PreviewPageLayoutProps) {
  return (
    <div className="preview-page-layout">
      <StoreBootstrap {...storeSeed} />
      <AppShell city={storeSeed.city} loadMap={loadMap} />
      <ConnectedHeader
        fallbackNav={header?.fallbackNav}
        fallbackCityLabel={header?.fallbackCityLabel}
        fallbackCitySlug={header?.fallbackCitySlug ?? storeSeed.city}
      />
      {children}
      <PreviewPageFooter
        storeSeed={storeSeed}
        cityLabel={header?.fallbackCityLabel}
      />
    </div>
  );
}
