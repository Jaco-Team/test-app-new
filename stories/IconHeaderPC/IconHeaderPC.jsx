import PropTypes from 'prop-types';
import './IconHeaderPC.scss';
import {LocationHeaderIcon, ProfileIconNew, JacoDocsIcon} from '../Icons';

export const IconHeaderPC = ({ title, active }) => {
  return (
    <div className={['IconHeaderPC', active ? 'active' : ''].join(' ')}>
      {title === 'contacts' ? (
        <LocationHeaderIcon className="location" />
      ) : title === 'profile' ? (
        <ProfileIconNew className="profile" />
      ) : (
        <JacoDocsIcon className="docs" />
      )}
    </div>
  );
};

IconHeaderPC.propTypes = {
  title: PropTypes.oneOf(['contacts', 'profile', 'docs']),
  active: PropTypes.bool,
};
