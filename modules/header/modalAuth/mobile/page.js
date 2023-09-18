import { useState } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStore } from '@/components/store';

const StartMobile = dynamic(() => import('./start'));
const CreateMobile = dynamic(() => import('./create'));
const LoginSMSCodeMobile = dynamic(() => import('./loginSMSCode'));
// const LoginSMS = dynamic(() => import('./loginSMS'), { ssr: false });
// const ResetPWD = dynamic(() => import('./resetPWD'), { ssr: false });
// const Finish = dynamic(() => import('./finish'), { ssr: false });
// const ModalAuthError = dynamic(() => import('./error'), { ssr: false });

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
//import CircularProgress from '@mui/material/CircularProgress';

import Stack from '@mui/material/Stack';
import { SwitchAuthMobile as MySwitch } from '@/ui/MySwitch.js';

import { Fade } from '@/ui/Fade';
import { roboto } from '@/ui/Font';

export default function ModalAuthMobile({ city }) {
  //console.log('render ModalAuthMobile');

  const [form, setForm] = useState(false);
  const [timerPage, setTimerPage] = useState(null);

  const [openAuthModal, closeModalAuth, typeLogin, navigate, preTypeLogin, errTextAuth] = useHeaderStore((state) => [state.openAuthModal, state.closeModalAuth,
    state.typeLogin, state.navigate, state.preTypeLogin, state.errTextAuth]);

  const changeForm = (checked) => {
    setForm(checked);

    if (typeLogin === 'start' || typeLogin === 'resetPWD' || typeLogin === 'loginSMS') {
      navigate('create');
    } else {
      navigate('start');
    }
  };

  const closeModal = () => {
    setForm(false);
    closeModalAuth();
  };

  return (
    <>
      {/* <Backdrop style={{ zIndex: 99 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop> */}

      <Dialog
        onClose={closeModal}
        className={'modalAuthMobile ' + roboto.variable}
        open={openAuthModal}
        slots={Backdrop}
        slotProps={{ timeout: 500 }}
      >
        <Fade in={openAuthModal} style={{ overflow: 'auto' }}>
          <Box className="ContainerModalAuthMobile">
            <div className="Line" />

            <div className="authLogin">
              {typeLogin === 'loginSMSCode' ? preTypeLogin === 'loginSMS' ? 'Проверочный код' : timerPage === null || timerPage ? 'Звоним на номер' : 'Не дозвонились'
                : typeLogin === 'resetPWD' ? 'Новый пароль' : typeLogin === 'loginSMS' ? 'Вход по СМС' : 'Авторизация'}
            </div>

            {typeLogin !== 'loginSMSCode' ? (
              <Stack direction="row" alignItems="center" style={{ width: '71.794871794872vw', marginBottom: errTextAuth ? '2.5641025641026vw' : '6.8376068376068vw' }}>
                <MySwitch onClick={(event) => changeForm(event.target.checked)} checked={form} />
              </Stack>
            ) : null}

            {typeLogin === 'start' || typeLogin === 'resetPWD' || typeLogin === 'loginSMS' ? <StartMobile /> : null}
            {typeLogin === 'create' ? <CreateMobile city={city} closeModal={closeModal} /> : null}
            {typeLogin === 'loginSMSCode' ? <LoginSMSCodeMobile setTimerPage={setTimerPage} /> : null}
            {/* {typeLogin === 'loginSMS' ?  <LoginSMS /> : null}
                {typeLogin === 'resetPWD' ?  <ResetPWD /> : null}
                {typeLogin === 'finish' ?  <Finish /> : null}
                {typeLogin === 'error' ?  <ModalAuthError /> : null} */}
          </Box>
        </Fade>
      </Dialog>
    </>
  );
}
