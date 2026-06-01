'use client';

import type { ReactNode } from 'react';
import {
  StoreBootstrap,
  type StoreBootstrapProps,
} from '@src/features/bootstrap/StoreBootstrap';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import { ConnectedHeader } from '@src/widgets/header/ConnectedHeader';
import { AppShell } from '@src/widgets/shell/AppShell';

export type PreviewPageLayoutProps = {
  storeSeed: StoreBootstrapProps;
  /** Yandex map script + MapLoader (cart checkout) */
  loadMap?: boolean;
  header?: {
    fallbackNav?: HeaderNavItem[];
    fallbackCityLabel?: string;
    fallbackCitySlug?: string;
  };
  footer?: ReactNode;
  children: ReactNode;
};

/**
 * Shared preview shell: store bootstrap, global modals (auth, city, basket),
 * connected header, page body, optional footer.
 */
export function PreviewPageLayout({
  storeSeed,
  loadMap = false,
  header,
  footer,
  children,
}: PreviewPageLayoutProps) {
  return (
    <>
      <StoreBootstrap {...storeSeed} />
      <AppShell city={storeSeed.city} loadMap={loadMap} />
      <ConnectedHeader
        fallbackNav={header?.fallbackNav}
        fallbackCityLabel={header?.fallbackCityLabel}
        fallbackCitySlug={header?.fallbackCitySlug ?? storeSeed.city}
      />
      {children}
      {footer}
    </>
  );
}
