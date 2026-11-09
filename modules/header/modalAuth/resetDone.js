import { CheckAuthMobile } from '@/ui/Icons';
import Typography from '@mui/material/Typography';

// Восстановление пароля: финальный экран внутри окна (пароль сохранён, пользователь вошёл).
export default function ResetDone({ closeModal, isMobileAuth = false }) {
  const matches = isMobileAuth;

  return (
    <div
      className={
        (matches ? 'modalLoginFinishMobile' : 'modalLoginFinishPC') +
        ' resetStep resetDone'
      }
    >
      <div className="loginSVG">
        <CheckAuthMobile />
      </div>

      <div className="loginSubHeader">
        <Typography component="span">Вы вошли в аккаунт.</Typography>
        <Typography component="span">
          Новый пароль работает на сайте и в приложении.
        </Typography>
      </div>

      <div className="resetActions">
        <div
          className="loginLogin"
          role="button"
          tabIndex={0}
          onClick={closeModal}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              closeModal();
            }
          }}
        >
          <Typography component="span">Продолжить</Typography>
        </div>
      </div>
    </div>
  );
}
