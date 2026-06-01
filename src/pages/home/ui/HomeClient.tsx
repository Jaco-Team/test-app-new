'use client';

import { PreviewPageLayout } from '@src/widgets/layout';
import { FooterCookie } from '@src/widgets/shell/FooterCookie';
import { Footer } from '@ui/widgets';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import type { HomePageViewModel } from '../model/types';
import { HomePage } from './HomePage';

export type HomeClientProps = {
  model: HomePageViewModel;
  storeSeed: StoreBootstrapProps;
};

export function HomeClient({ model, storeSeed }: HomeClientProps) {
  return (
    <PreviewPageLayout
      storeSeed={storeSeed}
      header={{
        fallbackNav: model.headerNav,
        fallbackCityLabel: model.cityLabel,
        fallbackCitySlug: model.citySlug,
      }}
      footer={
        <>
          <Footer
            citySlug={model.citySlug}
            cityLabel={model.cityLabel}
            linkGroups={model.footerLinks}
            socialLinks={model.footerSocialLinks}
          />
          <FooterCookie citySlug={model.citySlug} />
        </>
      }
    >
      <HomePage model={model} />
    </PreviewPageLayout>
  );
}
