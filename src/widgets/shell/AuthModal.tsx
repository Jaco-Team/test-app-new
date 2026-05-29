'use client';

import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useCompactLayout } from '@src/shared/lib/viewport';
import { useAuthStore } from '@src/features/auth/model/authStore';
import { useHeaderStore } from '@src/entities/header';
import { cityPath } from '@src/shared/lib/sitePaths';

export function AuthModal({ city }: { city: string }) {
  const compact = useCompactLayout();
  const open = useHeaderStore((state) => state.openAuthModal);
  const isAuth = useHeaderStore((state) => state.isAuth);
  const closeModalAuth = useAuthStore((state) => state.closeModalAuth);
  const typeLogin = useAuthStore((state) => state.typeLogin);
  const navigate = useAuthStore((state) => state.navigate);
  const loginLogin = useAuthStore((state) => state.loginLogin);
  const pwdLogin = useAuthStore((state) => state.pwdLogin);
  const code = useAuthStore((state) => state.code);
  const errTextAuth = useAuthStore((state) => state.errTextAuth);
  const loading = useAuthStore((state) => state.loading);
  const changeLogin = useAuthStore((state) => state.changeLogin);
  const setPwdLogin = useAuthStore((state) => state.setPwdLogin);
  const changeCode = useAuthStore((state) => state.changeCode);
  const logIn = useAuthStore((state) => state.logIn);
  const createProfile = useAuthStore((state) => state.createProfile);
  const sendsmsNewLogin = useAuthStore((state) => state.sendsmsNewLogin);
  const yandexAuthCheck = useAuthStore((state) => state.yandexAuthCheck);

  const [registerMode, setRegisterMode] = useState(false);

  useEffect(() => {
    if (isAuth === 'auth' && open) {
      closeModalAuth();
    }
  }, [closeModalAuth, isAuth, open]);

  useEffect(() => {
    const search = window.location.search;
    const match = search.split('?code=');
    if (match[1]) {
      window.history.replaceState(null, '', window.location.pathname);
      void yandexAuthCheck(match[1]);
    }
  }, [yandexAuthCheck]);

  const body = (
    <div
      style={{ padding: compact ? 24 : 32, minWidth: compact ? 'auto' : 360 }}
    >
      <h2 style={{ margin: '0 0 16px', textAlign: 'center' }}>
        {typeLogin === 'loginSMSCode' ? 'Проверочный код' : 'Мой Жако'}
      </h2>

      {typeLogin === 'start' ? (
        <>
          <TextField
            fullWidth
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={pwdLogin}
            onChange={setPwdLogin}
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            disabled={loading}
            onClick={() => void logIn()}
            sx={{ mt: 2 }}
          >
            Войти
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('loginSMS')}
            sx={{ mt: 1 }}
          >
            Вход по СМС
          </Button>
        </>
      ) : null}

      {typeLogin === 'loginSMS' ? (
        <>
          <TextField
            fullWidth
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={pwdLogin}
            onChange={setPwdLogin}
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => void sendsmsNewLogin()}
            sx={{ mt: 2 }}
          >
            Получить код
          </Button>
        </>
      ) : null}

      {typeLogin === 'loginSMSCode' ? (
        <>
          <TextField
            fullWidth
            label="Код из СМС"
            value={code}
            onChange={(event) => changeCode(event.target.value)}
            margin="normal"
            inputProps={{ maxLength: 4 }}
          />
        </>
      ) : null}

      {typeLogin === 'create' ? (
        <>
          <TextField
            fullWidth
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={async () => {
              const ok = await createProfile();
              if (ok) {
                navigate('loginSMSCode');
              }
            }}
            sx={{ mt: 2 }}
          >
            Зарегистрироваться
          </Button>
        </>
      ) : null}

      {errTextAuth ? (
        <p style={{ color: '#dd1a32', marginTop: 16 }}>{errTextAuth}</p>
      ) : null}

      <Button
        fullWidth
        variant="text"
        onClick={() => {
          setRegisterMode((value) => !value);
          navigate(registerMode ? 'start' : 'create');
        }}
        sx={{ mt: 2 }}
      >
        {registerMode ? 'Уже есть аккаунт' : 'Создать аккаунт'}
      </Button>

      {isAuth === 'auth' ? (
        <Button fullWidth href={cityPath(city, 'profile')} sx={{ mt: 1 }}>
          Профиль
        </Button>
      ) : null}
    </div>
  );

  if (compact) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={closeModalAuth}
        onOpen={() => {}}
      >
        {body}
      </SwipeableDrawer>
    );
  }

  return (
    <Dialog open={open} onClose={closeModalAuth} maxWidth="sm" fullWidth>
      <IconButton
        onClick={closeModalAuth}
        sx={{ position: 'absolute', right: 8, top: 8 }}
        aria-label="Закрыть"
      >
        ×
      </IconButton>
      {body}
    </Dialog>
  );
}
