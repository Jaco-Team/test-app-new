import { useState } from 'react';

import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import {Check} from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { SmartCaptcha } from '@yandex/smart-captcha';

export default function LoginSMS() {
  const [changeLogin, loginLogin, checkLoginKey, createProfile, matches, navigate, setTimer, setActiveModalAlert] = useHeaderStore((state) => [state.changeLogin, state.loginLogin, state.checkLoginKey, state.createProfile, state.matches, state.navigate, state.setTimer, state.setActiveModalAlert]);

  const [token, setToken] = useState('');

  const handleNavigate = () => {
    navigate('loginSMSCode');
    setTimer(89);

    setTimeout( () => {
      createProfile(token);
    }, 300)
  }

  // <div className="loginErr">
  //   <Typography component="span">{errTextAuth}</Typography>
  // </div>

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>

      <div className="resetText">
        Укажите свой номер телефона, мы отправим смс
      </div>

      <MyTextInput
        type="text"
        placeholder="8 (000) 000-00-00"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(2, event)}
        className={loginLogin.length > 0 ? "inputLogin" : "inputLogin lable_position"}
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

      <div style={{ marginTop: 20 }}>
        <SmartCaptcha 
          sitekey="ysc1_1E96JpaPgfXfQRj6D9nNuEXcojKLSn528gKwiUyD1f8b2761" 
          onSuccess={setToken} 
        />
      </div>

      <div className="loginLogin"
        onClick={ loginLogin.length === 17 && token.length > 0 ? handleNavigate : () => setActiveModalAlert(true, 'Укажите телефон и подтвердите что вы не робот', false) }
        style={{
          backgroundColor: loginLogin.length === 17 && token.length > 0 ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)',
          marginTop: matches ? '10.25641025641vw' : 20, 
          marginBottom: 20
        }}>
        <Typography component="span">Получить СМС</Typography>
      </div>

    </div>
  );
}
