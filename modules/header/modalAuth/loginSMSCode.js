import { useRef, useEffect } from 'react';
import { useHeaderStore } from '@/components/store';

import { ClearAuthMobile, VectorRightAuthMobile } from '@/ui/Icons';

import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import AuthCode from 'react-auth-code-input';
import Timer from './timer';

export default function LoginSMSCode() {
  const inputRef = useRef(null);

  const [changeCode, createProfile, checkCode, navigate, loginLogin, preTypeLogin, code, matches, timerPage, setTimer, errTextAuth] = useHeaderStore( state => [state.changeCode, state.createProfile, state.checkCode, state.navigate, state.loginLogin, state.preTypeLogin, state.code, state.matches, state.timerPage, state.setTimer, state.errTextAuth]);

  useEffect(() => {
    if (timerPage) {
      inputRef.current.clear();
      changeCode('');
    } 
  }, [changeCode, timerPage]);

  const reSendSMS = () => {
    createProfile();
    setTimer(89);
    inputRef.current.clear();
    changeCode('');
  };

  const changeNumber = () => {
    navigate(preTypeLogin);
    changeCode('');
  };
  
  /*
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
            Введите 4 цифры из смс
          </Typography>
        </div>
      )}
  */

  return (
    <div className={matches ? 'modalLoginSMSCodeMobile' : 'modalLoginSMSCodePC'}>
      <div className="loginErr">
        <Typography component="span">{errTextAuth}</Typography>
      </div>
      
      <div className="loginSubHeader">
        <Typography component="span">{loginLogin}</Typography>
      </div>

      <Box className="loginLine">
        {timerPage ? (
          <LinearProgress variant="determinate" style={{ background: '#DD1A32' }} value={100} />
          ) : (
          <LinearProgress />
        )}
      </Box>

      <div className={matches ? 'loginSubHeader' : 'loginSubHeader2'}>
        <Typography component="span">
          Введите 4 цифры из смс
        </Typography>
      </div>

      <div className="loginAutCode">

        {matches ?
          <input
            value={code}
            onChange={(event) => changeCode(event.target.value)}
            type="text"
            inputmode="numeric"
            pattern="[0-9]"
            autocomplete="one-time-code"
            placeholder="• • • •"
            maxLength={4}
          />
          :
          <AuthCode
            autoFocus={true}
            allowedCharacters="numeric"
            length="4"
            onChange={(data) => changeCode(data)}
            ref={inputRef}
            placeholder="•"
          />
        }

        <div className="loginSvg" style={{ backgroundColor: code.length === 4 ? '#DD1A32' : '#fff' }}>
          {code.length === 4 ? (
            <VectorRightAuthMobile className="vectorSvg"
              onClick={code.length === 4 ? checkCode : null}
            />
          ) : (
            <ClearAuthMobile className="clearSvg" 
            onClick={() => matches ? changeCode('') : inputRef.current?.clear()} 
            
            />
          )}
        </div>
      </div>
     
      {timerPage ?
        <div className='loginSubHeader2' onClick={reSendSMS}>
          <Typography component="span" style={{ textDecoration: 'underline', color: '#DD1A32', cursor: 'pointer' }}>
            Отправить смс еще раз
          </Typography>
        </div>
          :
        <Timer />
      }

      <div className="loginPrev">
        <Typography component="span" onClick={changeNumber}>
          Изменить номер телефона
        </Typography>
      </div>
    </div>
  );
};
