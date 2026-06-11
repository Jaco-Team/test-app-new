'use client';

import { ContactMapBootstrap } from '@src/entities/contact';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { PageFrame, PageLayout } from '@src/widgets/layout';
import { ContactsPage } from './ContactsPage';

export type ContactsClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function ContactsClient({ storeSeed }: ContactsClientProps) {
  const cityLabel = resolveCityLabel(storeSeed.city, storeSeed.cities);

  return (
    <PageLayout
      storeSeed={{ ...storeSeed, activePage: 'contacts' }}
      header={{
        fallbackCitySlug: storeSeed.city,
        fallbackCityLabel: cityLabel,
      }}
      footerClassName="ui-footer--contacts-flush"
    >
      <ContactMapBootstrap city={storeSeed.city} />
      <PageFrame className="contacts-page-frame">
        <ContactsPage />
      </PageFrame>
    </PageLayout>
  );
}
