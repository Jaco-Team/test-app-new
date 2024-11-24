import { useState } from 'react';

import { useHeaderStore } from '@/components/store';

import MyTextInput, { FormattedInputs } from '@/ui/MyTextInput';
import {YaIcon, EyeShow_modalOrder, EyeHide_modalOrder, Check} from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function Start() {
  const [showPassword, setShowPassword] = useState(false);

  const [navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, logIn, matches, yandexAuthLink, setActiveModalAlert] = useHeaderStore((state) => [state?.navigate, state?.changeLogin, state?.setPwdLogin, state?.loginLogin, state?.pwdLogin, state?.checkLoginKey, state?.logIn, state?.matches, state?.yandexAuthLink, state?.setActiveModalAlert]);

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>

      <FormattedInputs
        type="text"
        placeholder="8 (000) 000-00-00"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(1, event)}
        className={loginLogin.length > 0 ? "inputLogin margin_bottom_30" : "inputLogin lable_position margin_bottom_30"}
        mask={true}
        label="Телефон"
        autoComplete="true"
        onBlur={(event) => changeLogin(event)}
        inputAdornment={
          <InputAdornment position="end">
            {loginLogin.length === 17 ? (
              <Check className="check_icon"  />
            ) : (
              null
            )}
          </InputAdornment>
        }
      /> 

      <MyTextInput
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={pwdLogin}
        func={(event) => setPwdLogin(event)}
        onKeyDown={(event) => checkLoginKey(1, event)}
        className={pwdLogin.length > 0 ? "inputLogin " : "inputLogin lable_position"}
        label="Пароль"
        inputAdornment={
          <InputAdornment position="end">
            {showPassword ? (
              <div className="eye_icon" onClick={() => setShowPassword(false)}>
                <EyeShow_modalOrder />
              </div>
            ) : (
              <div className="eye_icon" onClick={() => setShowPassword(true)}>
                <EyeHide_modalOrder />
              </div>
            )}
          </InputAdornment>
        }
      /> 

      <div className='loginBox'>
        <Typography component="span" onClick={() => navigate('resetPWD')}>Не помню пароль</Typography>
        <Typography component="span" onClick={() => navigate('loginSMS')}>Вход по СМС</Typography>
      </div>

      <div 
        className="loginLogin"
        onClick={loginLogin.length === 17 && pwdLogin.length > 4 ? () => logIn() : () => setActiveModalAlert(true, 'Укажите телефон и пароль (минимум 5 символов, без пробелов)', false)}
        style={{backgroundColor: loginLogin.length === 17 && pwdLogin.length > 4 ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)'}}
      >
        <Typography component="span">Войти</Typography>
      </div>

      <a className="loginLoginYa" 
        href={ yandexAuthLink }
        style={{ textDecoration: 'none', display: 'none' }}
        //onClick={() => signIn('yandex', { callbackUrl: `${host}/${thisCity}/zakazy`, scope: 'default_phone', response_type: 'code' })}
      >
        <YaIcon />
        <Typography component="span">Войти с Яндекс ID</Typography>
      </a>
     
    </div>
  );
}
