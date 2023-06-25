import React, { useEffect } from 'react';

import { shallow } from 'zustand/shallow';
import { useHeaderStore, useCitiesStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import { IconClose, EyeShow, EyeHide, GoogleIcon, VKIconButton, YaIcon } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function StartTestAuth() {
  const session = useSession();

  const [closeModalAuth, logIn, errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, showPassword, clickShowPassword, loading] = useHeaderStore(
    (state) => [state.closeModalAuth, state.logIn, state.errTextAuth, state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin,
      state.checkLoginKey, state.showPassword, state.clickShowPassword, state.loading], shallow);

  const [thisCity] = useCitiesStore((state) => [state.thisCity], shallow);

  const host = window.location.origin;

  useEffect(() => {
    if( session?.status == "authenticated" ){
      closeModalAuth();
    }
  }, [session]);

  return (
    <>
      <Backdrop style={{ zIndex: 99 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="modalLoginStart">
        <IconButton style={{ position: 'absolute', top: '-3.2vw', left: -8, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
          <IconClose style={{ width: '2.166vw', height: '2.166vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
        </IconButton>

        <div className="loginHeader">
          <Typography component="h2">Вход</Typography> 
        </div>

        <MyTextInput
          type="phone"
          placeholder="телефон"
          value={loginLogin}
          func={(event) => changeLogin(event)}
          onKeyDown={(event) => checkLoginKey(1, event)}
          className={!errTextAuth ? 'inputLogin' : 'inputLogin err'}
        />

        <MyTextInput
          type={showPassword ? 'text' : 'password'}
          placeholder="пароль"
          value={pwdLogin}
          func={(event) => setPwdLogin(event)}
          onKeyDown={(event) => checkLoginKey(1, event)}
          className={!errTextAuth ? 'inputLogin' : 'inputLogin err'}
          inputAdornment={<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={clickShowPassword}>
                {showPassword ? <EyeShow style={{ height: '1.1vw', width: '1.81vw' }}/> :
                  <EyeHide style={{ height: '1.1vw', width: '1.81vw' }}/>
                }</IconButton></InputAdornment>
          }
        />

        <div className="loginLosePWD" style={{ marginBottom: '30px' }}>
          <Typography component="span" onClick={() => navigate('resetPWD')}>Забыли пароль?</Typography>
        </div>

        
        <div className="loginErr" style={{ display: 'none' }}>
          <Typography component="span">{errTextAuth}</Typography>
        </div>
      
        
        <div 
          className="loginLogin"
          //onClick={loginLogin.length === 11 && pwdLogin.length > 1 ? logIn : null}
          onClick={ () => signIn('credentials', { redirect: false, password: pwdLogin, login: loginLogin, callbackUrl: `${host}/${thisCity}/zakazy` }) }
          style={{ backgroundColor: loginLogin.length === 11 && pwdLogin.length > 1 ? '#DD1A32' : 'rgba(0, 0, 0, 0.2)' }}
        >
          <Typography component="span">Войти</Typography>
        </div>

        <div className="loginOR">
          <Typography component="span">или</Typography>
        </div>

        <div 
          className="loginLoginYa"
          // onClick={loginLogin.length === 11 && pwdLogin.length > 1 ? logIn : null} 
        >
          <Typography component="span">Войти с</Typography>
          <GoogleIcon onClick={() =>  signIn("google", { callbackUrl: `${host}/${thisCity}/zakazy` })}/> 
          <VKIconButton onClick={() =>  signIn("vk", { callbackUrl: `${host}/${thisCity}/zakazy` })}/> 
          <YaIcon onClick={() =>  signIn("yandex", { callbackUrl: `${host}/${thisCity}/zakazy`, scope: 'default_phone', response_type: 'code' })}/>
        </div>

        <div className="loginCreate" onClick={() => navigate('create')}>
          <Typography component="span">Зарегистрироваться</Typography>
        </div>

        <div className="loginSMS">
          <Typography component="span" onClick={() => navigate('loginSMS')}>
            Вход по СМС
          </Typography>
        </div>
      </div>
    </>
  );
}
