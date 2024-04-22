import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import { IconClose } from '../Icons';

import './AlertPC.scss';

export const AlertPC = ({ text, status }) => {
  return (
    <div className="modalAlertPC" style={{ backgroundColor: status ? 'rgb(46, 125, 50)' : '#dd1a32' }}>
      <IconButton>
        <IconClose />
      </IconButton>
      <div className="containerAlert">
        <span>{text}</span>
        <LinearProgress variant="determinate" size="sm" value={100} />
      </div>
    </div>
  );
};

AlertPC.propTypes = {
  text: PropTypes.string.isRequired,
  status: PropTypes.bool
};
