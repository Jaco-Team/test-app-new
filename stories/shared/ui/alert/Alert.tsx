import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import { IconClose } from '../../Icons';

import './Alert.scss';

type AlertProps = {
  text?: string;
  status?: boolean;
};

export const Alert = ({ text, status }: AlertProps) => {
  return (
    <div
      className="modalAlert"
      style={{ backgroundColor: status ? 'rgb(46, 125, 50)' : '#dd1a32' }}
    >
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
