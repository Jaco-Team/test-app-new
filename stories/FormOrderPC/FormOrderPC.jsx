//import PropTypes from 'prop-types';

import { MySwitch } from '../MySwitch/MySwitch';
import { FormOrderPC_btn } from '../FormOrderPC_btn/FormOrderPC_btn';

import './FormOrderPC.scss';

export const FormOrderPC = ({}) => {
  return (
    <div className="modalFormOrderPC">
      <span className='loginHeader'>Оформить заказ</span>
      <MySwitch type="cart" />
      <FormOrderPC_btn text='тольятти' icon='city' />
    </div>
  );
};

FormOrderPC.propTypes = {
  // city: PropTypes.string.isRequired,
};
