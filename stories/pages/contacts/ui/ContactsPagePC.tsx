import { MapPC } from '@stories/widgets/contacts/ui/map/MapPC';
import { MenuContactsPC } from '@stories/features/contacts/ui/contacts-menu/MenuContactsPC';

import './ContactsPagePC.scss';

export const ContactsPagePC = ({ header, menu, map, footer }: Record<string, any>) => {
  return (
    <>
      {header ? null : null}
      <div className="boxContactsPC">
        <MenuContactsPC {...menu} />
        <MapPC {...map} />
      </div>
      {footer ? null : null}
    </>
  );
};

