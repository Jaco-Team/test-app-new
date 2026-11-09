import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

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

// Регистрация, шаг 1 из 3: телефон, согласия и канал кода.
// Дальше тот же путь, что у восстановления: код (resetCode) → пароль (resetNewPwd) → готово (resetDone),
// запросы помечены intent=register.
export default function Create({ city, isMobileAuth = false }) {
  const [
    changeLogin,
    loginLogin,
    typeAuth,
    sendRecoveryCode,
    setAuthIntent,
    setActiveModalAlert,
  ] = useHeaderStoreNew((state) => [
    state?.changeLogin,
    state?.loginLogin,
    state?.typeAuth,
    state?.sendRecoveryCode,
    state?.setAuthIntent,
    state?.setActiveModalAlert,
  ]);

  const [deliveryChannel, setDeliveryChannel] = useState(() =>
    CHANNELS.some((channel) => channel.value === typeAuth) ? typeAuth : 'sms'
  );
  const [checkPolitika, setCheckPolitika] = useState(false);
  const [checkAccord, setCheckAccord] = useState(false);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const matches = isMobileAuth;
  const captchaSiteKey = process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY || '';
  const phoneReady = loginLogin.length === 17;
  const consentsReady = checkPolitika && checkAccord;
  const canSubmit = phoneReady && consentsReady && !isSending;

  useEffect(() => {
    setAuthIntent('register');
  }, [setAuthIntent]);

  const send = async (captchaToken = '') => {
    setIsSending(true);

    try {
      setAuthIntent('register');
      await sendRecoveryCode({ deliveryChannel, captchaToken });
    } finally {
      setIsSending(false);
    }
  };

  const submit = () => {
    if (isSending) {
      return;
    }

    if (!phoneReady || !consentsReady) {
      setActiveModalAlert(
        true,
        'Укажите номер телефона и подтвердите согласия',
        false
      );
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
        (matches ? 'modalLoginStartMobile' : 'modalLoginStartPC') + ' resetStep regStep'
      }
    >
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
        <span className="authDeliveryLabel" id="register-channel-label">
          Куда прислать код
        </span>
        <div
          className="authDeliverySeg"
          role="radiogroup"
          aria-labelledby="register-channel-label"
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

      <div className="authConsents">
        <label className="authConsent">
          <input
            type="checkbox"
            checked={checkPolitika}
            onChange={(event) => setCheckPolitika(event.target.checked)}
          />
          <span>
            Я даю <Link href={'/' + city + '/legal'}>согласие</Link> на
            обработку персональных данных в соответствии с Политикой, а также
            согласие на рекламную рассылку, от которой можно отказаться в любой
            момент
          </span>
        </label>
        <label className="authConsent">
          <input
            type="checkbox"
            checked={checkAccord}
            onChange={(event) => setCheckAccord(event.target.checked)}
          />
          <span>
            Я принимаю условия{' '}
            <Link href={'/' + city + '/politika-konfidencialnosti'}>
              оферты
            </Link>
          </span>
        </label>
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
            trackUmami('auth_captcha_challenge', { screen: 'create' })
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

        {captchaSiteKey ? (
          <div className="captchaNote">Защищено Yandex SmartCaptcha</div>
        ) : null}
      </div>
    </div>
  );
}
