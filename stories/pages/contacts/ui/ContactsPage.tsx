import { Map } from '@stories/widgets/contacts/ui/map/Map';
import { MenuContacts } from '@stories/features/contacts/ui/contacts-menu/MenuContacts';

import './ContactsPage.scss';

interface ContactsPageProps {
  header?: unknown;
  menu: Record<string, unknown>;
  map: Record<string, unknown>;
  footer?: unknown;
}

export const ContactsPage = ({
  header,
  menu,
  map,
  footer,
}: ContactsPageProps) => {
  return (
    <>
      {header ? null : null}
      <div className="boxContactsPC">
        <MenuContacts {...menu} />
        <Map {...map} />
      </div>
      {footer ? null : null}
    </>
  );
};
