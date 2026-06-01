'use client';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useAuthStore } from '@src/features/auth/model/authStore';
import { useHeaderStore } from '@src/entities/header';
import { cityPath } from '@src/shared/lib/sitePaths';
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

  const title = typeLogin === 'loginSMSCode' ? 'Проверочный код' : 'Мой Жако';

  return (
    <div className="auth-modal__body">
      <h2 id="auth-modal-title" className="auth-modal__title">
        {title}
      </h2>

      {typeLogin === 'start' ? (
        <>
          <TextField
            fullWidth
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            margin="normal"
            className="auth-modal__field"
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={pwdLogin}
            onChange={setPwdLogin}
            margin="normal"
            className="auth-modal__field"
          />
          <Button
            fullWidth
            variant="contained"
            disabled={loading}
            className="auth-modal__submit"
            onClick={() => void logIn()}
          >
            Войти
          </Button>
          <Button
            fullWidth
            variant="text"
            className="auth-modal__link"
            onClick={() => navigate('loginSMS')}
          >
            Вход по СМС
          </Button>
        </>
      ) : null}

      {typeLogin === 'loginSMS' ? (
        <>
          <TextField
            fullWidth
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            margin="normal"
            className="auth-modal__field"
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={pwdLogin}
            onChange={setPwdLogin}
            margin="normal"
            className="auth-modal__field"
          />
          <Button
            fullWidth
            variant="contained"
            className="auth-modal__submit"
            onClick={() => void sendsmsNewLogin()}
          >
            Получить код
          </Button>
        </>
      ) : null}

      {typeLogin === 'loginSMSCode' ? (
        <TextField
          fullWidth
          label="Код из СМС"
          value={code}
          onChange={(event) => changeCode(event.target.value)}
          margin="normal"
          className="auth-modal__field"
          inputProps={{ maxLength: 4 }}
        />
      ) : null}

      {typeLogin === 'create' ? (
        <>
          <TextField
            fullWidth
            label="Телефон"
            value={loginLogin}
            onChange={changeLogin}
            margin="normal"
            className="auth-modal__field"
          />
          <Button
            fullWidth
            variant="contained"
            className="auth-modal__submit"
            onClick={async () => {
              const ok = await createProfile();
              if (ok) {
                navigate('loginSMSCode');
              }
            }}
          >
            Зарегистрироваться
          </Button>
        </>
      ) : null}

      {errTextAuth ? (
        <p className="auth-modal__error" role="alert">
          {errTextAuth}
        </p>
      ) : null}

      <AuthModalToggle />

      {isAuth === 'auth' ? (
        <Button
          fullWidth
          href={cityPath(city, 'profile')}
          className="auth-modal__link"
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
    <Button
      fullWidth
      variant="text"
      className="auth-modal__link"
      onClick={() => navigate(registerMode ? 'start' : 'create')}
    >
      {registerMode ? 'Уже есть аккаунт' : 'Создать аккаунт'}
    </Button>
  );
}
