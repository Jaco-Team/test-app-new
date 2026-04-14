import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import * as Sentry from '@sentry/nextjs';

import { useHeaderStoreNew } from '@/components/store';
import { importWithRetry } from '@/utils/importWithRetry';
import { getClientNetworkContext } from '@/utils/clientMonitoring';

const Start = dynamic(() => importWithRetry(() => import('./start'), { retries: 1, delayMs: 400 }));
const Create = dynamic(() => importWithRetry(() => import('./create'), { retries: 1, delayMs: 400 }));
const LoginSMSCode = dynamic(() => importWithRetry(() => import('./loginSMSCode'), { retries: 1, delayMs: 400 }));
const ResetPWD = dynamic(() => importWithRetry(() => import('./resetPWD'), { retries: 1, delayMs: 400 }));
const LoginSMS = dynamic(() => importWithRetry(() => import('./loginSMS'), { retries: 1, delayMs: 400 }));
const Finish = dynamic(() => importWithRetry(() => import('./finish'), { retries: 1, delayMs: 400 }));

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { SwitchAuthPC as MySwitchPC } from '@/ui/MySwitch.js';
import { SwitchAuthMobile as MySwitchMobile } from '@/ui/MySwitch.js';

import { IconClose } from '@/ui/Icons';
import { Fade } from '@/ui/Fade';
import { roboto } from '@/ui/Font';

class AuthModalBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag('surface', 'auth-modal');
      scope.setTag('auth_type', this.props.authType || 'unknown');
      scope.setContext('network', getClientNetworkContext());
      scope.setExtra('componentStack', errorInfo?.componentStack || null);
      Sentry.captureException(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function AuthModalFallback({ matches, onClose, onRetry }) {
  return (
    <div
      style={{
        padding: matches ? '6vw 0 2vw' : '24px 0 8px',
        display: 'grid',
        gap: matches ? '4vw' : '16px',
      }}
    >
      <div style={{ fontSize: matches ? '5.1vw' : 24, fontWeight: 700, textAlign: 'center' }}>
        Авторизация временно недоступна
      </div>
      <div
        style={{
          fontSize: matches ? '4.1vw' : 16,
          lineHeight: 1.45,
          textAlign: 'center',
          color: 'rgba(0, 0, 0, 0.6)',
        }}
      >
        Форма входа открылась с ошибкой. Попробуйте открыть ее еще раз или обновить страницу.
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: matches ? '3vw' : 12,
          flexWrap: 'wrap',
        }}
      >
        <Button variant="contained" onClick={onRetry}>Попробовать снова</Button>
        <Button variant="outlined" onClick={onClose}>Закрыть</Button>
      </div>
    </div>
  );
}

export default function ModalAuth({ city }) {
  const [form, setForm] = useState(false);

  const [openAuthModal, closeModalAuth, typeLogin, navigate, matches, isAuth, yandexAuthCheck] = useHeaderStoreNew((state) => [state?.openAuthModal, state?.closeModalAuth, state?.typeLogin, state?.navigate, state?.matches, state?.isAuth, state?.yandexAuthCheck]);

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

  const retryAuthModal = () => {
    navigate('start');
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

            <AuthModalBoundary
              authType={typeLogin}
              resetKey={`${openAuthModal}-${typeLogin}-${matches}`}
              fallback={<AuthModalFallback matches={matches} onClose={closeModal} onRetry={retryAuthModal} />}
            >
              {typeLogin === 'start' ? <Start /> : null}
              {typeLogin === 'resetPWD' ? <ResetPWD /> : null}
              {typeLogin === 'loginSMS' ? <LoginSMS /> : null}
              {typeLogin === 'create' ? <Create city={city} closeModal={closeModal} /> : null}
              {typeLogin === 'loginSMSCode' ? <LoginSMSCode /> : null}
              {typeLogin === 'finish' ? <Finish closeModal={closeModal} /> : null}
            </AuthModalBoundary>

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

          <AuthModalBoundary
            authType={typeLogin}
            resetKey={`${openAuthModal}-${typeLogin}-${matches}`}
            fallback={<AuthModalFallback matches={matches} onClose={closeModal} onRetry={retryAuthModal} />}
          >
            {typeLogin === 'start' ? <Start /> : null}
            {typeLogin === 'resetPWD' ? <ResetPWD /> : null}
            {typeLogin === 'loginSMS' ? <LoginSMS /> : null}
            {typeLogin === 'create' ? <Create city={city} /> : null}
            {typeLogin === 'loginSMSCode' ? <LoginSMSCode /> : null}
            {typeLogin === 'finish' ? <Finish closeModal={closeModal} /> : null}
          </AuthModalBoundary>

        </Box>
      </Fade>
    </Dialog>
  );
}
