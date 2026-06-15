'use client';

import type { ReactNode } from 'react';
import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import type { PageFrameSpacing, PageFrameVariant } from './PageFrame';
import { PageFrame } from './PageFrame';
import { PageLayout } from './PageLayout';

export type AppPageShellProps = {
  storeSeed: StoreBootstrapProps;
  children: ReactNode;
  intro?: ReactNode;
  frameClassName?: string;
  frameVariant?: PageFrameVariant;
  frameSpacing?: PageFrameSpacing;
  footerClassName?: string;
  fallbackNav?: HeaderNavItem[];
  beforeFrame?: ReactNode;
};

export function AppPageShell({
  storeSeed,
  children,
  intro,
  frameClassName,
  frameVariant,
  frameSpacing,
  footerClassName,
  fallbackNav,
  beforeFrame,
}: AppPageShellProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={storeSeed}
      header={{
        fallbackNav,
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
      footerClassName={footerClassName}
    >
      {beforeFrame}
      <PageFrame
        className={frameClassName}
        intro={intro}
        variant={frameVariant}
        spacing={frameSpacing}
      >
        {children}
      </PageFrame>
    </PageLayout>
  );
}
