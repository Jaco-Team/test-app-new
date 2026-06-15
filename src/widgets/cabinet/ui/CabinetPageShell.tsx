'use client';

import type { ReactNode } from 'react';
import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { AppPageShell } from '@src/widgets/layout';
import type { PageFrameSpacing, PageFrameVariant } from '@src/widgets/layout';
import type { ProfileSectionKey } from './ProfileSectionNav';
import { CabinetPageIntro } from './CabinetPageIntro';

export type CabinetPageShellProps = {
  storeSeed: StoreBootstrapProps;
  children: ReactNode;
  activePage: ProfileSectionKey;
  title: string;
  description?: ReactNode;
  frameClassName?: string;
  frameVariant?: PageFrameVariant;
  frameSpacing?: PageFrameSpacing;
};

export function CabinetPageShell({
  storeSeed,
  children,
  activePage,
  title,
  description,
  frameClassName,
  frameVariant,
  frameSpacing,
}: CabinetPageShellProps) {
  return (
    <AppPageShell
      storeSeed={storeSeed}
      frameClassName={frameClassName}
      frameVariant={frameVariant}
      frameSpacing={frameSpacing}
      intro={
        <CabinetPageIntro
          title={title}
          activePage={activePage}
          description={description}
          fallbackCitySlug={storeSeed.city}
        />
      }
    >
      {children}
    </AppPageShell>
  );
}
