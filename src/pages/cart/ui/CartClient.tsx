'use client';

import { PreviewPageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { CartPage } from './CartPage';

export type CartClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function CartClient({ storeSeed }: CartClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PreviewPageLayout
      storeSeed={{ ...storeSeed, activePage: 'cart' }}
      loadMap
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
    >
      <CartPage />
    </PreviewPageLayout>
  );
}
