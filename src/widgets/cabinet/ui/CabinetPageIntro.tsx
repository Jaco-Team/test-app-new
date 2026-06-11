'use client';

import type { ReactNode } from 'react';
import { useCityStore } from '@src/entities/city';
import type { ProfileSectionKey } from './ProfileSectionNav';
import { ProfileSectionNav } from './ProfileSectionNav';
import './CabinetPageIntro.scss';

export type CabinetPageIntroProps = {
  title: string;
  activePage: ProfileSectionKey;
  description?: ReactNode;
  fallbackCitySlug?: string;
};

export function CabinetPageIntro({
  title,
  activePage,
  description,
  fallbackCitySlug = '',
}: CabinetPageIntroProps) {
  const citySlug =
    useCityStore((state) => state.slug) || String(fallbackCitySlug).trim();

  return (
    <div className="cabinet-page-intro">
      <h1 className="cabinet-page-intro__title">{title}</h1>
      {description ? (
        <div className="cabinet-page-intro__text">{description}</div>
      ) : null}
      <ProfileSectionNav citySlug={citySlug} activePage={activePage} />
    </div>
  );
}
