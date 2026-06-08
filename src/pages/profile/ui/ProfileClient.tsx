'use client';

import { PageFrame, PageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { CabinetPageIntro } from './CabinetPageIntro';
import { ProfilePage } from './ProfilePage';

export type ProfileClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function ProfileClient({ storeSeed }: ProfileClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={{ ...storeSeed, activePage: 'profile' }}
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
    >
      <PageFrame
        className="profile-page-frame"
        intro={
          <CabinetPageIntro
            title="Личные данные"
            activePage="profile"
            description="Настройте контактные данные, уведомления и адреса доставки."
            fallbackCitySlug={storeSeed.city}
          />
        }
      >
        <ProfilePage />
      </PageFrame>
    </PageLayout>
  );
}
