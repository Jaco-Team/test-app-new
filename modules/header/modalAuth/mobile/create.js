import { useState } from 'react';

import Link from 'next/link';

import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import { ClearAuthMobile, DoneAuthMobile } from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function CreateMobile({ city, closeModal }) {
  //console.log('render CreateMobile');

  const [checkPolitika, setCheckPolitika] = useState(false);
  const [checkAccord, setCheckAccord] = useState(false);

  const [changeLogin, loginLogin, checkLoginKey, sendsmsNewLogin, navigate] =
    useHeaderStore((state) => [state.changeLogin, state.loginLogin, state.checkLoginKey, state.sendsmsNewLogin, state.navigate]);

  return (
    <div className="modalLoginCreateMobile">
      <div className="loginInfo">
        <Typography component="h2">Укажите свой номер телефона</Typography>
      </div>

      <MyTextInput
        type="phone"
        placeholder="телефон"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(2, event)}
        className="inputLogin"
        variant="standard"
        inputAdornment={
          <InputAdornment position="end">
            <ClearAuthMobile style={{ height: '5.1282051282051vw', width: '5.1282051282051vw' }} onClick={() => changeLogin('')} />
          </InputAdornment>
        }
      />

      {loginLogin.length > 1 ? (
        <div className="loginData">

          <div className="data" style={{ marginBottom: '3.4188034188034vw' }}>
            {checkPolitika ? (
              <span style={{ backgroundColor: '#DD1A32' }} onClick={() => setCheckPolitika(!checkPolitika)}>
                <DoneAuthMobile />
              </span>
            ) : (
              <span onClick={() => setCheckPolitika(!checkPolitika)} style={{ backgroundColor: loginLogin.length === 11 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)' }}></span>
            )}
            <Typography component="span" onClick={closeModal}>
              Согласен с{' '}<Link href={'/' + city + '/politika-konfidencialnosti'}>условиями сбора и обработки персональных данных</Link>
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
            <Typography component="span" onClick={closeModal}>
              Принимаю{' '}<Link href={'/' + city + '/politika-konfidencialnosti'}>пользовательское соглашение
              </Link>
            </Typography>
          </div>
          
        </div>
      ) : null}

      <div className="loginLogin" onClick={loginLogin.length === 11 && checkAccord && checkPolitika ? sendsmsNewLogin : null}
        style={{ backgroundColor: loginLogin.length === 11 && checkAccord && checkPolitika ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)',
                 marginTop: loginLogin.length > 1 ? '6.8376068376068vw' : '10.25641025641vw',
                 marginBottom: loginLogin.length === 11 ? '61.623931623932vw' : '78.717948717949vw'}}>

        <Typography component="span" onClick={() => navigate('loginSMSCode')}>
          Отправить
        </Typography>
        
      </div>
    </div>
  );
}
