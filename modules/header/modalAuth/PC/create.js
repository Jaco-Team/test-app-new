import { useState } from 'react';

import Link from 'next/link';

import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import { VectorRightAuthMobile, DoneAuthMobile } from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

export default function CreateMobile({ city, closeModal }) {
  //console.log('render CreateMobile');

  const [checkPolitika, setCheckPolitika] = useState(false);
  const [checkAccord, setCheckAccord] = useState(false);

  const [changeLogin, loginLogin, checkLoginKey, sendsmsNewLogin, navigate] = useHeaderStore((state) => [state.changeLogin, state.loginLogin, state.checkLoginKey, state.sendsmsNewLogin,
      state.navigate ]);

  return (
    <div className="modalLoginCreatePC">

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
            <div className="vectorInput"
              onClick={() => navigate('loginSMSCode')}
              //onClick={ loginLogin.length === 11 && checkAccord && checkPolitika ? sendsmsNewLogin : null}
              style={{ backgroundColor: loginLogin.length === 11 && checkAccord && checkPolitika ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)' }}
            >
              <VectorRightAuthMobile style={{ cursor: 'pointer'}} />
            </div>
          </InputAdornment>
        }
      />

      {loginLogin.length > 1 ? (
        <div className="loginData">
          <div className="data" style={{ marginBottom: '0.72202166064982vw' }}>
            {checkPolitika ? (
              <span style={{ backgroundColor: '#DD1A32' }} onClick={() => setCheckPolitika(!checkPolitika)}>
                <DoneAuthMobile style={{ cursor: 'pointer'}} />
              </span>
            ) : (
              <span onClick={() => setCheckPolitika(!checkPolitika)}
                style={{ backgroundColor: loginLogin.length === 11 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)' }}></span>
            )}
            <Typography component="span" onClick={closeModal}>
              Согласен с{' '}<Link href={'/' + city + '/politika-konfidencialnosti'}>условиями сбора и обработки персональных данных</Link>
            </Typography>
          </div>

          <div className="data">
            {checkAccord ? (
              <span style={{ backgroundColor: '#DD1A32' }} onClick={() => setCheckAccord(!checkAccord)}>
                <DoneAuthMobile style={{ cursor: 'pointer'}} />
              </span>
            ) : (
              <span onClick={() => setCheckAccord(!checkAccord)}
                style={{ backgroundColor: loginLogin.length === 11 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)' }}></span>
            )}
            <Typography component="span" onClick={closeModal} style={{ lineHeight: '1.4440433212996vw' }}>
              Принимаю{' '}<Link href={'/' + city + '/politika-konfidencialnosti'}>пользовательское соглашение</Link>
            </Typography>
          </div>
        </div>
      ) : null}
    </div>
  );
}
