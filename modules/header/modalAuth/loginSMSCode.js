import { useState, useEffect, useRef } from 'react';
import { useHeaderStore } from '@/components/store';

import { ClearAuthMobile, VectorRightAuthMobile } from '@/ui/Icons';

import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import AuthCode from 'react-auth-code-input';

export default function LoginSMSCode({ setTimerPage }) {
  //console.log('render LoginSMSCode');

  const inputRef = useRef(null);

  const [changeCode, sendsmsNewLogin, toTime, navigate, loginLogin, clearCode, preTypeLogin, code, matches] = useHeaderStore((state) => [state.changeCode, state.sendsmsNewLogin, state.toTime, state.navigate, state.loginLogin, state.clearCode, state.preTypeLogin, state.code, state.matches]);

  const [timer, setTimer] = useState(89);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
        setTimerPage(timer - 1);
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

  const changeNumber = () => {
    navigate(preTypeLogin);
    setTimerPage(null);
    changeCode('');
  };

  return (
    <div
      className={matches ? 'modalLoginSMSCodeMobile' : 'modalLoginSMSCodePC'}
    >
      <div className="loginSubHeader">
        <Typography component="span">{loginLogin}</Typography>
      </div>

      <Box className="loginLine">
        {timer === 0 ? (
          <LinearProgress variant="determinate" style={{ background: '#DD1A32' }} value={100} />
        ) : (
          <LinearProgress />
        )}
      </Box>

      {timer === 0 && preTypeLogin === 'loginSMS' ? (
        <div className={matches ? 'loginSubHeader' : 'loginSubHeader2'} onClick={reSendSMS}>
          <Typography component="span" style={{ textDecoration: 'underline', color: '#DD1A32' }}>
            Войти по СМС
          </Typography>
        </div>
      ) : timer === 0 && preTypeLogin !== 'loginSMS' ? (
        <div className={matches ? 'loginSubHeader' : 'loginSubHeader2'} onClick={reCall}>
          <Typography component="span" style={{ textDecoration: 'underline', color: '#DD1A32' }}>
            Позвонить еще раз
          </Typography>
        </div>
      ) : (
        <div className={matches ? 'loginSubHeader' : 'loginSubHeader2'}>
          <Typography component="span">
            {preTypeLogin === 'loginSMS' ? 'Введите 4 цифры из смс' : 'Введите последние 4 цифры номера'}
          </Typography>
        </div>
      )}

      <div className="loginAutCode">
        <AuthCode
          autoFocus={false}
          allowedCharacters="numeric"
          length="4"
          onChange={(data) => changeCode(data)}
          containerClassName={timer === 0 ? 'disable' : null}
          disabled={timer === 0 ? true : false}
          ref={inputRef}
          placeholder="•"
        />
        <div className="loginSvg" style={{ backgroundColor: code.length === 4 ? '#DD1A32' : '#fff' }}>
          {code.length === 4 ? (
            <VectorRightAuthMobile className="vectorSvg"
              onClick={() => navigate('createPWD')}
              //onClick={code.length === 4 ? sendsmsNewLogin : null}
            />
          ) : (
            <ClearAuthMobile className="clearSvg" onClick={() => inputRef.current?.clear()} />
          )}
        </div>
      </div>

      <div className="loginTimer">
        <Typography component="span">{toTime(timer)}</Typography>
      </div>

      <div className="loginPrev">
        <Typography component="span" onClick={changeNumber}>
          Изменить номер телефона
        </Typography>
      </div>
    </div>
  );
}
