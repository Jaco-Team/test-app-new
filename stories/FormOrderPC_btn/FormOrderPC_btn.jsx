import { useState } from 'react';
import PropTypes from 'prop-types';
import { IconPC } from '../IconPC/IconPC';
import { ArrowDownBasketModalPC } from '../Icons';

import './FormOrderPC_btn.scss';

export const FormOrderPC_btn = ({ text, icon }) => {
  const [open, setOpen] = useState('');
  return (
    <div className="btnChoice" onClick={() => setOpen(!open)}>
      <IconPC icon={icon} element="form_order" />
      <span>{text}</span>
      {open ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC />}
    </div>
  );
};

FormOrderPC_btn.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
