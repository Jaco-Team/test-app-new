import { useState, useEffect, useRef } from 'react';
import { useHeaderStore } from '@/components/store';

import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import AuthCode from 'react-auth-code-input';

export default function LoginSMSCode() {
  console.log('render LoginSMSCode');

  const inputRef = useRef(null);

  const [closeModalAuth, errTextAuth, changeCode, sendsmsNewLogin, toTime, checkCode, code, is_sms, navigate, loginLogin, clearCode, preTypeLogin, createProfile] = useHeaderStore(
    (state) => [state.closeModalAuth, state.errTextAuth, state.changeCode, state.sendsmsNewLogin, state.toTime, state.checkCode, state.code, state.is_sms, state.navigate,
      state.loginLogin, state.clearCode, state.preTypeLogin, state.createProfile]);


  const [timer, setTimer] = useState(89);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else {
      inputRef.current.clear();
      clearCode();
    }

    return () => clearInterval(interval);
  }, [timer]);

  const reSendSMS = () => {
    createProfile();
    setTimer(89);
  };

  const reCall = () => {
    sendsmsNewLogin();
    setTimer(89);
  };

  return (
    <div className={'modalLoginSMSCode'}>
      <IconButton style={{ position: 'absolute', top: '-3.2vw', left: -8, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
        <IconClose style={{ width: '2.166vw', height: '2.166vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
      </IconButton>

      {preTypeLogin === 'loginSMS' ? (
        <>
          <div className="loginHeader">
            <Typography component="h2">{is_sms ? 'Проверочный код' : 'Телефон'}</Typography>
          </div>

          <div className="loginSubHeader1">
            <Typography component="span">{is_sms ? 'Отправили код на номер' : timer === 0 ? 'Мы не дозвонились по номеру' : 'Мы звоним по номеру'}</Typography>
          </div>
        </>
      ) : (
        <>
          <div className="loginHeader">
            <Typography component="h2">{timer === 0 ? 'Телефон' : preTypeLogin === 'resetPWD' ? 'Телефон' : 'Регистрация'}</Typography>
          </div>

          <div className="loginSubHeader1">
            <Typography component="span">{timer === 0 ? 'Мы не дозвонились по номеру' : 'Мы звоним по номеру'}</Typography>
          </div>
        </>
      )}

      <div className="loginSubHeader2">
        <Typography component="span">{loginLogin}</Typography>
      </div>

      <div className="loginAutCode">
        <AuthCode
          allowedCharacters="numeric"
          length="4"
          onChange={(data) => changeCode(data)}
          containerClassName={timer === 0 ? 'disable' : null}
          inputClassName={code.length === 4 ? 'active' : null}
          disabled={timer === 0 ? true : false}
          ref={inputRef}
        />
      </div>

      {is_sms && !errTextAuth && timer !== 0 ? (
        <div className="loginSubHeader1">
          <Typography component="span">Введите 4 цифры из смс</Typography>
        </div>
      ) : !is_sms && !errTextAuth && timer !== 0 ? (
        <div className="loginSubHeader1">
          <Typography component="span">Введите последние 4 цифры номера</Typography>
        </div>
      ) : errTextAuth ? (
        <div className="loginErr">
          <Typography component="span">{errTextAuth}</Typography>
        </div>
      ) : null}

      {timer === 0 && preTypeLogin !== 'loginSMS' ? (
        <>
          <div className="loginSubHeader3" onClick={reCall}>
            <Typography component="span">Позвонить еще раз</Typography>
          </div>

          <div
            className="loginTimer"
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => navigate('loginSMS')}
          >
            <Typography component="span">Войти по СМС</Typography>
          </div>
        </>
      ) : timer === 0 ? null : (
        <div className="loginTimer">
          <Typography component="span">{preTypeLogin === 'loginSMS' && is_sms ? 'Отправить повторно через ' : null}{toTime(timer)}</Typography>
        </div>
      )}

      {timer === 0 && preTypeLogin === 'loginSMS' ? <div style={{ minHeight: '140px' }}></div> : null}

      <div
        className="loginSend"
        style={{ backgroundColor: code.length === 4 ? '#DD1A32' : timer === 0 ? preTypeLogin === 'loginSMS' ? '#DD1A32' : 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)'}}
        onClick={timer === 0 || code.length < 4 ? timer === 0 && preTypeLogin === 'loginSMS' ? reSendSMS : null : checkCode}
      >
        <Typography component="span">Отправить</Typography>
      </div>

      <div className="loginPrev">
        <Typography component="span" onClick={() => navigate(preTypeLogin)}>Изменить номер телефона</Typography>
      </div>
    </div>
  );
}
