import { shallow } from 'zustand/shallow';
import { useHeaderStore } from '@/components/store';

import Image from 'next/image';
import MyTextInput from '@/ui/MyTextInput';
import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function Create() {
  console.log('render Create');

  const [closeModalAuth, errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, genPwd, sendsmsNewLogin] = useHeaderStore(
    (state) => [state.closeModalAuth, state.errTextAuth, state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey, state.genPwd,
      state.sendsmsNewLogin], shallow);

  return (
    <div className="modalLoginCreateNew">
      <IconButton style={{position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent'}} onClick={closeModalAuth}>
        <IconClose style={{width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible'}}/>
      </IconButton>

      <div className="loginIMG">
        <Image alt="Аккаунт" src='/account-icon-240x240_white.png' width={180} height={180} />
      </div>

      <div className="loginHeader">
        <Typography component="h2">Новый аккаунт</Typography>
      </div>

      <MyTextInput
        type={'phone'}
        placeholder="Телефон"
        value={loginLogin}
        func={event => changeLogin(event)} onKeyDown={event => checkLoginKey(4, event)} 
        className="inputLogin"
      />

      <div className="loginErr">
        <Typography component="span">{errTextAuth}</Typography>
      </div>

      <MyTextInput
        type={'password'}
        placeholder="Придумайте пароль"
        value={pwdLogin} 
        func={event => setPwdLogin(event)} onKeyDown={event => checkLoginKey(4, event)}
        className="inputLogin"
      />

      <div className="loginSubHeader">
        <Typography component="span">Надежный пароль - строчные и заглавные буквы, цифры и символы.</Typography>
        <Typography component="span">Например: {genPwd}</Typography>
      </div>

      <div className="loginErrText">
        <Typography component="span"></Typography>
      </div>

      <div className="loginLogin" onClick={sendsmsNewLogin}>
        <Typography component="span">Создать аккаунт</Typography>
      </div>

      <div className="loginCreate" onClick={() => navigate('start')}>
        <Typography component="span">У меня есть аккаунт</Typography>
      </div>
    </div>
  );
}
