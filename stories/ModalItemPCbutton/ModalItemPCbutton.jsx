import PropTypes from 'prop-types';
import './ModalItemPCbutton.scss';

export const ModalItemPCbutton = ({ typeModal, price, count }) => {
  return (
    <>
      {count === 0 ? (
        <button className='btn' disabled={typeModal === 'start' ? false : true}>
          {new Intl.NumberFormat('ru-RU').format(price)} ₽
        </button>
      ) : (
        <div className='container'>
          <button disabled={typeModal === 'start' ? false : true}>–</button>
          <span>{count}</span>
          <button disabled={typeModal === 'start' ? false : true}>+</button>
        </div>
      )}
    </>
  );
};

ModalItemPCbutton.propTypes = {
  typeModal: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  count: PropTypes.number
};
