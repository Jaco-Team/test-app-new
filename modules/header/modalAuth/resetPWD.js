import { useState } from 'react';

import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import {EyeShow_modalOrder, EyeHide_modalOrder, ClearAuthMobile, CheckAuthMobile} from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function ResetPWD() {
  const [showPassword, setShowPassword] = useState(false);

  const [errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, sendsmsNewLogin, matches] = useHeaderStore((state) => [state.errTextAuth, state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey, state.sendsmsNewLogin, state.matches]);

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>
      <div className="loginErr">
        <Typography component="span">{errTextAuth}</Typography>
      </div>

      <div className="resetText">
        Укажите свой номер телефона и новый пароль
      </div>

      <MyTextInput
        type="text"
        placeholder="телефон"
        variant="standard"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(3, event)}
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
          onKeyDown={(event) => checkLoginKey(3, event)}
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

      <div className="loginLogin"
        onClick={loginLogin.length === 11 && pwdLogin.length > 1 ? sendsmsNewLogin : null}
        style={{
          backgroundColor: loginLogin.length === 11 && pwdLogin.length > 1 ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)', 
          marginTop: matches ? '10.25641025641vw' : '2.5270758122744vw',
          marginBottom: matches ? '10.25641025641vw' : '2.5270758122744vw',
        }}
      >
        <Typography component="span">Сменить пароль</Typography>
      </div>

      <div className="loginSMS">
        <Typography component="span" onClick={() => navigate('loginSMS')}>Вход по СМС</Typography>
      </div>
    </div>
  );
}
