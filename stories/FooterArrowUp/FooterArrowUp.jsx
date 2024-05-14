import PropTypes from 'prop-types';

import './FooterArrowUp.scss';
import { ArrowUp } from '../Icons';

export const FooterArrowUp = ({ arrow, page }) => {
  return (
    <div className={arrow ? 'ArrowPC' : 'ArrowHidden'} style={{marginTop: page === 'contacts' ? '-4.3321299638989vw' : null, transform: page === 'contacts' ? 'translate(0, -50%)' : null}}>
      <ArrowUp />
    </div>
  );
};

FooterArrowUp.propTypes = {
  arrow: PropTypes.bool,
};
