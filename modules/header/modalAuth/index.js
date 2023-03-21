import { shallow } from 'zustand/shallow'
import { useHeaderStore } from '@/components/store';

import Start from './start';
import LoginSMS from './loginSMS';
import LoginSMSCode from './loginSMSCode';
import ResetPWD from './resetPWD'

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { Fade } from '@/ui/Fade';
import { roboto } from '@/ui/Font';

export default function ModalAuth() {

  console.log('render ModalAuth');

  const [openAuthModal, closeModalAuth, typeLogin] = useHeaderStore( state => [state.openAuthModal, state.closeModalAuth, state.typeLogin], shallow );

  return (
    <Dialog
      onClose={closeModalAuth}
      className={'modalOpenCity ' + roboto.variable}
      open={openAuthModal}
      BackdropComponent={Backdrop}
      BackdropProps={{timeout: 500}}
    >
      <Fade in={openAuthModal} style={{ overflow: 'auto' }}>
        <Box>
          {typeLogin === 'start' ?  <Start /> : null}
          {typeLogin === 'loginSMS' ?  <LoginSMS /> : null}
          {typeLogin === 'loginSMSCode' ?  <LoginSMSCode /> : null}
          {typeLogin === 'resetPWD' ?  <ResetPWD /> : null}
        </Box>
      </Fade>
    </Dialog>
  );
}
