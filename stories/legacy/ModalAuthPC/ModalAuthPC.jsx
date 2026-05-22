import PropTypes from 'prop-types';
import Start from './Start';
import ResetPWD from './ResetPWD';
import LoginSMS from './LoginSMS';
import Create from './Create';
import LoginSMSCode from './LoginSMSCode';
import Finish from './Finish';
import { MySwitch } from '../MySwitch/MySwitch';
import './ModalAuthPC.scss';

export const ModalAuthPC = ({ typeLogin, data }) => {
    const login = typeLogin === 'loginSMSCode' ? 'Проверочный код' : typeLogin === 'resetPWD' ? 'Новый пароль' : typeLogin === 'createPWD' ? 'Придумайте пароль' : typeLogin === 'finish' ? 'Всё получилось!' : typeLogin === 'loginSMS' ? 'Вход по СМС' : 'Авторизация';

  return (
    <div className="modalAuthPC">
      <span className="authLogin">{login}</span>
      {typeLogin === 'start' || typeLogin === 'create' ? <MySwitch type="auth" />: null}
      {typeLogin === 'start' ? <Start {...data} /> : null}
      {typeLogin === 'resetPWD' ? <ResetPWD {...data} /> : null}
      {typeLogin === 'loginSMS' ? <LoginSMS {...data} /> : null}
      {typeLogin === 'create' ? <Create {...data} /> : null}
      {typeLogin === 'loginSMSCode' ? <LoginSMSCode {...data} /> : null}
      {typeLogin === 'finish' ? <Finish /> : null}
    </div>
  );
};

ModalAuthPC.propTypes = {
  typeLogin: PropTypes.string.isRequired,
  data: PropTypes.object
};
