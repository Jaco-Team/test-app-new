import { Map } from '@stories/widgets/contacts/ui/map/Map';
import { MenuContacts } from '@stories/features/contacts/ui/contacts-menu/MenuContacts';

import './ContactsPage.scss';
import React from 'react';
import { ContactsPageProps } from '@stories/pages/contacts/ui/model/types';

export const ContactsPage = ({
  header,
  menu,
  map,
  footer,
}: ContactsPageProps) => {
  return (
    <>
      {header ? null : null}
      <div className="contacts-page">
        <MenuContacts {...menu} />
        <Map {...map} />
      </div>
      {footer ? null : null}
    </>
  );
};
