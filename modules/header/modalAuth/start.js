import { useState } from 'react';

import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import {YaIcon, EyeShow_modalOrder, EyeHide_modalOrder, ClearAuthMobile, CheckAuthMobile} from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function Start() {
  const [showPassword, setShowPassword] = useState(false);

  const [errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, logIn, matches, yandexAuthLink] = useHeaderStore((state) => [state.errTextAuth, state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey, state.logIn, state.matches, state.yandexAuthLink]);

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>
      <div className="loginErr">
        <Typography component="span">{errTextAuth}</Typography>
      </div>

      <MyTextInput
        type="text"
        placeholder="телефон"
        variant="standard"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(1, event)}
        className="inputLogin"
        inputAdornment={
          <InputAdornment position="end">
            {loginLogin.length === 11 ? (
              <CheckAuthMobile />
            ) : (
              <ClearAuthMobile onClick={() => changeLogin('')} />
            )}
          </InputAdornment>
        }
      />

      <div className="startInputBox">

        <MyTextInput
          type={showPassword ? 'text' : 'password'}
          placeholder="пароль"
          variant="standard"
          value={pwdLogin}
          func={(event) => setPwdLogin(event)}
          onKeyDown={(event) => checkLoginKey(1, event)}
          className="inputLogin"
          inputAdornment={
            <InputAdornment position="end">
              {pwdLogin.length > 1 ? (
                <CheckAuthMobile />
              ) : (
                <ClearAuthMobile onClick={() => setPwdLogin('')} />
              )}
            </InputAdornment>
          }
        />

        {showPassword ? (
          <div className="eye_icon" onClick={() => setShowPassword(false)}>
            <EyeShow_modalOrder />
          </div>
        ) : (
          <div className="eye_icon" onClick={() => setShowPassword(true)}>
            <EyeHide_modalOrder />
          </div>
        )}
        
      </div>

      <div className="loginLosePWD">
        <Typography component="span" onClick={() => navigate('resetPWD')}>
          Забыли пароль?
        </Typography>
      </div>

      <div className="loginLogin"
        onClick={loginLogin.length === 11 && pwdLogin.length > 1 ? logIn : null}
        style={{backgroundColor: loginLogin.length === 11 && pwdLogin.length > 1 ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)'}}
      >
        <Typography component="span">Войти</Typography>
      </div>

      <div className="loginOR">
        <Typography component="span">или</Typography>
      </div>

      <a className="loginLoginYa" 
        href={ yandexAuthLink }
        style={{ textDecoration: 'none' }}
        //onClick={() => signIn('yandex', { callbackUrl: `${host}/${thisCity}/zakazy`, scope: 'default_phone', response_type: 'code' })}
      >
        <YaIcon />
        <Typography component="span">Войти с Яндекс ID</Typography>
      </a>

      <div className="loginSMS">
        <Typography component="span" onClick={() => navigate('loginSMS')}>Вход по СМС</Typography>
      </div>
    </div>
  );
}
