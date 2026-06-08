'use client';

import { PageFrame, PageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { AccountPage } from './AccountPage';

export type AccountClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function AccountClient({ storeSeed }: AccountClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={{ ...storeSeed, activePage: 'account' }}
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
    >
      <PageFrame className="account-page-frame">
        <AccountPage />
      </PageFrame>
    </PageLayout>
  );
}
