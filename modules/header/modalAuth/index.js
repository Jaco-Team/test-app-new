import dynamic from 'next/dynamic';

import { shallow } from 'zustand/shallow'
import { useHeaderStore } from '@/components/store';

const Start = dynamic(() => import('./start'));
const LoginSMS = dynamic(() => import('./loginSMS'));
const LoginSMSCode = dynamic(() => import('./loginSMSCode'));
const ResetPWD = dynamic(() => import('./resetPWD'));
const Create = dynamic(() => import('./create'));
const Finish = dynamic(() => import('./finish'));
const ModalAuthError = dynamic(() => import('./error'));

const StartTestAuth = dynamic(() => import('./startTestAuth'));

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
          {typeLogin === 'startTestAuth' ?  <StartTestAuth /> : null}
          
          {typeLogin === 'start' ?  <Start /> : null}
          {typeLogin === 'loginSMS' ?  <LoginSMS /> : null}
          {typeLogin === 'loginSMSCode' ?  <LoginSMSCode /> : null}
          {typeLogin === 'resetPWD' ?  <ResetPWD /> : null}
          {typeLogin === 'create' ?  <Create /> : null}
          {typeLogin === 'finish' ?  <Finish /> : null}
          {typeLogin === 'error' ?  <ModalAuthError /> : null}
        </Box>
      </Fade>
    </Dialog>
  );
}
