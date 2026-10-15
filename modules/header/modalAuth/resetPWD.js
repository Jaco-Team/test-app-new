import { useState } from 'react';
import dynamic from 'next/dynamic';

import { useHeaderStoreNew } from '@/components/store';
import { importWithRetry } from '@/utils/importWithRetry';

import MyTextInput, { FormattedInputs } from '@/ui/MyTextInput';
import MyRadioGroup from '@/ui/MyRadioGroup';
import {
  EyeShow_modalOrder,
  EyeHide_modalOrder,
  ClearAuthMobile,
  Check,
} from '@/ui/Icons';

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

export default function ResetPWD({ isMobileAuth = false }) {
  const [typeAuth, preTypeLogin] = useHeaderStoreNew((state) => [
    state.typeAuth,
    state.preTypeLogin,
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [deliveryChannel, setDeliveryChannel] = useState(() =>
    preTypeLogin === 'loginSMSCode' &&
    ['sms', 'telegram', 'voice'].includes(typeAuth)
      ? typeAuth
      : 'sms'
  );
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  const [
    navigate,
    changeLogin,
    setPwdLogin,
    loginLogin,
    pwdLogin,
    sendsmsNewLogin,
    setActiveModalAlert,
  ] = useHeaderStoreNew((state) => [
    state?.navigate,
    state?.changeLogin,
    state?.setPwdLogin,
    state?.loginLogin,
    state?.pwdLogin,
    state?.sendsmsNewLogin,
    state?.setActiveModalAlert,
  ]);
  const matches = isMobileAuth;
  const captchaSiteKey = process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY || '';
  const canSubmit =
    loginLogin.length === 17 &&
    pwdLogin.length > 4 &&
    (!captchaSiteKey || captchaToken);

  const submit = async () => {
    if (!canSubmit) {
      setActiveModalAlert(
        true,
        'Укажите телефон, пароль и подтвердите, что вы не робот',
        false
      );
      return;
    }

    const sent = await sendsmsNewLogin({ deliveryChannel, captchaToken });
    if (!sent && captchaSiteKey) {
      setCaptchaToken('');
      setCaptchaKey((key) => key + 1);
    }
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void submit();
    }
  };

  // <div className="loginErr">
  //   <Typography component="span">{errTextAuth}</Typography>
  // </div>

  return (
    <div className={matches ? 'modalLoginStartMobile' : 'modalLoginStartPC'}>
      <div className="resetText">
        Укажите свой номер телефона и новый пароль
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
            {loginLogin.length === 17 ? <Check className="check_icon" /> : null}
          </InputAdornment>
        }
      />

      <MyTextInput
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={pwdLogin}
        func={(event) => setPwdLogin(event)}
        onKeyDown={handleEnter}
        className={
          pwdLogin.length > 0 ? 'inputLogin ' : 'inputLogin lable_position'
        }
        label="Пароль"
        inputAdornment={
          <InputAdornment position="end">
            {showPassword ? (
              <div className="eye_icon" onClick={() => setShowPassword(false)}>
                <EyeShow_modalOrder />
              </div>
            ) : (
              <div className="eye_icon" onClick={() => setShowPassword(true)}>
                <EyeHide_modalOrder />
              </div>
            )}
          </InputAdornment>
        }
      />

      <div className="authDeliveryChannel">
        <MyRadioGroup
          label="Способ получения кода"
          value={deliveryChannel}
          onChange={(event) => setDeliveryChannel(event.target.value)}
          name="password-recovery-channel"
          row
          options={[
            { value: 'sms', label: 'СМС' },
            { value: 'telegram', label: 'Telegram' },
            { value: 'voice', label: 'Звонок' },
          ]}
        />
      </div>

      {captchaSiteKey ? (
        <SmartCaptcha
          key={captchaKey}
          sitekey={captchaSiteKey}
          onSuccess={(token) => setCaptchaToken(token || '')}
          onTokenExpired={() => setCaptchaToken('')}
          onNetworkError={() => setCaptchaToken('')}
          onJavascriptError={() => setCaptchaToken('')}
        />
      ) : null}

      <div className="loginBox">
        <Typography
          component="span"
          onClick={() => navigate('loginSMS')}
          style={{ marginLeft: 'auto' }}
        >
          Вход по СМС
        </Typography>
      </div>

      <div
        className="loginLogin"
        onClick={() => void submit()}
        style={{
          backgroundColor: canSubmit ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)',
          marginTop: matches ? '10.25641025641vw' : null,
          marginBottom: matches ? '10.25641025641vw' : null,
        }}
      >
        <Typography component="span">Сменить пароль</Typography>
      </div>
    </div>
  );
}
