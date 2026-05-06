import MyTextInput from '../MyTextInput/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';
import { IconPC } from '../IconPC/IconPC';

export default function Create({ showPassword, checkPolitika, checkAccord, loginLogin, pwdLogin, city }) {
  return (
    <div className="modalLoginPC">
      <span className="loginInfo">Укажите свой номер телефона</span>

      <MyTextInput
        type="text"
        placeholder="телефон"
        variant="standard"
        value={loginLogin}
        className="inputLogin"
        inputAdornment={<InputAdornment position="end">{loginLogin.length === 11 && checkAccord && checkPolitika && pwdLogin.length > 5 ? <IconPC icon="vector_rigth" element='auth' /> : <IconPC icon="clear" element='auth' />}</InputAdornment>}
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

      <div className="loginData">
        <div className="data" style={{ marginBottom: '0.72202166064982vw' }}>
          {checkPolitika ? (
            <IconPC icon="done" element='auth' />
          ) : (
            <span className='checkbox' style={{ backgroundColor: loginLogin.length === 11 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)'}}></span>
          )}
          <span>
            Согласен с{' '}<a href={'/' + city + '/legal'}>условиями сбора и обработки персональных данных</a>
          </span>
        </div>

        <div className="data">
          {checkAccord ? (
            <IconPC icon="done" element='auth' />
          ) : (
            <span className='checkbox' style={{ backgroundColor: loginLogin.length === 11 ? 'rgba(221, 26, 50, 0.40)' : 'rgba(0, 0, 0, 0.10)' }}></span>
          )}
          <span style={{ lineHeight: '1.4440433212996vw' }}>
            Принимаю{' '}<a href={'/' + city + '/politika-konfidencialnosti'}>пользовательское соглашение</a>
          </span>
        </div>
      </div>

    </div>
  );
}
