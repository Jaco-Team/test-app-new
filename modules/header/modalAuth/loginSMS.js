import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStoreNew } from '@/components/store';
import { importWithRetry } from '@/utils/importWithRetry';

import { FormattedInputs } from '@/ui/MyTextInput';
import {Check} from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

const SmartCaptcha = dynamic(
  () =>
    importWithRetry(
      () => import('@yandex/smart-captcha').then((mod) => mod.SmartCaptcha),
      { retries: 1, delayMs: 600 },
    ),
  { ssr: false },
);

export default function LoginSMS() {
  const [changeLogin, loginLogin, createProfile, matches, navigate, setTimer, setActiveModalAlert] = useHeaderStoreNew((state) => [state?.changeLogin, state?.loginLogin, state?.createProfile, state?.matches, state?.navigate, state?.setTimer, state?.setActiveModalAlert]);

  const [token, setToken] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captchaContainerRef = useRef(null);

  const canSubmit = useMemo(() => loginLogin.length === 17 && token.length > 0 && captchaError.length === 0 && !isSubmitting, [loginLogin.length, token, captchaError, isSubmitting]);

  const isAppWebView = typeof window !== 'undefined' && !/^https?:$/.test(window.location.protocol);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const root = captchaContainerRef.current;
    if (!root) {
      return undefined;
    }

    const hasCaptchaWidget = () => {
      return Boolean(
        root.querySelector('iframe, input[name=\"smart-token\"], [data-smart-captcha], .smart-captcha') ||
        root.childElementCount > 0
      );
    };

    const markWidgetReady = () => {
      if (hasCaptchaWidget() && captchaError === 'Не удалось загрузить капчу. Проверьте интернет и попробуйте ещё раз.') {
        setCaptchaError('');
      }
    };

    markWidgetReady();

    const observer = new MutationObserver(markWidgetReady);
    observer.observe(root, { childList: true, subtree: true });

    const timeoutId = window.setTimeout(() => {
      if (!hasCaptchaWidget() && token.length === 0 && captchaError.length === 0) {
        setCaptchaError('Не удалось загрузить капчу. Проверьте интернет и попробуйте ещё раз.');
      }
    }, 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [captchaError, token]);

  const handleCaptchaSuccess = (captchaToken) => {
    setCaptchaError('');
    setToken(captchaToken || '');
  };

  const handleCaptchaFailure = () => {
    setToken('');
    setCaptchaError('Капча временно недоступна. Проверьте интернет и попробуйте ещё раз.');
  };

  const handleNavigate = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const isSent = await createProfile(token);

      if (!isSent) {
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

    setActiveModalAlert(true, 'Укажите телефон и подтвердите что вы не робот', false);
  };

  // <div className="loginErr">
  //   <Typography component="span">{errTextAuth}</Typography>
  // </div>

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>

      <div className="resetText">
        Укажите свой номер телефона, мы отправим смс
      </div>

      <FormattedInputs
        type="text"
        placeholder="8 (000) 000-00-00"
        value={loginLogin}
        func={(event) => changeLogin(event)}
        onKeyDown={handlePhoneEnter}
        className={loginLogin.length > 0 ? "inputLogin" : "inputLogin lable_position"}
        mask={true}
        label="Телефон"
        inputAdornment={
          <InputAdornment position="end">
            {loginLogin.length === 17 ? (
              <Check className="check_icon"  />
            ) : (
              null
            )}
          </InputAdornment>
        }
      /> 

      <div ref={captchaContainerRef} style={{ marginTop: 20 }}>
        <SmartCaptcha 
          sitekey="ysc1_1E96JpaPgfXfQRj6D9nNuEXcojKLSn528gKwiUyD1f8b2761" 
          webview={isAppWebView}
          onSuccess={handleCaptchaSuccess}
          onNetworkError={handleCaptchaFailure}
          onJavascriptError={handleCaptchaFailure}
          onTokenExpired={() => setToken('')}
        />
      </div>

      {captchaError ? (
        <div className="resetText" style={{ color: '#DD1A32', marginTop: 8 }}>
          {captchaError}
        </div>
      ) : null}

      <div className="loginLogin"
        onClick={ canSubmit ? handleNavigate : () => setActiveModalAlert(true, 'Укажите телефон и подтвердите что вы не робот', false) }
        style={{
          backgroundColor: canSubmit ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)',
          marginTop: matches ? '10.25641025641vw' : 20, 
          marginBottom: 20
        }}>
        <Typography component="span">{isSubmitting ? 'Отправляем...' : 'Получить СМС'}</Typography>
      </div>

    </div>
  );
}
