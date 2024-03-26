import PropTypes from 'prop-types';
import './IconCartHeaderPC.scss';
import { BasketIconNew } from '../Icons';

export const IconCartHeaderPC = ({ active, count }) => {
  return (
    <>
      {parseInt(count) > 0 ? (
        <div className={['IconCartHeaderPC_count', active ? 'active' : ''].join(' ')}>
          <BasketIconNew />
          <span>{new Intl.NumberFormat('ru-RU').format(1130)} ₽</span>
        </div>
      ) : (
        <div className={['IconCartHeaderPC', active ? 'active' : ''].join(' ')}>
          <BasketIconNew />
        </div>
      )}
    </>
  );
};

IconCartHeaderPC.propTypes = {
  active: PropTypes.bool,
  count: PropTypes.string.isRequired,
};
