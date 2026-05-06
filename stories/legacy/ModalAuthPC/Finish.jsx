import { IconPC } from '../IconPC/IconPC';

export default function Finish() {
  return (
    <div className="modalLoginPC">
      <div className="loginFinish">
        <IconPC icon="check" element="auth" />
      </div>

      <div className="loginText">
        <span>Ваш аккаунт зарегистрирован.</span>
        <span>Теперь вы можете сохранять свои адреса, привязать банковскую карту и повторять прежние заказы.</span>
      </div>

      <a href="/" className="loginLink">
        <span>Открыть меню</span>
      </a>
    </div>
  );
}
