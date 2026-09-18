import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStoreNew } from '@/components/store';
import { trackAuthClientEvent } from '@/components/api';
import { importWithRetry } from '@/utils/importWithRetry';

import { FormattedInputs } from '@/ui/MyTextInput';
import { Check } from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

const SmartCaptcha = dynamic(
  () =>
    importWithRetry(
      () => import('@yandex/smart-captcha').then((mod) => mod.SmartCaptcha),
      { retries: 1, delayMs: 600 }
    ),
  { ssr: false }
);

export default function LoginSMS({ isMobileAuth = false }) {
  const [
    changeLogin,
    loginLogin,
    createProfile,
    navigate,
    preTypeLogin,
    setTimer,
    setActiveModalAlert,
  ] = useHeaderStoreNew((state) => [
    state?.changeLogin,
    state?.loginLogin,
    state?.createProfile,
    state?.navigate,
    state?.preTypeLogin,
    state?.setTimer,
    state?.setActiveModalAlert,
  ]);
  const matches = isMobileAuth;

  const [token, setToken] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captchaContainerRef = useRef(null);
  const captchaReadyReportedRef = useRef(false);
  const captchaSiteKey = process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY || '';
  const isResend = preTypeLogin === 'loginSMSCode';

  const canSubmit = useMemo(
    () =>
      loginLogin.length === 17 &&
      token.length > 0 &&
      captchaError.length === 0 &&
      !isSubmitting,
    [loginLogin.length, token, captchaError, isSubmitting]
  );

  const isAppWebView =
    typeof window !== 'undefined' &&
    !/^https?:$/.test(window.location.protocol);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const root = captchaContainerRef.current;
    if (!root) {
      return undefined;
    }

    captchaReadyReportedRef.current = false;

    const hasCaptchaWidget = () => {
      return Boolean(
        root.querySelector(
          'iframe, input[name=\"smart-token\"], [data-smart-captcha], .smart-captcha'
        ) || root.childElementCount > 0
      );
    };

    const markWidgetReady = () => {
      if (hasCaptchaWidget()) {
        if (!captchaReadyReportedRef.current) {
          captchaReadyReportedRef.current = true;
          trackAuthClientEvent('captcha_rendered', {
            screen: 'login_sms',
          });
        }

        setCaptchaError((currentError) =>
          currentError ===
          'Не удалось загрузить капчу. Проверьте интернет и попробуйте ещё раз.'
            ? ''
            : currentError
        );
      }
    };

    markWidgetReady();

    const observer = new MutationObserver(markWidgetReady);
    observer.observe(root, { childList: true, subtree: true });

    const timeoutId = window.setTimeout(() => {
      if (!hasCaptchaWidget()) {
        trackAuthClientEvent('captcha_error', {
          screen: 'login_sms',
          outcome: 'error',
          reason: 'widget_timeout',
        });
        setCaptchaError(
          (currentError) =>
            currentError ||
            'Не удалось загрузить капчу. Проверьте интернет и попробуйте ещё раз.'
        );
      }
    }, 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [captchaKey]);

  const handleCaptchaSuccess = (captchaToken) => {
    setCaptchaError('');
    setToken(captchaToken || '');
    trackAuthClientEvent('captcha_solved', {
      screen: 'login_sms',
      outcome: 'success',
      number: loginLogin,
    });
  };

  const handleCaptchaFailure = (reason) => {
    setToken('');
    trackAuthClientEvent('captcha_error', {
      screen: 'login_sms',
      outcome: 'error',
      reason,
      number: loginLogin,
    });
    setCaptchaError(
      'Капча временно недоступна. Проверьте интернет и попробуйте ещё раз.'
    );
  };

  const resetCaptcha = () => {
    setToken('');
    setCaptchaError('');
    captchaReadyReportedRef.current = false;
    setCaptchaKey((currentKey) => currentKey + 1);
  };

  const handleNavigate = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const captchaToken = token;
    setToken('');
    trackAuthClientEvent('phone_submitted', {
      screen: 'login_sms',
      number: loginLogin,
    });

    try {
      const isSent = await createProfile(captchaToken);

      if (!isSent) {
        setCaptchaKey((currentKey) => currentKey + 1);
        return;
      }

      navigate('loginSMSCode');
      setTimer(89);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneEnter = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (canSubmit) {
      handleNavigate();
      return;
    }

    handleBlockedSubmit();
  };

  const handleBlockedSubmit = () => {
    setActiveModalAlert(
      true,
      'Укажите телефон и подтвердите, что вы не робот',
      false
    );
    trackAuthClientEvent('phone_submitted', {
      screen: 'login_sms',
      outcome: 'failure',
      reason: 'submit_blocked',
      number: loginLogin,
    });
  };

  // <div className="loginErr">
  //   <Typography component="span">{errTextAuth}</Typography>
  // </div>

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>
      <div className="resetText">
        {isResend
          ? 'Подтвердите, что вы не робот, чтобы отправить код ещё раз'
          : 'Укажите свой номер телефона, мы отправим смс'}
      </div>

      <FormattedInputs
        type="text"
        placeholder="8 (000) 000-00-00"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={handlePhoneEnter}
        className={
          loginLogin.length > 0 ? 'inputLogin' : 'inputLogin lable_position'
        }
        mask={true}
        label="Телефон"
        inputAdornment={
          <InputAdornment position="end">
            {loginLogin.length === 17 ? <Check className="check_icon" /> : null}
          </InputAdornment>
        }
      />

      <div className="captchaWrapSMS">
        <div className="captchaScaleSMS" ref={captchaContainerRef}>
          {captchaSiteKey ? (
            <SmartCaptcha
              key={captchaKey}
              sitekey={captchaSiteKey}
              webview={isAppWebView}
              onSuccess={handleCaptchaSuccess}
              onNetworkError={() => handleCaptchaFailure('network_error')}
              onJavascriptError={() => handleCaptchaFailure('javascript_error')}
              onTokenExpired={() => {
                setToken('');
                trackAuthClientEvent('captcha_expired', {
                  screen: 'login_sms',
                  outcome: 'failure',
                  reason: 'token_expired',
                  number: loginLogin,
                });
              }}
            />
          ) : null}
        </div>
      </div>

      {captchaError ? (
        <div className="resetText" style={{ color: '#DD1A32', marginTop: 8 }}>
          <div>{captchaError}</div>
          <button
            type="button"
            onClick={resetCaptcha}
            style={{
              marginTop: 8,
              padding: 0,
              border: 0,
              background: 'transparent',
              color: '#DD1A32',
              textDecoration: 'underline',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            Повторить загрузку
          </button>
        </div>
      ) : null}

      <div
        className="loginLogin"
        onClick={canSubmit ? handleNavigate : handleBlockedSubmit}
        style={{
          backgroundColor: canSubmit ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)',
          marginTop: matches ? '10.25641025641vw' : 20,
          marginBottom: 20,
        }}
      >
        <Typography component="span">
          {isSubmitting ? 'Отправляем...' : 'Получить СМС'}
        </Typography>
      </div>
    </div>
  );
}
