import PropTypes from 'prop-types';
import './SelectAddress.scss';

export const SelectAddress = ({ list }) => {
  return (
    <div className="modalSelectPC">
      <span>Выбор адреса</span>
      <ul>
        {list?.map((addr, key) => (
          <li key={key}>{addr.addressLine}</li>
        ))}
      </ul>
    </div>
  );
};

SelectAddress.propTypes = {
  list: PropTypes.array,
};
