import PropTypes from 'prop-types';
import './HeaderPCIcon.scss';
import {LocationHeaderIcon, ProfileIconNew, JacoDocsIcon, BasketIconNew} from '../Icons';

export const HeaderPCIcon = ({ count, icon }) => {
  return (
    <div className={['IconCartHeaderPC', parseInt(count) > 0 ? 'active' : ''].join(' ')}>
      
      { icon == 'location' ? <LocationHeaderIcon className="location" /> : false }
      { icon == 'profile' ? <ProfileIconNew className="profile" /> : false }
      { icon == 'docs' ? <JacoDocsIcon className="docs" /> : false }
      { icon == 'basket' ? <BasketIconNew /> : false }

      {parseInt(count) > 0 ?
        <span>{new Intl.NumberFormat('ru-RU').format(count)} ₽</span>
          :
        false
      }
    </div>
  );
};

HeaderPCIcon.propTypes = {
  count: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(['location', 'profile', 'docs', 'basket']),
};
