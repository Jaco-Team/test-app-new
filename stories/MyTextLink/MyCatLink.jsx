import React from 'react';
import PropTypes from 'prop-types';
import './MyCatLink.scss';
import { roboto } from '../Font.js'

export const MyCatLink = ({ variant, bordered, children, ...props }) => {

  if( variant == 'link' ){
    return (
      <a 
        className={[roboto.variable, 'MyCatLink', (bordered ? 'bordered' : '')].join(' ')} 
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <p
      className={[roboto.variable, 'MyCatLink', (bordered ? 'bordered' : '')].join(' ')} 
      {...props}
    >
      {children}
    </p>
  );
};

MyCatLink.propTypes = {
  variant: PropTypes.oneOf(['link', 'text']),
  bordered: PropTypes.bool,
  children: PropTypes.node,
};