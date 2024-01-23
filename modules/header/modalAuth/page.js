import { useState } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStore } from '@/components/store';

const Start = dynamic(() => import('./start'));
const Create = dynamic(() => import('./create'));
const LoginSMSCode = dynamic(() => import('./loginSMSCode'));
const ResetPWD = dynamic(() => import('./resetPWD'));
const LoginSMS = dynamic(() => import('./loginSMS'));
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

  const [openAuthModal, closeModalAuth, typeLogin, navigate, preTypeLogin, matches, isAuth] = useHeaderStore((state) => [state.openAuthModal, state.closeModalAuth, state.typeLogin, state.navigate, state.preTypeLogin, state.matches, state.isAuth]);

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

  if( isAuth == 'auth' && openAuthModal === true ){
    closeModal()
  }

  const login = typeLogin === 'loginSMSCode' ? preTypeLogin === 'loginSMS' ? 'Проверочный код' : timerPage === null || timerPage ? 'Звоним на номер' : 'Не дозвонились' : typeLogin === 'resetPWD' ? 'Новый пароль' : typeLogin === 'createPWD' ? 'Придумайте пароль' : typeLogin === 'finish' ? 'Всё получилось!' : typeLogin === 'loginSMS' ? 'Вход по СМС' : 'Авторизация';

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

          <div className="authLogin">{login}</div>

          {typeLogin === 'start' || typeLogin === 'create' ?
              <Stack className='stack'>
                 {matches ?
                  <MySwitchMobile onClick={(event) => changeForm(event.target.checked)} checked={form} />
                  :
                  <MySwitchPC onClick={(event) => changeForm(event.target.checked)} checked={form} />
                 }
              </Stack>
          : null}

          {typeLogin === 'start' ? <Start /> : null}
          {typeLogin === 'resetPWD' ? <ResetPWD /> : null}
          {typeLogin === 'loginSMS' ? <LoginSMS /> : null}
          {typeLogin === 'create' ? <Create city={city} closeModal={closeModal} /> : null}
          {typeLogin === 'loginSMSCode' ? <LoginSMSCode setTimerPage={setTimerPage} /> : null}
          {typeLogin === 'finish' ? <Finish closeModal={closeModal} /> : null}

        </Box>
      </Fade>
    </Dialog>
  );
}
