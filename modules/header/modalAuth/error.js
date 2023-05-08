import { shallow } from 'zustand/shallow';
import { useHeaderStore } from '@/components/store';

import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function ModalAuthError() {
  console.log('render ModalAuthError');

  const [closeModalAuth, errTitle, errText1, errText2] = useHeaderStore((state) => [state.closeModalAuth, state.errTitle, state.errText1, state.errText2], shallow);

  return (
    <div className="modalLoginError">
        <IconButton style={{ position: 'absolute', top: -50, left: 10, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
          <IconClose style={{ width: 35, height: 35, overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
        </IconButton>

      <div className="InnerBorder">
        <div className="loginHeader">
          <Typography component="h2">{errTitle}</Typography>
        </div>

        <div className="loginSubHeader1">
          <Typography component="span">{errText1}</Typography>
        </div>

        <div className="loginSubHeader2">
          <Typography component="span">{errText2}</Typography>
        </div>
      </div>
    </div>
  );
}
