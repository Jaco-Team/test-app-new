'use client';

import { PageFrame, PageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { CabinetPageIntro } from '@src/pages/profile/ui/CabinetPageIntro';
import { PromosPage } from './PromosPage';

export type PromosClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function PromosClient({ storeSeed }: PromosClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={{ ...storeSeed, activePage: 'promokody' }}
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
    >
      <PageFrame
        className="promos-page-frame"
        intro={
          <CabinetPageIntro
            title="Мои промокоды"
            activePage="promokody"
            description="Здесь собираются действующие промокоды и подарки."
            fallbackCitySlug={storeSeed.city}
          />
        }
      >
        <PromosPage />
      </PageFrame>
    </PageLayout>
  );
}
