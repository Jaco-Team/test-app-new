import MyTextInput from '../MyTextInput/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';

import { MyButton } from '../MyButton/MyButton';
import { IconPC } from '../IconPC/IconPC';

export default function LoginSMS({ errTextAuth, loginLogin }) {
  return (
    <div className="modalLoginPC">
      <span className="loginErr">{errTextAuth}</span>
      <span className="resetText">Укажите свой номер телефона, мы отправим смс</span>

      <MyTextInput
        type="text"
        placeholder="телефон"
        variant="standard"
        value={loginLogin}
        className="inputLogin"
        inputAdornment={<InputAdornment position="end">{loginLogin.length === 11 ? <IconPC icon="check" element='auth' /> : <IconPC icon="clear" element='auth' />}</InputAdornment>}
      />
      
      <div className="loginLogin">
        <MyButton children="Получить СМС" variant={loginLogin.length === 11 ? "primary" : "auth"} size="large" />
      </div>

    </div>
  );
}
