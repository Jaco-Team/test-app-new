import { useState } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStoreNew } from '@/components/store';
import { importWithRetry } from '@/utils/importWithRetry';
import { trackUmami } from '@/utils/umami';

import { FormattedInputs } from '@/ui/MyTextInput';
import { Check } from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// Невидимая капча: задание показывается только если Яндекс сомневается.
const InvisibleSmartCaptcha = dynamic(
  () =>
    importWithRetry(
      () =>
        import('@yandex/smart-captcha').then(
          (mod) => mod.InvisibleSmartCaptcha
        ),
      { retries: 1, delayMs: 600 }
    ),
  { ssr: false }
);

const CHANNELS = [
  { value: 'sms', label: 'СМС' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'voice', label: 'Звонок' },
];

// Восстановление пароля, шаг 1 из 3: телефон и канал. Пароль задаётся после подтверждения кода.
export default function ResetPWD({ isMobileAuth = false }) {
  const [
    navigate,
    changeLogin,
    loginLogin,
    typeAuth,
    sendRecoveryCode,
    setActiveModalAlert,
  ] = useHeaderStoreNew((state) => [
    state?.navigate,
    state?.changeLogin,
    state?.loginLogin,
    state?.typeAuth,
    state?.sendRecoveryCode,
    state?.setActiveModalAlert,
  ]);

  const [deliveryChannel, setDeliveryChannel] = useState(() =>
    CHANNELS.some((channel) => channel.value === typeAuth) ? typeAuth : 'sms'
  );
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const matches = isMobileAuth;
  const captchaSiteKey = process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY || '';
  const phoneReady = loginLogin.length === 17;
  const canSubmit = phoneReady && !isSending;

  const send = async (captchaToken = '') => {
    setIsSending(true);

    try {
      await sendRecoveryCode({ deliveryChannel, captchaToken });
    } finally {
      setIsSending(false);
    }
  };

  const submit = () => {
    if (isSending) {
      return;
    }

    if (!phoneReady) {
      setActiveModalAlert(true, 'Укажите номер телефона', false);
      return;
    }

    if (captchaSiteKey) {
      setIsSending(true);
      setCaptchaVisible(true);
      return;
    }

    void send();
  };

  const handleCaptchaSuccess = (token) => {
    setCaptchaVisible(false);
    setCaptchaKey((key) => key + 1);
    void send(token || '');
  };

  const handleCaptchaCancel = () => {
    setCaptchaVisible(false);
    setIsSending(false);
  };

  const handleCaptchaFailure = () => {
    handleCaptchaCancel();
    setCaptchaKey((key) => key + 1);
    setActiveModalAlert(
      true,
      'Не удалось пройти проверку. Попробуйте ещё раз.',
      false
    );
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={
        (matches ? 'modalLoginStartMobile' : 'modalLoginStartPC') + ' resetStep'
      }
    >
      <div className="resetText">
        Подтвердим номер, затем придумаете новый пароль
      </div>

      <FormattedInputs
        type="text"
        placeholder="8 (000) 000-00-00"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={handleEnter}
        className={
          loginLogin.length > 0
            ? 'inputLogin margin_bottom_30'
            : 'inputLogin lable_position margin_bottom_30'
        }
        mask={true}
        label="Телефон"
        inputAdornment={
          <InputAdornment position="end">
            {phoneReady ? <Check className="check_icon" /> : null}
          </InputAdornment>
        }
      />

      <div className="authDeliveryChannel">
        <span className="authDeliveryLabel" id="reset-channel-label">
          Куда прислать код
        </span>
        <div
          className="authDeliverySeg"
          role="radiogroup"
          aria-labelledby="reset-channel-label"
        >
          {CHANNELS.map((channel) => (
            <button
              key={channel.value}
              type="button"
              role="radio"
              aria-checked={deliveryChannel === channel.value}
              className={deliveryChannel === channel.value ? 'active' : ''}
              onClick={() => setDeliveryChannel(channel.value)}
            >
              {channel.label}
            </button>
          ))}
        </div>
      </div>

      {captchaSiteKey ? (
        <InvisibleSmartCaptcha
          key={captchaKey}
          sitekey={captchaSiteKey}
          language="ru"
          hideShield
          visible={captchaVisible}
          onSuccess={handleCaptchaSuccess}
          onChallengeVisible={() =>
            trackUmami('auth_captcha_challenge', { screen: 'resetPWD' })
          }
          onChallengeHidden={handleCaptchaCancel}
          onNetworkError={handleCaptchaFailure}
          onJavascriptError={handleCaptchaFailure}
        />
      ) : null}

      <div className="resetActions">
        <div
          className="loginLogin"
          role="button"
          tabIndex={0}
          onClick={submit}
          onKeyDown={handleEnter}
          style={{
            backgroundColor: canSubmit ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography component="span">
            {isSending ? 'Отправляем…' : 'Получить код'}
          </Typography>
        </div>

        <div className="loginBox">
          <Typography component="span" onClick={() => navigate('start')}>
            Вспомнил пароль
          </Typography>
          <Typography component="span" onClick={() => navigate('loginSMS')}>
            Войти без пароля
          </Typography>
        </div>

        {captchaSiteKey ? (
          <div className="captchaNote">Защищено Yandex SmartCaptcha</div>
        ) : null}
      </div>
    </div>
  );
}
