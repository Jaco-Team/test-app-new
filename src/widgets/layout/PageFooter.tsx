'use client';

import type { StoreBootstrapProps } from '@src/features/bootstrap';
import {
  mapFooterLinks,
  mapFooterSocialLinks,
} from '@src/shared/lib/footerLinks';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { Footer } from '@ui/widgets';
import { FooterCookie } from '@src/widgets/shell/FooterCookie';

export type PageFooterProps = {
  storeSeed: StoreBootstrapProps;
  cityLabel?: string;
  className?: string;
};

export function PageFooter({
  storeSeed,
  cityLabel,
  className,
}: PageFooterProps) {
  const resolvedCityLabel =
    cityLabel ?? resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <>
      <Footer
        className={className}
        citySlug={storeSeed.city}
        cityLabel={resolvedCityLabel}
        linkGroups={mapFooterLinks(storeSeed.city, storeSeed.links)}
        socialLinks={mapFooterSocialLinks(storeSeed.links)}
      />
      <FooterCookie citySlug={storeSeed.city} />
    </>
  );
}
