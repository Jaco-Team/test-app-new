import MyTextInput from '../MyTextInput/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';

import { MyButton } from '../MyButton/MyButton';
import { IconPC } from '../IconPC/IconPC';

export default function Start({ showPassword, errTextAuth, loginLogin, pwdLogin }) {
  return (
    <div className="modalLoginPC">
      <span className="loginErr">{errTextAuth}</span>

      <MyTextInput
        type="text"
        placeholder="телефон"
        variant="standard"
        value={loginLogin}
        className="inputLogin"
        inputAdornment={<InputAdornment position="end">{loginLogin.length === 11 ? <IconPC icon="check" element='auth' /> : <IconPC icon="clear" element='auth' />}</InputAdornment>}
      />

      <div className="inputBox">
        <MyTextInput
          type={showPassword ? 'text' : 'password'}
          placeholder="пароль"
          variant="standard"
          value={pwdLogin}
          className="inputLogin"
          inputAdornment={<InputAdornment position="end">{pwdLogin.length > 1 ? <IconPC icon="check" element='auth' /> : <IconPC icon="clear" element='auth' />}</InputAdornment>}
        />
        {showPassword ? <IconPC icon="eyeShow" element='auth' /> : <IconPC icon="eyeHide" element='auth' /> }
      </div>

      <span className="loginLosePWD">Забыли пароль?</span>
      <MyButton children="Войти" variant={loginLogin.length === 11 && pwdLogin.length > 1 ?"primary" : "auth"} size="large" />
      <span className="loginOR">или</span>
      <a className="loginLoginYa">
        <IconPC icon="ya" element='auth' />
        <span>Войти с Яндекс ID</span>
      </a>
      <span className="loginSMS">Вход по СМС</span>

    </div>
  );
}
