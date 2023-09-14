import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function Create() {
  console.log('render Create');

  const [closeModalAuth, errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, genPwd, sendsmsNewLogin, showPassword, clickShowPassword] = useHeaderStore((state) => [state.closeModalAuth, state.errTextAuth, state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey, state.genPwd,
      state.sendsmsNewLogin, state.showPassword, state.clickShowPassword]);

  return (
    <div className="modalLoginCreateNew">
      <IconButton style={{ position: 'absolute', top: '-3.2vw', left: -8, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
        <IconClose style={{ width: '2.166vw', height: '2.166vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
      </IconButton>

      <div className="loginHeader">
        <Typography component="h2">Регистрация</Typography>
      </div>

      <div className="loginInfo">
        <Typography component="h2">Укажите свой номер телефона</Typography>
      </div>

      <MyTextInput
        type="phone"
        placeholder="телефон"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(3, event)}
        className="inputLogin"
      />

      <MyTextInput
        type={showPassword ? 'text' : 'password'}
        placeholder="придумайте пароль"
        value={pwdLogin}
        func={(event) => setPwdLogin(event)}
        onKeyDown={(event) => checkLoginKey(3, event)}
        className="inputLogin"
        inputAdornment={<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={clickShowPassword}>
              {showPassword ? <VisibilityOutlinedIcon style={{ fill: 'rgba(0, 0, 0, 0.2)', height: '40px', width: '47px' }}/>
              : <VisibilityOffOutlinedIcon style={{ fill: 'rgba(0, 0, 0, 0.2)', height: '40px', width: '47px' }}/>}
            </IconButton></InputAdornment>}
      />

      {errTextAuth ? (
        <div className="loginErr">
          <Typography component="span">{errTextAuth}</Typography>
        </div>
      ) : (
        <div className="loginSubHeader">
          <Typography component="span">Надежный пароль - строчные и заглавные буквы, цифры и символы.</Typography>
          <Typography component="span">Например: {genPwd}</Typography>
        </div>
      )}

      <div className="loginLogin" onClick={loginLogin.length === 11 && pwdLogin.length > 1 ? sendsmsNewLogin : null}
        style={{ backgroundColor: loginLogin.length === 11 && pwdLogin.length > 1 ? '#DD1A32' : 'rgba(0, 0, 0, 0.2)' }}
      >
        <Typography component="span">Зарегистрироваться</Typography>
      </div>

      <div className="loginCreate" onClick={() => navigate('start')}>
        <Typography component="span">У меня есть аккаунт</Typography>
      </div>

      <div className="loginData">
        <Typography component="span">Продолжая вы соглашаетесь со сбором и обработкой персональных данных и с пользовательским соглашением</Typography>
      </div>
    </div>
  );
}
