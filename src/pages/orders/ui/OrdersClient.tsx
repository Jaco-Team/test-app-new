'use client';

import { PageFrame, PageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { CabinetPageIntro } from '@src/pages/profile/ui/CabinetPageIntro';
import { OrdersPage } from './OrdersPage';

export type OrdersClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function OrdersClient({ storeSeed }: OrdersClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={{ ...storeSeed, activePage: 'zakazy' }}
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
    >
      <PageFrame
        className="orders-page-frame"
        intro={
          <CabinetPageIntro
            title="История заказов"
            activePage="zakazy"
            description="Все оформленные заказы собраны в одном месте."
            fallbackCitySlug={storeSeed.city}
          />
        }
      >
        <OrdersPage />
      </PageFrame>
    </PageLayout>
  );
}
