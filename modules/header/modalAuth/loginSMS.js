import { shallow } from 'zustand/shallow'
import { useHeaderStore } from '@/components/store';

import Image from 'next/image';
import MyTextInput from '@/ui/MyTextInput';
import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function LoginSMS () {

  console.log('render LoginSMS');

  const [ closeModalAuth, errTextAuth, navigate, changeLogin, loginLogin, checkLoginKey, sendSMS ] = useHeaderStore( state => 
    [state.closeModalAuth, state.errTextAuth, state.navigate, state.changeLogin, state.loginLogin, state.checkLoginKey, state.sendSMS], shallow );
 
  return (
          
    <div className='modalLoginCreate'>
    <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
      <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
    </IconButton>

    <div className='loginIMG'>
      <Image alt="Аккаунт" src='/account-icon-240x240.png' width={180} height={180} />
    </div>

    <div className='loginHeader'>
      <Typography component="h2">Вход по СМС</Typography>
    </div>
    
    <MyTextInput type={"phone"} placeholder="Телефон" value={loginLogin} 
      func={event => changeLogin(event)} onKeyDown={event => checkLoginKey(2, event)} className="inputLogin" style={{ marginBottom: 0 }} 
    />
    
    <div className='loginErr'>
      <Typography component="span">{errTextAuth}</Typography>
    </div>

    <div className='loginLogin' onClick={sendSMS}>
      <Typography component="span">Получить код</Typography>
    </div>
    
    <div className='loginCreate' onClick={() => navigate('start')}>
      <Typography component="span">У меня есть аккаунт</Typography>
    </div>

  </div>
  )
}
