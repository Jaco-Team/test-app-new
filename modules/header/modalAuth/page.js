import { useState } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStore } from '@/components/store';

const Start = dynamic(() => import('./start'));
const Create = dynamic(() => import('./create'));
const LoginSMSCode = dynamic(() => import('./loginSMSCode'));
const CreatePWD = dynamic(() => import('./createPWD'));
const Finish = dynamic(() => import('./finish'));

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import Stack from '@mui/material/Stack';
import { SwitchAuthPC as MySwitchPC } from '@/ui/MySwitch.js';
import { SwitchAuthMobile as MySwitchMobile } from '@/ui/MySwitch.js';

import { IconClose } from '@/ui/Icons';
import { Fade } from '@/ui/Fade';
import { roboto } from '@/ui/Font';

export default function ModalAuth({ city }) {
    
  const [form, setForm] = useState(false);
  const [timerPage, setTimerPage] = useState(null);

  const [openAuthModal, closeModalAuth, typeLogin, navigate, preTypeLogin, errTextAuth, matches] = useHeaderStore((state) => [state.openAuthModal, state.closeModalAuth, state.typeLogin, state.navigate, state.preTypeLogin, state.errTextAuth,
    state.matches]);

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
      className={matches ? 'modalAuthMobile ' : 'modalAuthPC ' + roboto.variable}
      open={openAuthModal}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <Fade in={openAuthModal} style={{ overflow: matches ? 'auto' : 'hidden' }}>
        <Box className={matches ? 'ContainerModalAuthMobile' : 'ContainerModalAuthPC'}>

          {matches ? (
            <div className="Line" />
          ) : (
            <IconButton className="closeButton" onClick={closeModal}>
              <IconClose />
            </IconButton>
          )}

          <div className="authLogin">
            {typeLogin === 'loginSMSCode' ? preTypeLogin === 'loginSMS' ? 'Проверочный код' : timerPage === null || timerPage ? 'Звоним на номер' : 'Не дозвонились' : typeLogin === 'resetPWD' ? 'Новый пароль' : typeLogin === 'createPWD'
              ? 'Придумайте пароль' : typeLogin === 'finish' ? 'Всё получилось!' : typeLogin === 'loginSMS' ? 'Вход по СМС' : 'Авторизация'}
          </div>

          {matches ? (typeLogin === 'loginSMS' || typeLogin === 'start' || typeLogin === 'resetPWD' || typeLogin === 'create' ? (
              <Stack direction="row" alignItems="center" style={{width: '71.794871794872vw', marginBottom: errTextAuth ? '2.5641025641026vw' : '6.8376068376068vw'}}>
                <MySwitchMobile onClick={(event) => changeForm(event.target.checked)} checked={form} />
              </Stack>
            ) : null
          ) : typeLogin === 'loginSMS' || typeLogin === 'start' || typeLogin === 'resetPWD' || typeLogin === 'create' ? (
            <Stack direction="row" alignItems="center"
              style={{width: '17.328519855596vw', marginBottom: errTextAuth ? '0.54151624548736vw' : typeLogin === 'resetPWD' || typeLogin === 'loginSMS' || typeLogin === 'create' || typeLogin === 'createPWD' ? '1.6245487364621vw' : 
              '2.5270758122744vw'}}
            >
              <MySwitchPC onClick={(event) => changeForm(event.target.checked)} checked={form} />
            </Stack>
          ) : null}

          {typeLogin === 'start' || typeLogin === 'resetPWD' || typeLogin === 'loginSMS' ? <Start /> : null}
          {typeLogin === 'create' ? <Create city={city} closeModal={closeModal} /> : null}
          {typeLogin === 'loginSMSCode' ? <LoginSMSCode setTimerPage={setTimerPage} /> : null}
          {typeLogin === 'createPWD' ? <CreatePWD /> : null}
          {typeLogin === 'finish' ? <Finish closeModal={closeModal} /> : null}

        </Box>
      </Fade>
    </Dialog>
  );
}
