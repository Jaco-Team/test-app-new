import IconButton from '@mui/material/IconButton';
import { IconClose } from '../Icons';
import './CloseButton.scss';

export const CloseButton = () => {
  return (
    <IconButton className="closeBTN">
      <IconClose />
    </IconButton>
  );
};
