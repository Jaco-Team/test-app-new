import React from 'react';
import PropTypes from 'prop-types';
import './MyCatLink.scss';

import { ArrowDownHeaderPC } from '../Icons';

export const MyCatLink = ({ variant, bordered, children, arrow, ...props }) => {
  if (variant == 'link') {
    return (
      <a
        className={['MyCatLink', bordered ? 'bordered' : ''].join(' ')}
        {...props}
      >
        {children}
        { arrow ? <ArrowDownHeaderPC /> : false }
      </a>
    );
  }

  return (
    <p
      className={['MyCatLink', bordered ? 'bordered' : ''].join(' ')}
      {...props}
    >
      {children}
      { arrow ? <ArrowDownHeaderPC /> : false }
    </p>
  );
};

MyCatLink.propTypes = {
  variant: PropTypes.oneOf(['link', 'text']),
  bordered: PropTypes.bool,
  arrow: PropTypes.bool,
  children: PropTypes.node,
};
