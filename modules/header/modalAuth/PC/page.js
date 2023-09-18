import { useState } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStore } from '@/components/store';

const StartPC = dynamic(() => import('./start'));
const CreatePC = dynamic(() => import('./create'));
const LoginSMSCodePC = dynamic(() => import('./loginSMSCode'));
const CreatePWD_PC = dynamic(() => import('./createPWD'));
const FinishPC = dynamic(() => import('./finish'));

import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import Stack from '@mui/material/Stack';
import { SwitchAuthPC as MySwitch } from '@/ui/MySwitch.js';

import { Fade } from '@/ui/Fade';
import { roboto } from '@/ui/Font';

export default function ModalAuthPC({ city }) {

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
    <Dialog
    onClose={closeModal}
    className={'modalAuthPC ' + roboto.variable}
    open={openAuthModal}
    slots={Backdrop}
    slotProps={{ timeout: 500 }}
  >
    <Fade in={openAuthModal} style={{ overflow: 'hidden' }}>
      <Box className="ContainerModalAuthPC">

      <IconButton className='closeButton' onClick={closeModal}>
        <IconClose />
      </IconButton>

        <div className="authLogin">
          {typeLogin === 'loginSMSCode' ? preTypeLogin === 'loginSMS' ? 'Проверочный код' : timerPage === null || timerPage ? 'Звоним на номер' : 'Не дозвонились'
            : typeLogin === 'resetPWD' ? 'Новый пароль' : typeLogin === 'createPWD' ? 'Придумайте пароль' : typeLogin === 'finish' ? 'Всё получилось!' : typeLogin === 'loginSMS' ? 'Вход по СМС' : 'Авторизация'}
        </div>

        {typeLogin === 'loginSMS' || typeLogin === 'start' || typeLogin === 'resetPWD' ? (
          <Stack direction="row" alignItems="center" style={{ width: '17.328519855596vw', marginBottom: errTextAuth ? '0.54151624548736vw' : typeLogin === 'resetPWD' || typeLogin === 'loginSMS' || typeLogin === 'create' || typeLogin === 'createPWD' ? '1.6245487364621vw' : '2.5270758122744vw' }}>
            <MySwitch onClick={(event) => changeForm(event.target.checked)} checked={form} />
          </Stack>
        ) : null}

        {typeLogin === 'start' || typeLogin === 'resetPWD' || typeLogin === 'loginSMS' ? <StartPC /> : null}
        {typeLogin === 'create' ? <CreatePC city={city} closeModal={closeModal} /> : null}
        {typeLogin === 'loginSMSCode' ? <LoginSMSCodePC setTimerPage={setTimerPage} /> : null}
        {typeLogin === 'createPWD' ? <CreatePWD_PC /> : null}
        {typeLogin === 'finish' ?  <FinishPC closeModal={closeModal} /> : null}
      </Box>
    </Fade>
  </Dialog>
  );
}
