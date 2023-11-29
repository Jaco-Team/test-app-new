import { useState, useEffect } from 'react';
import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import {EyeShow_modalOrder, EyeHide_modalOrder, ClearAuthMobile, CheckAuthMobile} from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function CreatePWD() {
  //console.log('render CreatePWD');

  const [showPassword, setShowPassword] = useState(false);
  const [loginRepeat, setLoginRepeat] = useState('');
  const [level_1, setLevel_1] = useState(false);
  const [level_2, setLevel_2] = useState(false);
  const [level_3, setLevel_3] = useState(false);
  const [passReady, setPassReady] = useState(false);
  const [passEqual, setPassEqual] = useState(false);

  const [navigate, setPwdLogin, pwdLogin, checkLoginKey, matches] = useHeaderStore((state) => [state.navigate, state.setPwdLogin, state.pwdLogin, state.checkLoginKey, state.matches]);

  useEffect(() => {
    const regexReady = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{6,}/;

    const regexLevel_1 = /^(?=.*[a-z])/;
    const regexLevel_2 = /^(?=.*[A-Z])/;
    const regexLevel_3 = /^(?=.*[0-9])/;
    const regexLevel_4 = /^(?=.*[^\w\s])/;

    const level_1 = regexLevel_1.test(pwdLogin);
    const level_2 = regexLevel_2.test(pwdLogin);
    const level_3 = regexLevel_3.test(pwdLogin);
    const level_4 = regexLevel_4.test(pwdLogin);
    const passReady = regexReady.test(pwdLogin);

    if ((level_1 && level_2) || level_3 || level_4) {
      setLevel_1(true);
    } else {
      setLevel_1(false);
    }

    if ((level_1 && level_2 && level_3) || (level_1 && level_2 && level_4) || (level_3 && level_4)) {
      setLevel_2(true);
    } else {
      setLevel_2(false);
    }

    if (level_1 && level_2 && level_3 && level_4) {
      setLevel_3(true);
    } else {
      setLevel_3(false);
    }

    setPassReady(passReady);
  }, [pwdLogin]);

  useEffect(() => {
    if (pwdLogin === loginRepeat) {
      setPassEqual(true);
    } else {
      setPassEqual(false);
    }
  }, [pwdLogin, loginRepeat]);

  return (
    <div className={matches ? 'modalLoginPwdMobile' : 'modalLoginPwdPC'}>
      <div className="loginSubHeader">
        <Typography component="span">
          Надёжный пароль содержит буквы, цифры и символы
        </Typography>
      </div>

      <div className="inputBox">
        <MyTextInput
          type={showPassword ? 'text' : 'password'}
          placeholder="введите пароль"
          variant="standard"
          value={pwdLogin}
          func={(event) => setPwdLogin(event)}
          // onKeyDown={(event) => checkLoginKey(4, event)}
          className="inputLogin"
          inputAdornment={
            <InputAdornment position="end">
              {passReady ? (
                <CheckAuthMobile />
              ) : (
                <ClearAuthMobile onClick={() => setPwdLogin('')} />
              )}
            </InputAdornment>
          }
          startAdornment={
            <InputAdornment position="start">
              <div className="groupCheckPass">
                <span style={{background: level_3 ? '#88EC59' : 'rgba(0, 0, 0, 0.10)'}}></span>
                <span style={{background: level_2 ? '#88EC59' : 'rgba(0, 0, 0, 0.10)'}}></span>
                <span style={{background: level_1 ? '#88EC59' : 'rgba(0, 0, 0, 0.10)'}}></span>
              </div>
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

      <div className="inputBox">
        <MyTextInput
          type={showPassword ? 'text' : 'password'}
          placeholder="повторите пароль"
          variant="standard"
          value={loginRepeat}
          func={(event) => setLoginRepeat(event.target.value)}
          // onKeyDown={(event) => checkLoginKey(4, event)}
          className="inputLogin"
          inputAdornment={
            <InputAdornment position="end">
              {passEqual && passReady ? (
                <CheckAuthMobile />
              ) : (
                <ClearAuthMobile onClick={() => setLoginRepeat('')} />
              )}
            </InputAdornment>
          }
          startAdornment={
            <InputAdornment position="start">
              <div className="groupCheckPass" />
            </InputAdornment>
          }
        />
      </div>

      <div className="loginLogin" style={{backgroundColor: passEqual && passReady ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)'}}
        // onClick={passEqual && passReady ? }
        onClick={() => navigate('finish')}
      >
        <Typography component="span">Сохранить</Typography>
      </div>
      
    </div>
  );
}
