import { useState, useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useHeaderStore } from '@/components/store';

import Image from 'next/image';
import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import AuthCode from 'react-auth-code-input';

export default function LoginSMSCode() {
  console.log('render LoginSMS');

  const [closeModalAuth, errTextAuth, changeCode, sendSMS, toTime, checkCode, code, is_sms, navigate] = useHeaderStore(
    (state) => [state.closeModalAuth, state.errTextAuth, state.changeCode, state.sendSMS, state.toTime,state.checkCode, state.code, state.is_sms, state.navigate], shallow);

  const [timer, setTimer] = useState(89);

  useEffect(() => {
    let interval;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } 

    return () => clearInterval(interval);
  }, [timer]);

  const reSendSMS = () => {
    sendSMS();
    setTimer(89);
  }

  return (
    <div className={'modalLoginSMSCode'}>
      <IconButton style={{position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent'}} onClick={closeModalAuth}>
        <IconClose style={{width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible'}}/>
      </IconButton>

      <div className="loginIMG">
        <picture>
          <Image alt="Аккаунт" src='/tripple_dop.png' width={180} height={180} />
        </picture>
      </div>

      <div className="loginHeader">
        <Typography component="h2">Проверим телефон ?</Typography>
      </div>

      {is_sms === true ? null : (
        <div className="loginSubHeader">
          <Typography component="span">Сейчас мы вам позвоним.</Typography>
          <Typography component="span">Введите последние 4 цифры номера.</Typography>
        </div>
      )}

      {is_sms === false ? null : (
        <div className="loginSubHeader">
          <Typography component="span">Введите 4 цифры из смс.</Typography>
        </div>
      )}

      <div className={timer > 0 ? 'loginAutCode' : 'loginAutCodeOther'}>
        <AuthCode autoFocus={true} allowedCharacters="numeric" length="4" onChange={(data) => changeCode(data)}/>
      </div>

      <div className="loginErr">
        <Typography component="span">{errTextAuth}</Typography>
      </div>

      {timer > 0 ? (
        <div className="loginTimer">
          <Typography component="span">Повторно отправить можно через {toTime(timer)}</Typography>
        </div>
      ) : (
        <div className="loginTimerSend" onClick={reSendSMS}>
          <Typography component="span">Отправить код еще раз</Typography>
        </div>
      )}

      <div className={'loginSend ' + (code.length === 4 ? '' : 'disabled')} onClick={checkCode}>
        <Typography component="span">Отправить</Typography>
      </div>

      <div className="loginPrev">
        <Typography component="span" onClick={() => navigate('loginSMS')}>Изменить номер телефона</Typography>
      </div>
    </div>
  );
}
