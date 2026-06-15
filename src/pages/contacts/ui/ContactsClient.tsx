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
      footerClassName="ui-footer--contacts-flush"
      frameVariant="flush"
      frameSpacing="tight-top"
      beforeFrame={<ContactMapBootstrap city={storeSeed.city} />}
    >
      <ContactsPage />
    </AppPageShell>
  );
}
