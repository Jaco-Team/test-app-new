import React, { useEffect, useState } from 'react';

import Link from 'next/link'
import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '../../ui/Font.js'
import { IconClose } from '../../ui/Icons.js'
import AccountIcon from '../../public/account-icon-240x240.png'
import { Fade } from '../../ui/Fade.js'
import MyTextInput from '../../ui/MyTextInput.js'

import { useHeaderStore } from '../../components/store.js';
import { useCitiesStore } from '../../components/store.js';
import { useAuthStore } from '../../components/store.js';

import { shallow } from 'zustand/shallow'

export default React.memo(function ModalAuth(){
  
  let timerId = null;

  const [ modalOpen, setModalOpen ] = useState(false);
  const [ typeLogin, setTypeLogin ] = useState('start');
  const [ fromType, setFromType ] = useState('start');

  const [ isSMS, setIsSMS ] = useState(false);
  const [ timer, setTimer ] = useState(89);
  const [ isActiveTimer, setisActiveTimer ] = useState(false);
  const [ timerText, setTimerText ] = useState(toTime(89));

  const [ loginLogin, setLoginLogin ] = useState('');
  const [ pwdLogin, setPwdLogin ] = useState('');
  

  const [ thisCity, thisCityList ] = useCitiesStore( state => [state.thisCity, state.thisCityList], shallow );
  const [ openAuthModal, setActiveModalAuth, errTextAuth, setErrTextAuth, token, logIn ] = 
    useHeaderStore( state => [state.openAuthModal, state.setActiveModalAuth, state.errTextAuth, state.setErrTextAuth, state.token, state.logIn], shallow );
  

  console.log(' load Modalauth')

  useEffect( () => {
    setModalOpen(openAuthModal);
    setTypeLogin('start');
    setFromType('start');
    setErrTextAuth('');

    setLoginLogin('');
    setPwdLogin('');
  }, [openAuthModal] )

  function closeModal(){
    setActiveModalAuth(false);
    setTypeLogin('start');
  }

  function changeLogin(event){
    let data = event.target.value;

    if( isNaN(data) && data != '+' ){
      return ;
    }

    if( parseInt(data[0]) == 9 ){
      data = '8' + data;
    }
    if( data[0] == '+' && parseInt(data[1]) == '7' ){
      data = data.slice(2);
      data = '8' + data;
    }
    if( parseInt(data[0]) == '7' ){
      data = data.slice(1);
      data = '8' + data;
    }

    data = data.split(' ').join('');
    data = data.split('(').join('');
    data = data.split(')').join('');
    data = data.split('-').join('');
    data = data.split('_').join('');

    setLoginLogin(data);
  }

  function navigate(from, to){
    setFromType(from);
    setTypeLogin(to);
  }

  function checkLoginKey(type, event){
    console.log( type, event )

    if( parseInt(event.keyCode) == 13 ){
      if( parseInt(type) == 1 ){
        //this.logIn();
      }
      if( parseInt(type) == 2 ){
        //this.sendSMS();
      }

      if( parseInt(type) == 3 ){
        //this.checkCode();
      }

      if( parseInt(type) == 4 ){
        //this.sendsmsNewLogin();
      }
    }
  }

  useEffect(() => {
    let interval = null;
    if (isActiveTimer) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);

      if( timer <= 0 ){
        clearInterval(interval);
      }

    } else if (!isActiveTimer && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActiveTimer, timer]);

  function sendSMS(){
    if( !isSMS ){
      setIsSMS(true);
      setTimer(89);
      setTimerText(toTime(89));

      navigate(typeLogin, 'loginSMSCode')

      console.log('sendSMS')

      setisActiveTimer(true)

      setTimeout( () => {
        setIsSMS(false);
      }, 300 )
    }
  }

  function toTime(seconds){
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  }

  console.log('sendSMS 55 ', (timer))

  return (
    <Dialog 
      onClose={ () => closeModal() }
      className={"modalOpenCity "+roboto.variable} 
      //className="class123"
      open={ modalOpen }
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={ modalOpen } style={{ overflow: 'auto' }}>
        <Box>
          
          { typeLogin != 'start' ? null :
            <div className={'modalLoginStart'}>

              <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={ () => closeModal() }>
                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
              </IconButton>

              <div className='loginIMG'>
                <Image alt="Аккаунт" src={AccountIcon} width={180} height={180} />
              </div>

              <div className='loginHeader'>
                <Typography component="h2">Мой аккаунт</Typography>
              </div>
              
              <MyTextInput type={"phone"} placeholder="Телефон" value={ loginLogin } func={ event => changeLogin(event) } onKeyDown={ event => checkLoginKey(1, event) } className="inputLogin" />

              <div className='loginErr'>
                <Typography component="span">{errTextAuth}</Typography>
              </div>

              <MyTextInput type={"password"} placeholder="Пароль" value={ pwdLogin } func={ event => setPwdLogin(event.target.value) } onKeyDown={ event => checkLoginKey(1, event) } className="inputLogin" />

              <div className='loginLosePWD'>
                <Typography component="span" onClick={ () => navigate(typeLogin, 'resetPWD') }>Забыли пароль ?</Typography>
              </div>

              <div className='loginLogin' onClick={ () => logIn('auth', loginLogin, pwdLogin) }>
                <Typography component="span">Войти</Typography>
              </div>

              <div className='loginCreate' onClick={ () => navigate(typeLogin, 'create') }>
                <Typography component="span">Создать новый аккаунт</Typography>
              </div>

              <div className='loginSMS'>
                <Typography component="span" onClick={ () => navigate(typeLogin, 'loginSMS') }>Войти по смс</Typography>
              </div>
                
            </div>
          }
          { typeLogin != 'loginSMS' ? null :
            <div className='modalLoginCreate'>
              <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={() => closeModal()}>
                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
              </IconButton>

              <div className='loginIMG'>
                <Image alt="Аккаунт" src={AccountIcon} width={180} height={180} />
              </div>

              <div className='loginHeader'>
                <Typography component="h2">Вход по СМС</Typography>
              </div>
              
              <MyTextInput type={"phone"} placeholder="Телефон" value={ loginLogin } func={ event => changeLogin(event) } onKeyDown={ event => checkLoginKey(1, event) } className="inputLogin" style={{ marginBottom: 0 }} />
              
              <div className='loginErr'>
                <Typography component="span">{errTextAuth}</Typography>
              </div>

              <div className='loginLogin' onClick={ () => sendSMS() }>
                <Typography component="span">Получить код</Typography>
              </div>
              
              <div className='loginCreate' onClick={ () => navigate(typeLogin, 'start') }>
                <Typography component="span">У меня есть аккаунт</Typography>
              </div>
            </div>
          }
          
        </Box>
      </Fade>
    </Dialog>
  )
})