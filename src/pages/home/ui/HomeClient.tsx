'use client';

import { PageLayout } from '@src/widgets/layout';
import type { StoreBootstrapProps } from '@src/features/bootstrap';
import type { HomePageViewModel } from '../model/types';
import { HomePage } from './HomePage';

export type HomeClientProps = {
  model: HomePageViewModel;
  storeSeed: StoreBootstrapProps;
};

export function HomeClient({ model, storeSeed }: HomeClientProps) {
  return (
    <PageLayout
      storeSeed={storeSeed}
      header={{
        fallbackNav: model.headerNav,
        fallbackCityLabel: model.cityLabel,
        fallbackCitySlug: model.citySlug,
      }}
    >
      <HomePage model={model} />
    </PageLayout>
  );
}
