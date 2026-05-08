// @ts-nocheck
import IconButton from '@mui/material/IconButton';
import { IconClose } from '../../Icons.js';
import './CloseButton.scss';

export const CloseButton = () => {
  return (
    <IconButton className="closeBTN">
      <IconClose />
    </IconButton>
  );
};
