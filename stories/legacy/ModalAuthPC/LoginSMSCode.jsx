import { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import AuthCode from 'react-auth-code-input';
import { IconPC } from '../IconPC/IconPC';

export default function LoginSMSCode({
  errTextAuth,
  loginLogin,
  timerPage,
  code,
}) {
    
  const [result, setResult] = useState(code);

  const changeCode = (res) => {
    setResult(res);
  };

  return (
    <div className="modalLoginPC">
      <span className="loginErr">{errTextAuth}</span>
      <span className="loginSubHeader">{loginLogin}</span>

      <LinearProgress
        className="loginLine"
        variant="determinate"
        style={{ background: '#DD1A32' }}
        value={100}
      />

      <span className="loginSubHeader2">Введите 4 цифры из смс</span>

      <div className="loginAutCode">
        <AuthCode
          autoFocus={true}
          allowedCharacters="numeric"
          length="4"
          onChange={(data) => changeCode(data)}
          placeholder="•"
        />
        <div
          className="loginSvg"
          style={{
            marginBottom:
              result.length === 4
                ? '0.072202166064982vw'
                : '0.86642599277978vw',
          }}
        >
          {result.length === 4 ? (
            <IconPC icon="vector_rigth" element="auth" />
          ) : (
            <IconPC icon="clear" element="auth" />
          )}
        </div>
      </div>

      {timerPage ? (
        <span
          className="loginSubHeader2"
          style={{
            textDecoration: 'underline',
            color: '#DD1A32',
            cursor: 'pointer',
          }}
        >
          Отправить смс еще раз
        </span>
      ) : (
        <span
          className="loginSubHeader2"
          style={{ color: 'rgba(0, 0, 0, 0.4)' }}
        >
          01:25
        </span>
      )}

      <span className="loginPrev">Изменить номер телефона</span>
    </div>
  );
}
