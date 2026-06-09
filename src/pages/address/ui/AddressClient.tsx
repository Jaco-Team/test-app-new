'use client';

import { PageFrame, PageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { AddressPage } from './AddressPage';

export type AddressClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function AddressClient({ storeSeed }: AddressClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={{ ...storeSeed, activePage: 'address' }}
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
    >
      <PageFrame className="address-page-frame">
        <AddressPage />
      </PageFrame>
    </PageLayout>
  );
}
