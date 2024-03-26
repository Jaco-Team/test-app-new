import { useState } from 'react';

import Link from 'next/link';

import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import {ClearAuthMobile, DoneAuthMobile, VectorRightAuthMobile, CheckAuthMobile, EyeShow_modalOrder, EyeHide_modalOrder } from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function Create({ city, closeModal }) {
  const [checkPolitika, setCheckPolitika] = useState(false);
  const [checkAccord, setCheckAccord] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [changeLogin, loginLogin, checkLoginKey, sendsmsNewLogin, matches, setPwdLogin, pwdLogin] = useHeaderStore((state) => [state.changeLogin, state.loginLogin, state.checkLoginKey, state.sendsmsNewLogin, state.matches, state.setPwdLogin, state.pwdLogin]);

  return (
    <div className={matches ? 'modalLoginCreateMobile' : 'modalLoginCreatePC'}>
      <div className="loginInfo">
        <Typography component="h2">Укажите свой номер телефона</Typography>
      </div>

      <MyTextInput
        type="phone"
        placeholder="телефон"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(3, event)}
        className="inputLogin"
        variant="standard"
        inputAdornment={
          <InputAdornment position="end">
            {matches ? (
               loginLogin.length === 11 ? <CheckAuthMobile /> : <ClearAuthMobile onClick={() => setPwdLogin('')} />
            ) : (
              <div className="vectorInput" style={{ backgroundColor: loginLogin.length === 11 && checkAccord && checkPolitika && pwdLogin.length > 5 ? '#DD1A32' : '#fff' }}>
                {loginLogin.length === 11 && checkAccord && checkPolitika && pwdLogin.length > 5 ? (
                  <VectorRightAuthMobile className="vectorSvg"
                    onClick={ loginLogin.length === 11 && checkAccord && checkPolitika && pwdLogin.length > 5 ? sendsmsNewLogin : null}
                  />
                ) : (
                  <ClearAuthMobile className="clearSvg" onClick={() => changeLogin('')} />
                )}
              </div>
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
              {pwdLogin.length > 5 ? (
                <CheckAuthMobile className="clear_svg" />
              ) : (
                <ClearAuthMobile className="clear_svg" onClick={() => setPwdLogin('')} />
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

      <div className="loginData">
        <div className="data" style={{ marginBottom: matches ? '3.4188034188034vw' : '0.72202166064982vw' }}>
          {checkPolitika ? (
            <span style={{ backgroundColor: '#DD1A32' }} onClick={() => setCheckPolitika(!checkPolitika)}>
              <DoneAuthMobile />
            </span>
          ) : (
            <span onClick={() => setCheckPolitika(!checkPolitika)} style={{ backgroundColor: loginLogin.length === 11 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)'}}></span>
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
            <span onClick={() => setCheckAccord(!checkAccord)} style={{ backgroundColor: loginLogin.length === 11 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)' }}></span>
          )}
          <Typography component="span" onClick={closeModal} style={{ lineHeight: matches ? '2.5641025641026vw' : '1.4440433212996vw' }}>
            Принимаю{' '}<Link href={'/' + city + '/politika-konfidencialnosti'}>пользовательское соглашение</Link>
          </Typography>
        </div>
      </div>

      {!matches ? null : (
        <div className="loginLogin" onClick={ loginLogin.length === 11 && checkAccord && checkPolitika && pwdLogin.length > 5 ? sendsmsNewLogin : null}
          style={{backgroundColor: loginLogin.length === 11 && checkAccord && checkPolitika && pwdLogin.length > 5 ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)'}}>
          <Typography component="span">
            Отправить
          </Typography>
        </div>
      )}

    </div>
  );
}
