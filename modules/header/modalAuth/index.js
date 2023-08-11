import dynamic from 'next/dynamic';

import { useHeaderStore } from '@/components/store';

const Start = dynamic(() => import('./start'), { ssr: false });
const LoginSMS = dynamic(() => import('./loginSMS'), { ssr: false });
const LoginSMSCode = dynamic(() => import('./loginSMSCode'), { ssr: false });
const ResetPWD = dynamic(() => import('./resetPWD'), { ssr: false });
const Create = dynamic(() => import('./create'), { ssr: false });
const Finish = dynamic(() => import('./finish'), { ssr: false });
const ModalAuthError = dynamic(() => import('./error'), { ssr: false });

const StartTestAuth = dynamic(() => import('./startTestAuth'));

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { Fade } from '@/ui/Fade';
import { roboto } from '@/ui/Font';

export default function ModalAuth() {

  const [openAuthModal, closeModalAuth, typeLogin] = useHeaderStore( state => [state.openAuthModal, state.closeModalAuth, state.typeLogin]);

  return (
    <Dialog
      onClose={closeModalAuth}
      className={'modalOpenCityPC ' + roboto.variable}
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
