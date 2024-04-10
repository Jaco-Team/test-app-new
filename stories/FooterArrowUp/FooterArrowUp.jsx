import PropTypes from 'prop-types';

import './FooterArrowUp.scss';
import { ArrowUp } from '../Icons';

export const FooterArrowUp = ({ arrow }) => {
  return (
    <div className={arrow ? 'ArrowPC' : 'ArrowHidden'}>
      <ArrowUp />
    </div>
  );
};

FooterArrowUp.propTypes = {
  arrow: PropTypes.bool,
};
