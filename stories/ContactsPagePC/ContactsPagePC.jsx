import { HeaderPC } from '../HeaderPC/HeaderPC';
import { MapPC } from '../MapPC/MapPC';
import { MenuContactsPC } from '../MenuContactsPC/MenuContactsPC';
import { FooterPC } from '../FooterPC/FooterPC';

import PropTypes from 'prop-types';
import './ContactsPagePC.scss';

export const ContactsPagePC = ({ header, menu, map, footer }) => {
  return (
    <>
      <HeaderPC {...header} />
      <div className="boxContactsPC">
        <MenuContactsPC {...menu} />
        <MapPC {...map} />
        <FooterPC {...footer} />
      </div>
    </>
  );
};

ContactsPagePC.propTypes = {
  header: PropTypes.object,
  menu: PropTypes.object,
  map: PropTypes.object,
  footer: PropTypes.object,
};
