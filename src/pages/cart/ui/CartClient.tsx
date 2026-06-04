'use client';

import { PageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { CartPage, CartPageIntro } from './CartPage';

export type CartClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function CartClient({ storeSeed }: CartClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={{ ...storeSeed, activePage: 'cart' }}
      loadMap
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
    >
      <CartPageIntro />
      <CartPage />
    </PageLayout>
  );
}
