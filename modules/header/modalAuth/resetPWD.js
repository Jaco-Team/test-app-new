import { shallow } from 'zustand/shallow';
import { useHeaderStore } from '@/components/store';

import { IconClose } from '@/ui/Icons';
import MyTextInput from '@/ui/MyTextInput';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function ResetPWD() {
  console.log('render ResetPWD');

  const [closeModalAuth, errTextAuth, navigate, changeLogin, setPwdLogin, loginLogin, pwdLogin, checkLoginKey, sendsmsNewLogin, showPassword, clickShowPassword, genPwd] = useHeaderStore((state) => [state.closeModalAuth, state.errTextAuth, state.navigate, state.changeLogin, state.setPwdLogin, state.loginLogin, state.pwdLogin, state.checkLoginKey,
      state.sendsmsNewLogin, state.showPassword, state.clickShowPassword, state.genPwd], shallow);

  return (
    <div className="modalLoginReset">
      <IconButton style={{ position: 'absolute', top: -50, left: 10, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
        <IconClose style={{ width: 35, height: 35, overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
      </IconButton>

      <div className="loginHeader">
        <Typography component="h2">Новый пароль</Typography>
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
          placeholder="новый пароль"
          value={pwdLogin}
          func={(event) => setPwdLogin(event)}
          onKeyDown={(event) => checkLoginKey(3, event)}
          className={!errTextAuth ? 'inputLogin' : 'inputLogin err'}
          inputAdornment={<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={clickShowPassword}>
                {showPassword ? <VisibilityOutlinedIcon style={{ fill: 'rgba(0, 0, 0, 0.2)', height: '40px', width: '47px' }}/>
                : <VisibilityOffOutlinedIcon style={{ fill: 'rgba(0, 0, 0, 0.2)', height: '40px', width: '47px' }}/>
                }</IconButton></InputAdornment>}
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

      <div
        className="loginLogin"
        onClick={loginLogin.length === 11 && pwdLogin.length > 1 ? sendsmsNewLogin : null}
        style={{ backgroundColor: loginLogin.length === 11 && pwdLogin.length > 1 ? '#DD1A32' : 'rgba(0, 0, 0, 0.2)' }}
      >
        <Typography component="span">Сменить пароль</Typography>
      </div>

      <div className="loginCreate" onClick={() => navigate('start')}>
        <Typography component="span">У меня есть аккаунт</Typography>
      </div>
    </div>
  );
}
