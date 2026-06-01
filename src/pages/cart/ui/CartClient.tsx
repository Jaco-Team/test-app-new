'use client';

import { PreviewPageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { CartPage } from './CartPage';

export type CartClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function CartClient({ storeSeed }: CartClientProps) {
  return (
    <PreviewPageLayout
      storeSeed={{ ...storeSeed, activePage: 'cart' }}
      loadMap
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: storeSeed.city,
      }}
    >
      <CartPage />
    </PreviewPageLayout>
  );
}
