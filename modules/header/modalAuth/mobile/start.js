import { useState, useEffect } from 'react';

import { useHeaderStore, useCitiesStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import { YaIcon, EyeShow_modalOrder, EyeHide_modalOrder, ClearAuthMobile, CheckAuthMobile } from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useSession, signIn } from 'next-auth/react';

export default function StartMobile() {
  //console.log('render StartMobile');

  const [showPassword, setShowPassword] = useState(false);

  const [formPassword, setFormPassword] = useState(false);
  const [formSMS, setFormSMS] = useState(false);
  const [checkPass, setCheckPass] = useState(false);

  const session = useSession();

  const [errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, logIn, sendsmsNewLogin, createProfile] = useHeaderStore((state) => [state.errTextAuth,     state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey, state.logIn, state.sendsmsNewLogin, state.createProfile]);

  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  const host = window.location.origin;

  useEffect(() => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{6,}/;

    if (regex.test(pwdLogin)) {
      setCheckPass(true);
    } else {
      setCheckPass(false);
    }
  }, [pwdLogin]);

  const changeForm = (name) => {
    if (name === 'sms') {
      setFormSMS(true);
      navigate('loginSMS');
      setFormPassword(false);
    } else {
      setFormPassword(true);
      navigate('resetPWD');
      setFormSMS(false);
    }
  };

  return (
    <div className="modalLoginStartMobile">

      {errTextAuth ? (
        <div className="loginErr">
          <Typography component="span">{errTextAuth}</Typography>
        </div>
      ) : null}

      {formPassword || formSMS ? (
        <div className="resetText">
          Укажите свой номер телефона, мы отправим{' '}
          {formPassword ? 'новый пароль' : 'смс'}
        </div>
      ) : null}

      <MyTextInput
        type="phone"
        placeholder="телефон"
        variant="standard"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(formPassword ? 3 : formSMS ? 2 : 1, event)}
        className="inputLogin"
        inputAdornment={
          <InputAdornment position="end">
            {loginLogin.length === 11 ? (
              <CheckAuthMobile style={{ height: '5.1282051282051vw', width: '5.1282051282051vw' }}/>
            ) : (
              <ClearAuthMobile style={{ height: '5.1282051282051vw', width: '5.1282051282051vw' }} onClick={() => changeLogin('')}/>
            )}
          </InputAdornment>
        }
      />

      {formPassword || formSMS ? null : (
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
                {checkPass ? (
                  <CheckAuthMobile style={{height: '5.1282051282051vw', width: '5.1282051282051vw' }} />
                ) : (
                  <ClearAuthMobile style={{ height: '5.1282051282051vw', width: '5.1282051282051vw' }} onClick={() => setPwdLogin('')} />
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
      )}

      <div className="loginLosePWD">
        <Typography component="span" onClick={() => changeForm('pass')} style={{ visibility: formPassword ? 'hidden' : 'visible' }}>
          Забыли пароль?
        </Typography>
      </div>

      <div className="loginLogin"
        onClick={formPassword && loginLogin.length === 11 ? sendsmsNewLogin : formSMS && loginLogin.length === 11 ? createProfile : loginLogin.length === 11 && checkPass
            ? logIn : null}
        // onClick={ () => signIn('credentials', { redirect: false, password: pwdLogin, login: loginLogin, callbackUrl: `${host}/${thisCity}/zakazy` }) }
        style={{ backgroundColor:
            (loginLogin.length === 11 && checkPass) ||
            (formPassword && loginLogin.length === 11) ||
            (formSMS && loginLogin.length === 11)
              ? '#DD1A32'
              : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography component="span"
          //onClick={() => navigate('loginSMSCode')}
        >
          {formPassword ? 'Получить пароль' : formSMS ? 'Получить СМС' : 'Войти'}
        </Typography>
      </div>

      <div className="loginOR">
        <Typography component="span">или</Typography>
      </div>

      <div className="loginLoginYa" onClick={() => signIn('yandex', {callbackUrl: `${host}/${thisCity}/zakazy`, scope: 'default_phone', response_type: 'code'})}>
        <YaIcon />
        <Typography component="span">Войти с Яндекс ID</Typography>
      </div>

      <div className="loginSMS">
        <Typography component="span" onClick={() => changeForm('sms')} style={{ visibility: formSMS ? 'hidden' : 'visible' }}>
          Вход по СМС
        </Typography>
      </div>
    </div>
  );
}
