import PropTypes from 'prop-types';
import './MyButton.scss';

import { VectorCity } from '../Icons';

export const MyButton = ({ variant, size, children, arrow, isOpen, typeModal, element, count, ...props }) => {

  if(!element) {
    const back = variant === 'city' && isOpen ? 'rgba(0, 0, 0, 0.05)' : variant === 'primary' || variant === 'cart' ? '#da1a32' : variant === 'auth' ? 'rgba(0, 0, 0, 0.1)' : '#fff';
  
    return (
      <button type="button" className={['MyButton', variant, size].join(' ')} style={{ backgroundColor: back}} {...props}>
        <span>{children}</span>
        {arrow ? !isOpen ? <VectorCity /> : <VectorCity style={{ transform: 'rotate(180deg)' }} /> : false}
      </button>
    );
  }

  if(element === 'modal') {
    return (
      <>
        {count === 0 ? (
          <button className='modalBTN' disabled={typeModal === 'start' ? false : true}>
            {new Intl.NumberFormat('ru-RU').format(children)} ₽
          </button>
        ) : (
          <div className='containerModalBTN'>
            <button disabled={typeModal === 'start' ? false : true}>–</button>
            <span>{count}</span>
            <button disabled={typeModal === 'start' ? false : true}>+</button>
          </div>
        )}
      </>
    )
  }

};

MyButton.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'city', 'auth', 'cart']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'big']),
  children: PropTypes.node,
  typeModal: PropTypes.string.isRequired,
  count: PropTypes.number,
  element: PropTypes.string.isRequired,
};
