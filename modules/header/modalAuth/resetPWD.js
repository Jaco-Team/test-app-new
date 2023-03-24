import { shallow } from 'zustand/shallow';
import { useHeaderStore } from '@/components/store';

import Image from 'next/image';
import { IconClose } from '@/ui/Icons';
import MyTextInput from '@/ui/MyTextInput';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function ResetPWD() {
  console.log('render ResetPWD');

  const [closeModalAuth, errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, sendsmsNewLogin] = useHeaderStore(
    (state) => [state.closeModalAuth, state.errTextAuth, state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey, 
      state.sendsmsNewLogin], shallow);

  return (
    <div className="modalLoginReset">
      <IconButton style={{position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent'}} onClick={closeModalAuth}>
        <IconClose style={{width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible'}}/>
      </IconButton>

      <div className="loginIMG">
        <Image alt="Аккаунт" src="/account-icon-240x240.png" width={180} height={180}/>
      </div>

      <div className="loginHeader">
        <Typography component="h2">Восстановление пароля</Typography>
      </div>

      <MyTextInput
        type={'phone'}
        placeholder="Телефон"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(4, event)}
        className="inputLogin"
      />

      <div className="loginErr">
        <Typography component="span">{errTextAuth}</Typography>
      </div>

      <MyTextInput
        type={'password'}
        placeholder="Придумай пароль"
        value={pwdLogin}
        func={(event) => setPwdLogin(event)}
        onKeyDown={(event) => checkLoginKey(4, event)}
        className="inputLogin"
      />

      <div className="loginLogin" onClick={sendsmsNewLogin}>
        <Typography component="span">Сменить пароль</Typography>
      </div>

      <div className="loginCreate" onClick={() => navigate('start')}>
        <Typography component="span">У меня есть аккаунт</Typography>
      </div>
    </div>
  );
}
