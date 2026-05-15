import MyTextInput from '@stories/shared/ui/text-input/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';

import { MyButton } from '@stories/shared/ui/button/MyButton';
import { Icon } from '@stories/shared/Icon/Icon';

export default function Start({
  showPassword,
  errTextAuth,
  loginLogin,
  pwdLogin,
}) {
  return (
    <div className="auth-modal__login">
      <span className="loginErr">{errTextAuth}</span>

      <MyTextInput
        type="text"
        placeholder="телефон"
        variant="standard"
        value={loginLogin}
        className="inputLogin"
        inputAdornment={
          <InputAdornment position="end">
            {loginLogin.length === 11 ? (
              <Icon icon="check" element="auth" />
            ) : (
              <Icon icon="clear" element="auth" />
            )}
          </InputAdornment>
        }
      />

      <div className="inputBox">
        <MyTextInput
          type={showPassword ? 'text' : 'password'}
          placeholder="пароль"
          variant="standard"
          value={pwdLogin}
          className="inputLogin"
          inputAdornment={
            <InputAdornment position="end">
              {pwdLogin.length > 1 ? (
                <Icon icon="check" element="auth" />
              ) : (
                <Icon icon="clear" element="auth" />
              )}
            </InputAdornment>
          }
        />
        {showPassword ? (
          <Icon icon="eyeShow" element="auth" />
        ) : (
          <Icon icon="eyeHide" element="auth" />
        )}
      </div>

      <span className="loginLosePWD">Забыли пароль?</span>
      <MyButton
        children="Войти"
        variant={
          loginLogin.length === 11 && pwdLogin.length > 1 ? 'primary' : 'auth'
        }
        size="large"
      />
      <span className="loginOR">или</span>
      <a className="loginLoginYa">
        <Icon icon="ya" element="auth" />
        <span>Войти с Яндекс ID</span>
      </a>
      <span className="loginSMS">Вход по СМС</span>
    </div>
  );
}
