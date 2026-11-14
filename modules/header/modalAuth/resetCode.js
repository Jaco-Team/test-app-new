import { useEffect, useRef, useState } from 'react';
import AuthCode from 'react-auth-code-input';

import { useHeaderStoreNew } from '@/components/store';
import { trackAuthClientEvent } from '@/components/api';

import Typography from '@mui/material/Typography';

const HINT_BY_CHANNEL = {
  sms: 'Введите 4 цифры из СМС',
  telegram: 'Введите 4 цифры из Telegram',
  // «Звонок» — это звонок-сброс: код — последние цифры номера, с которого звонят.
  voice:
    'Сейчас поступит звонок — введите последние 4 цифры номера. Отвечать не нужно',
};

// Экран кода для двух сценариев:
// flow="recovery" — восстановление пароля: код только подтверждает номер, пароль на следующем шаге;
// flow="login" — «Войти без пароля»: код сразу входит в аккаунт (check_profile).
export default function ResetCode({ isMobileAuth = false, flow = 'recovery' }) {
  const [
    loginLogin,
    typeAuth,
    timer,
    setTimer,
    toTime,
    checkRecoveryCode,
    checkCode,
    navigate,
    authIntent,
  ] = useHeaderStoreNew((state) => [
    state?.loginLogin,
    state?.typeAuth,
    state?.timer,
    state?.setTimer,
    state?.toTime,
    state?.checkRecoveryCode,
    state?.checkCode,
    state?.navigate,
    state?.authIntent,
  ]);

  const inputRef = useRef(null);
  // Синхронный флаг: onChange может прийти дважды до перерисовки.
  const checkingRef = useRef(false);
  const [isChecking, setIsChecking] = useState(false);
  const matches = isMobileAuth;
  const hint = HINT_BY_CHANNEL[typeAuth] ?? HINT_BY_CHANNEL.sms;
  const resendLabel =
    typeAuth === 'voice' ? 'Позвонить ещё раз' : 'Отправить ещё раз';
  const isLogin = flow === 'login';
  const verifyCode = isLogin ? checkCode : checkRecoveryCode;

  useEffect(() => {
    trackAuthClientEvent('otp_screen_opened', {
      screen: 'otp',
      number: loginLogin,
    });
  }, [loginLogin]);

  useEffect(() => {
    if (timer <= 0) {
      return undefined;
    }

    const id = setTimeout(() => setTimer(timer - 1), 1000);

    return () => clearTimeout(id);
  }, [timer, setTimer]);

  // Код не кладём через changeCode: он сам вызывает check_profile (вход по СМС),
  // и тогда один код проверяется двумя запросами наперегонки.
  const handleChange = async (value) => {
    if (value.length !== 4 || checkingRef.current) {
      return;
    }

    checkingRef.current = true;
    setIsChecking(true);

    try {
      const ok = await verifyCode(value);

      if (!ok) {
        inputRef.current?.clear?.();
        inputRef.current?.focus?.();
      }
    } finally {
      checkingRef.current = false;
      setIsChecking(false);
    }
  };

  const backToChannel = () => {
    navigate(
      isLogin ? 'loginSMS' : authIntent === 'register' ? 'create' : 'resetPWD'
    );
  };

  return (
    <div
      className={
        (matches ? 'modalLoginStartMobile' : 'modalLoginStartPC') + ' resetStep'
      }
    >
      <div className="resetCodePhone">{loginLogin}</div>
      <div className="resetCodeHint">{hint}</div>

      <AuthCode
        ref={inputRef}
        autoFocus
        allowedCharacters="numeric"
        length={4}
        disabled={isChecking}
        onChange={(value) => void handleChange(value)}
        containerClassName="resetCodeCells"
        inputClassName="resetCodeCell"
      />

      <div className="resetCodeTimer">
        {timer > 0 ? (
          <Typography component="span">
            {resendLabel} через {toTime(timer)}
          </Typography>
        ) : (
          <Typography
            component="span"
            className="resetCodeLink active"
            onClick={backToChannel}
          >
            {resendLabel}
          </Typography>
        )}
      </div>

      <div className="resetActions">
        <Typography
          component="span"
          className="resetCodeLink"
          onClick={backToChannel}
        >
          Выбрать другой способ
        </Typography>
      </div>
    </div>
  );
}
