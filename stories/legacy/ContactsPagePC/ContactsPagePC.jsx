import { HeaderPC } from '../../widgets/Header/HeaderPC';
import { MapPC } from '../MapPC/MapPC';
import { MenuContactsPC } from '../MenuContactsPC/MenuContactsPC';
import { FooterPC } from '../../widgets/Footer/Footer';

import PropTypes from 'prop-types';
import './ContactsPagePC.scss';

export const ContactsPagePC = ({ header, menu, map, footer }) => {
  return (
    <>
      <HeaderPC {...header} />
      <div className="boxContactsPC">
        <MenuContactsPC {...menu} />
        <MapPC {...map} />
      </div>
      <FooterPC {...footer} />
    </>
  );
};

ContactsPagePC.propTypes = {
  header: PropTypes.object,
  menu: PropTypes.object,
  map: PropTypes.object,
  footer: PropTypes.object,
};
