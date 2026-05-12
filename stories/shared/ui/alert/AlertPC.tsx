import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import { IconClose } from '../../Icons.js';

import './AlertPC.scss';

type AlertPCProps = {
  text?: string;
  status?: boolean;
};

export const AlertPC = ({ text, status }: AlertPCProps) => {
  return (
    <div className="modalAlertPC" style={{ backgroundColor: status ? 'rgb(46, 125, 50)' : '#dd1a32' }}>
      <IconButton>
        <IconClose />
      </IconButton>
      <div className="containerAlert">
        <span>{text}</span>
        <LinearProgress variant="determinate" value={100} />
      </div>
    </div>
  );
};
