'use client';

import { ContactMapBootstrap } from '@src/entities/contact';
import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { AppPageShell } from '@src/widgets/layout';
import { ContactsPage } from './ContactsPage';

export type ContactsClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function ContactsClient({ storeSeed }: ContactsClientProps) {
  return (
    <AppPageShell
      storeSeed={storeSeed}
      frameClassName="contacts-page-frame"
      footerClassName="ui-footer--contacts-flush"
      frameVariant="flush"
      beforeFrame={<ContactMapBootstrap city={storeSeed.city} />}
    >
      <ContactsPage />
    </AppPageShell>
  );
}
