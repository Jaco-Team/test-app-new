'use client';

import { useAuthStore } from '@src/features/auth/model/authStore';
import { useHeaderStore } from '@src/entities/header';
import { cityPath } from '@src/shared/lib/sitePaths';
import { Button, CheckAuthMobile, MuiTextField } from '@src/shared/ui';
import './AuthModal.scss';

export type AuthModalBodyProps = {
  city: string;
};

export function AuthModalBody({ city }: AuthModalBodyProps) {
  const isAuth = useHeaderStore((state) => state.isAuth);
  const typeLogin = useAuthStore((state) => state.typeLogin);
  const navigate = useAuthStore((state) => state.navigate);
  const loginLogin = useAuthStore((state) => state.loginLogin);
  const pwdLogin = useAuthStore((state) => state.pwdLogin);
  const code = useAuthStore((state) => state.code);
  const errTextAuth = useAuthStore((state) => state.errTextAuth);
  const loading = useAuthStore((state) => state.loading);
  const changeLogin = useAuthStore((state) => state.changeLogin);
  const setPwdLogin = useAuthStore((state) => state.setPwdLogin);
  const changeCode = useAuthStore((state) => state.changeCode);
  const logIn = useAuthStore((state) => state.logIn);
  const createProfile = useAuthStore((state) => state.createProfile);
  const sendsmsNewLogin = useAuthStore((state) => state.sendsmsNewLogin);

  const titleMap = {
    start: 'Мой Жако',
    create: 'Мой Жако',
    loginSMS: 'Вход по СМС',
    loginSMSCode: 'Проверочный код',
    resetPWD: 'Восстановление входа',
    finish: 'Все получилось',
  } as const;
  const title = titleMap[typeLogin] ?? 'Мой Жако';

  return (
    <div className="auth-modal__body">
      <h2 id="auth-modal-title" className="auth-modal__title">
        {title}
      </h2>

      {(typeLogin === 'start' || typeLogin === 'create') && <AuthModalToggle />}

      {typeLogin === 'start' ? (
        <>
          <MuiTextField
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            className="auth-modal__field"
            layout="auth-modal"
            placeholder="8 (000) 000-00-00"
          />
          <MuiTextField
            label="Пароль"
            type="password"
            value={pwdLogin}
            onChange={setPwdLogin}
            className="auth-modal__field"
            layout="auth-modal"
            placeholder="Введите пароль"
          />
          <Button
            fullWidth
            disabled={loading}
            className="auth-modal__submit"
            onClick={() => void logIn()}
            size="lg"
          >
            Войти
          </Button>
          <Button
            fullWidth
            tone="muted"
            className="auth-modal__link"
            onClick={() => navigate('loginSMS')}
            size="sm"
          >
            Вход по СМС
          </Button>
        </>
      ) : null}

      {typeLogin === 'loginSMS' ? (
        <>
          <MuiTextField
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            className="auth-modal__field"
            layout="auth-modal"
            placeholder="8 (000) 000-00-00"
          />
          <MuiTextField
            label="Пароль"
            type="password"
            value={pwdLogin}
            onChange={setPwdLogin}
            className="auth-modal__field"
            layout="auth-modal"
            placeholder="Пароль не обязателен"
          />
          <Button
            fullWidth
            className="auth-modal__submit"
            onClick={() => void sendsmsNewLogin()}
            size="lg"
          >
            Получить код
          </Button>
        </>
      ) : null}

      {typeLogin === 'loginSMSCode' ? (
        <>
          <p className="auth-modal__note">
            Отправили код на номер {loginLogin || 'ваш телефон'}
          </p>
          <MuiTextField
            label="Код из СМС"
            value={code}
            onChange={(event) => changeCode(event.target.value)}
            className="auth-modal__field auth-modal__field--code"
            layout="auth-modal"
            slotProps={{
              htmlInput: {
                className: 'auth-modal__code-input',
                maxLength: 4,
                inputMode: 'numeric',
              },
            }}
            placeholder="0000"
          />
        </>
      ) : null}

      {typeLogin === 'create' ? (
        <>
          <MuiTextField
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            className="auth-modal__field"
            layout="auth-modal"
            placeholder="8 (000) 000-00-00"
          />
          <Button
            fullWidth
            className="auth-modal__submit"
            onClick={async () => {
              const ok = await createProfile();
              if (ok) {
                navigate('loginSMSCode');
              }
            }}
            size="lg"
          >
            Зарегистрироваться
          </Button>
        </>
      ) : null}

      {typeLogin === 'resetPWD' ? (
        <>
          <p className="auth-modal__note">
            Для быстрого входа используйте СМС-код на привязанный номер.
          </p>
          <Button
            fullWidth
            className="auth-modal__submit"
            size="lg"
            onClick={() => navigate('loginSMS')}
          >
            Войти по СМС
          </Button>
        </>
      ) : null}

      {typeLogin === 'finish' ? (
        <div className="auth-modal__finish">
          <span className="auth-modal__finish-icon" aria-hidden="true">
            <CheckAuthMobile />
          </span>
          <p className="auth-modal__finish-title">
            Ваш аккаунт зарегистрирован.
          </p>
          <p className="auth-modal__finish-text">
            Теперь можно сохранять адреса, привязывать карту и быстро повторять
            прежние заказы.
          </p>
          <Button
            fullWidth
            className="auth-modal__submit"
            size="lg"
            onClick={() => {
              window.location.href = cityPath(city, '');
            }}
          >
            Открыть меню
          </Button>
        </div>
      ) : null}

      {errTextAuth ? (
        <p className="auth-modal__error" role="alert">
          {errTextAuth}
        </p>
      ) : null}

      {isAuth === 'auth' ? (
        <Button
          fullWidth
          className="auth-modal__link"
          tone="muted"
          size="sm"
          onClick={() => {
            window.location.href = cityPath(city, 'profile');
          }}
        >
          Профиль
        </Button>
      ) : null}
    </div>
  );
}

function AuthModalToggle() {
  const typeLogin = useAuthStore((state) => state.typeLogin);
  const navigate = useAuthStore((state) => state.navigate);

  const registerMode = typeLogin === 'create';

  return (
    <div className="auth-modal__toggle" role="tablist" aria-label="Режим входа">
      <Button
        className={
          'auth-modal__toggle-button' +
          (!registerMode ? ' auth-modal__toggle-button--active' : '')
        }
        tone="muted"
        size="sm"
        aria-pressed={!registerMode}
        onClick={() => navigate('start')}
      >
        Вход
      </Button>
      <Button
        className={
          'auth-modal__toggle-button' +
          (registerMode ? ' auth-modal__toggle-button--active' : '')
        }
        tone="muted"
        size="sm"
        aria-pressed={registerMode}
        onClick={() => navigate('create')}
      >
        Регистрация
      </Button>
    </div>
  );
}
