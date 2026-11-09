import { useHeaderStoreNew } from '@/components/store';
import { CheckAuthMobile } from '@/ui/Icons';
import Typography from '@mui/material/Typography';

// Восстановление пароля: финальный экран внутри окна (пароль сохранён, пользователь вошёл).
export default function ResetDone({ closeModal, isMobileAuth = false }) {
  const matches = isMobileAuth;
  const authIntent = useHeaderStoreNew((state) => state?.authIntent);
  const isRegister = authIntent === 'register';

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
          {isRegister
            ? 'Теперь можно сохранять адреса и повторять прежние заказы.'
            : 'Новый пароль работает на сайте и в приложении.'}
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
