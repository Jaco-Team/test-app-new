import PropTypes from 'prop-types';

import './FooterArrowUp.scss';
import { ArrowUp } from '../../shared/Icons.js';

export const FooterArrowUp = ({ arrow, page }) => {
  return (
    <div
      className={arrow ? 'ArrowPC' : 'ArrowHidden'}
      style={{
        marginTop: page === 'contacts' ? '-4.3321299638989vw' : undefined,
        transform: page === 'contacts' ? 'translate(0, -50%)' : undefined,
      }}
    >
      <ArrowUp />
    </div>
  );
};

FooterArrowUp.propTypes = {
  arrow: PropTypes.bool,
};
