import React from 'react';
import PropTypes from 'prop-types';
import './MyButton.scss';

export const MyButton = ({ variant, size, children, ...props }) => {
  return (
    <button
      type="button"
      className={['MyButton', variant, size].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};

MyButton.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  children: PropTypes.node,
};
