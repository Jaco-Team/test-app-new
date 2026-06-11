'use client';

import { ContactMapBootstrap } from '@src/entities/contact';
import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { PageFrame, PageLayout } from '@src/widgets/layout';
import { CartPage, CartPageIntro } from './CartPage';

export type CartClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function CartClient({ storeSeed }: CartClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={storeSeed}
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
    >
      <ContactMapBootstrap city={storeSeed.city} />
      <PageFrame intro={<CartPageIntro />}>
        <CartPage />
      </PageFrame>
    </PageLayout>
  );
}
