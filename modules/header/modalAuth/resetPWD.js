import { useState } from 'react';

import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import {EyeShow_modalOrder, EyeHide_modalOrder, ClearAuthMobile, Check} from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function ResetPWD() {
  const [showPassword, setShowPassword] = useState(false);

  const [navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, sendsmsNewLogin, matches, setActiveModalAlert] = useHeaderStore((state) => [state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey, state.sendsmsNewLogin, state.matches, state.setActiveModalAlert]);

  // <div className="loginErr">
  //   <Typography component="span">{errTextAuth}</Typography>
  // </div>

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>

      <div className="resetText">
        Укажите свой номер телефона и новый пароль
      </div>

      <MyTextInput
        type="text"
        placeholder="8 (000) 000-00-00"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(3, event)}
        className={loginLogin.length > 0 ? "inputLogin margin_bottom_30" : "inputLogin lable_position margin_bottom_30"}
        mask={true}
        label="Телефон"
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
        <Typography component="span" onClick={() => navigate('loginSMS')} style={{ marginLeft: 'auto' }}>Вход по СМС</Typography>
      </div>

      <div className="loginLogin"
        onClick={loginLogin.length === 17 && pwdLogin.length > 4 ? sendsmsNewLogin : () => setActiveModalAlert(true, 'Укажите телефон и пароль (минимум 5 символов, без пробелов)', false)}
        style={{
          backgroundColor: loginLogin.length === 17 && pwdLogin.length > 4 ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)', 
          marginTop: matches ? '10.25641025641vw' : null,
          marginBottom: matches ? '10.25641025641vw' : null,
        }}
      >
        <Typography component="span">Сменить пароль</Typography>
      </div>
     
    </div>
  );
}
