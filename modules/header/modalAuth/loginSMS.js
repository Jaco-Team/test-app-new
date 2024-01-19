import { useHeaderStore, useCitiesStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import {ClearAuthMobile, CheckAuthMobile} from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

//import { useSession, signIn } from 'next-auth/react';

export default function LoginSMS() {
  //console.log('render LoginSMS');

  //const session = useSession();

  const [errTextAuth, changeLogin, loginLogin, checkLoginKey, createProfile, matches] = useHeaderStore((state) => [state.errTextAuth, state.changeLogin, state.loginLogin, state.checkLoginKey, state.createProfile, state.matches]);

  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  const host = window.location.origin;

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>
      <div className="loginErr">
        <Typography component="span">{errTextAuth}</Typography>
      </div>

      <div className="resetText">
        Укажите свой номер телефона, мы отправим смс
      </div>

      <MyTextInput
        type="text"
        placeholder="телефон"
        variant="standard"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(2, event)}
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

      <div className="loginLogin"
        onClick={loginLogin.length === 11 ? createProfile : null}
        style={{backgroundColor: loginLogin.length === 11 ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)',
        marginTop: matches ? '10.25641025641vw' : '2.5270758122744vw'}}>
        <Typography component="span">Получить СМС</Typography>
      </div>

    </div>
  );
}
