import { useState } from 'react';

import Link from 'next/link';

import { useHeaderStore } from '@/components/store';

import MyTextInput, { FormattedInputs } from '@/ui/MyTextInput';
import {Check, DoneAuthMobile, EyeShow_modalOrder, EyeHide_modalOrder, VectorRightAuthMobile } from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

//import { SmartCaptcha } from '@yandex/smart-captcha';

export default function Create({ city, closeModal }) {
  //const [token, setToken] = useState('');

  const [checkPolitika, setCheckPolitika] = useState(false);
  const [checkAccord, setCheckAccord] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [changeLogin, loginLogin, checkLoginKey, sendsmsNewLogin, matches, setPwdLogin, pwdLogin, setActiveModalAlert] = useHeaderStore((state) => [state?.changeLogin, state?.loginLogin, state?.checkLoginKey, state?.sendsmsNewLogin, state?.matches, state?.setPwdLogin, state?.pwdLogin, state?.setActiveModalAlert]);

  return (
    <div className={matches ? 'modalLoginCreateMobile' : 'modalLoginCreatePC'}>
      <div className="loginInfo">
        <Typography component="h2">Укажите свой номер телефона</Typography>
      </div>

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
            {matches ? (
               loginLogin.length === 17 ? <Check className="check_icon" /> : null
            ) : (
              <div className="vectorInput" style={{ backgroundColor: loginLogin.length === 17 && checkAccord && checkPolitika && pwdLogin.length > 4 ? '#DD1A32' : '#fff' }}>
                {loginLogin.length === 17 && checkAccord && checkPolitika && pwdLogin.length > 4 ? (
                  <VectorRightAuthMobile className="vectorSvg"
                    onClick={ loginLogin.length === 17 && checkAccord && checkPolitika && pwdLogin.length > 4 ? sendsmsNewLogin : null}
                  />
                ) : (
                  loginLogin.length === 17 ? <Check className="check_icon" /> : null
                )}
              </div>
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
        className={pwdLogin.length > 0 ? "inputLogin margin_bottom_30" : "inputLogin lable_position margin_bottom_30"}
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

      <div className="loginData">
        <div className="data" style={{ marginBottom: matches ? '3.4188034188034vw' : '0.72202166064982vw' }}>
          {checkPolitika ? (
            <span style={{ backgroundColor: '#DD1A32' }} onClick={() => setCheckPolitika(!checkPolitika)}>
              <DoneAuthMobile />
            </span>
          ) : (
            <span onClick={() => setCheckPolitika(!checkPolitika)} style={{ backgroundColor: loginLogin.length === 17 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)'}}></span>
          )}
          <Typography component="span" onClick={closeModal}>
            Согласен с{' '}<Link href={'/' + city + '/legal'}>условиями сбора и обработки персональных данных</Link>
          </Typography>
        </div>

        <div className="data">
          {checkAccord ? (
            <span style={{ backgroundColor: '#DD1A32' }} onClick={() => setCheckAccord(!checkAccord)}>
              <DoneAuthMobile />
            </span>
          ) : (
            <span onClick={() => setCheckAccord(!checkAccord)} style={{ backgroundColor: loginLogin.length === 17 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)' }}></span>
          )}
          <Typography component="span" onClick={closeModal} style={{ lineHeight: matches ? '2.5641025641026vw' : '1.4440433212996vw' }}>
            Принимаю{' '}<Link href={'/' + city + '/politika-konfidencialnosti'}>пользовательское соглашение</Link>
          </Typography>
        </div>
      </div>

      {!matches ? null : (
        <div className="loginLogin" onClick={ loginLogin.length >= 11 && checkAccord && checkPolitika && pwdLogin.length > 4 ? sendsmsNewLogin : () => setActiveModalAlert(true, 'Укажите телефон, пароль (минимум 5 символов, без пробелов) и согласие с указанными документами', false)}
          style={{backgroundColor: loginLogin.length >= 11 && checkAccord && checkPolitika && pwdLogin.length > 4 ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)'}}>
          <Typography component="span">
            Отправить
          </Typography>
        </div>
      )}

    </div>
  );
}
