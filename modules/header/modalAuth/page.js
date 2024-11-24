import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStoreNew } from '@/components/store';

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

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import Stack from '@mui/material/Stack';
import { SwitchAuthPC as MySwitchPC } from '@/ui/MySwitch.js';
import { SwitchAuthMobile as MySwitchMobile } from '@/ui/MySwitch.js';

import { IconClose } from '@/ui/Icons';
import { Fade } from '@/ui/Fade';
import { roboto } from '@/ui/Font';

export default function ModalAuth({ city }) {
  const [form, setForm] = useState(false);

  const [openAuthModal, closeModalAuth, typeLogin, navigate, matches, isAuth, getYandexLinkAuth, yandexAuthCheck, yandexAuthLink] = useHeaderStoreNew((state) => [state?.openAuthModal, state?.closeModalAuth, state?.typeLogin, state?.navigate, state?.matches, state?.isAuth, state?.getYandexLinkAuth, state?.yandexAuthCheck, state?.yandexAuthLink]);

  useEffect( () => {
    if( openAuthModal === true ){
      getYandexLinkAuth(city);
    }
  }, [openAuthModal] )

  useEffect( () => {
    if( openAuthModal === true && yandexAuthLink.length > 0 ){
      try {
        YaAuthSuggest.init(
          {
            client_id: '15b6c4f1191f4243bd23e33893f1f16e',
            response_type: 'token',
            redirect_uri: 'https://jacofood.ru/yaauth'
          },
          'https://jacofood.ru'
        )
        .then(({
            handler
        }) => handler())
        .then(data => {
            //console.log('Сообщение с токеном', data)
            yandexAuthCheck(data?.access_token);
          })
        .catch(error => console.log('Обработка ошибки', error));
      }
      catch(error) {
        console.log('Ошибка', error);
      }
    }
  }, [openAuthModal, yandexAuthLink] )

  useEffect( () => {
    let search = window.location.search;
    let checkItem = search.split('?code=');
                    
    if( checkItem[1] ){
        
      window.history.replaceState(null, null, window?.location.pathname);

      yandexAuthCheck(checkItem[1]);
    }
  }, [] )

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

  const login = typeLogin === 'loginSMSCode' ? 'Проверочный код' : typeLogin === 'resetPWD' ? 'Новый пароль' : typeLogin === 'createPWD' ? 'Придумайте пароль' : typeLogin === 'finish' ? 'Всё получилось!' : typeLogin === 'loginSMS' 
  ? 'Вход по СМС' : 'Мой Жако';

  if( matches ){
    return (
      <SwipeableDrawer
        anchor={'bottom'}
        open={openAuthModal}
        onClose={closeModal}
        onOpen={() => {}}
        className={'modalAuthMobile ' + roboto.variable}
        disableSwipeToOpen
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
            {typeLogin === 'loginSMSCode' ? <LoginSMSCode /> : null}
            {typeLogin === 'finish' ? <Finish closeModal={closeModal} /> : null}

          </Box>
        </Fade>
      </SwipeableDrawer>
    )
  }

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
          {typeLogin === 'loginSMSCode' ? <LoginSMSCode /> : null}
          {typeLogin === 'finish' ? <Finish closeModal={closeModal} /> : null}

        </Box>
      </Fade>
    </Dialog>
  );
}
