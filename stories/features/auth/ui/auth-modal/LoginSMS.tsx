import MyTextInput from '@stories/shared/ui/text-input/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';

import { MyButton } from '@stories/shared/ui/button/MyButton';
import { Icon } from '@stories/shared/Icon/Icon';

export default function LoginSMS({ errTextAuth, loginLogin }) {
  return (
    <div className="auth-modal__login">
      <span className="loginErr">{errTextAuth}</span>
      <span className="resetText">
        Укажите свой номер телефона, мы отправим смс
      </span>

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

      <div className="loginLogin">
        <MyButton
          children="Получить СМС"
          variant={loginLogin.length === 11 ? 'primary' : 'auth'}
          size="large"
        />
      </div>
    </div>
  );
}
