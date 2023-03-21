import { shallow } from 'zustand/shallow'
import { useHeaderStore } from '@/components/store';

import Image from 'next/image';
import MyTextInput from '@/ui/MyTextInput';
import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function Start () {

  console.log('render Start');

  const [ closeModalAuth, logIn, errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey ] = useHeaderStore( state => 
    [state.closeModalAuth, state.logIn, state.errTextAuth, state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey], shallow );
 
  return (
          
    <div className={'modalLoginStart'}>

      <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
        <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
      </IconButton>

      <div className='loginIMG'>
        <Image alt="Аккаунт" src='/account-icon-240x240.png' width={180} height={180} />
      </div>

      <div className='loginHeader'>
        <Typography component="h2">Мой аккаунт</Typography>
      </div>
      
      <MyTextInput type={"phone"} placeholder="Телефон" value={loginLogin} 
      func={event => changeLogin(event)} onKeyDown={event => checkLoginKey(1, event)} className="inputLogin" />

      <div className='loginErr'>
        <Typography component="span">{errTextAuth}</Typography>
      </div>

      <MyTextInput type={"password"} placeholder="Пароль" value={pwdLogin} 
      func={event => setPwdLogin(event)} onKeyDown={event => checkLoginKey(1, event)} className="inputLogin" />

      <div className='loginLosePWD'>
        <Typography component="span" onClick={() => navigate('resetPWD')}>Забыли пароль ?</Typography>
      </div>

      <div className='loginLogin' onClick={() => logIn('auth', loginLogin, pwdLogin)}>
        <Typography component="span">Войти</Typography>
      </div>

      <div className='loginCreate' onClick={() => navigate('create')}>
        <Typography component="span">Создать новый аккаунт</Typography>
      </div>

      <div className='loginSMS'>
        <Typography component="span" onClick={() => navigate('loginSMS')}>Войти по смс</Typography>
      </div>
        
    </div>
  )
}
