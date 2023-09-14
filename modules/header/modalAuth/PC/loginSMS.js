import { useHeaderStore } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function LoginSMS() {
  console.log('render LoginSMS');

  const [closeModalAuth, errTextAuth, navigate, changeLogin, loginLogin, checkLoginKey, createProfile] = useHeaderStore(
    (state) => [state.closeModalAuth, state.errTextAuth, state.navigate, state.changeLogin, state.loginLogin, state.checkLoginKey, state.createProfile]);

  return (
    <div className="modalLoginCreate">
      <IconButton style={{ position: 'absolute', top: '-3.2vw', left: -8, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
        <IconClose style={{ width: '2.166vw', height: '2.166vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
      </IconButton>

      <div className="loginHeader">
        <Typography component="h2">Вход по СМС</Typography>
      </div>

      <div className="loginSubHeader">
        <Typography component="h3">Укажите свой номер телефона</Typography>
      </div>

      
      <MyTextInput
        type="phone"
        placeholder="Телефон"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={(event) => checkLoginKey(2, event)}
        className="inputLogin"
      />
      

      {!errTextAuth ? null : (
        <div className="loginErr">
          <Typography component="span">{errTextAuth}</Typography>
        </div>
      )}

      <div
        className="loginLogin"
        onClick={loginLogin.length === 11 ? createProfile : null}
        style={{ backgroundColor: loginLogin.length === 11 ? '#DD1A32' : 'rgba(0, 0, 0, 0.2)' }}
      >
        <Typography component="span">Получить код</Typography>
      </div>

      <div className="loginCreate" onClick={() => navigate('start')}>
        <Typography component="span">У меня есть аккаунт</Typography>
      </div>
    </div>
  );
}
