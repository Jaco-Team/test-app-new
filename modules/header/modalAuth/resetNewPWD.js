import { useEffect, useState } from 'react';

import { useHeaderStoreNew } from '@/components/store';

import MyTextInput from '@/ui/MyTextInput';
import { EyeShow_modalOrder, EyeHide_modalOrder, Check } from '@/ui/Icons';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

const MIN_PASSWORD_LENGTH = 6;

// Как в шефе (JacoRecoveryScreen): чек-лист правил под полями.
// Длина и совпадение обязательны (бэкенд требует 6+), буквы и цифры — рекомендация.
const passwordRules = (password, repeat) => ({
  length: password.length >= MIN_PASSWORD_LENGTH,
  characters: /\p{L}/u.test(password) && /\d/.test(password),
  match: password.length > 0 && password === repeat,
});

const RULES = [
  ['length', `Не менее ${MIN_PASSWORD_LENGTH} символов`],
  ['characters', 'Буквы и цифры — так надёжнее'],
  ['match', 'Пароли совпадают'],
];

// Восстановление пароля, шаг 3 из 3: номер уже подтверждён кодом, задаём новый пароль.
export default function ResetNewPWD({ isMobileAuth = false }) {
  const [
    loginLogin,
    pwdLogin,
    setPwdLogin,
    setRecoveryPwd,
    setActiveModalAlert,
  ] = useHeaderStoreNew((state) => [
    state?.loginLogin,
    state?.pwdLogin,
    state?.setPwdLogin,
    state?.setRecoveryPwd,
    state?.setActiveModalAlert,
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [repeat, setRepeat] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const matches = isMobileAuth;
  const rules = passwordRules(pwdLogin, repeat);
  const longEnough = rules.length;
  const canSave = rules.length && rules.match && !isSaving;

  useEffect(() => {
    // В поле не должен попасть пароль, набранный ранее на экране входа.
    setPwdLogin('');
  }, [setPwdLogin]);

  const save = async () => {
    if (isSaving) {
      return;
    }

    if (!longEnough) {
      setActiveModalAlert(
        true,
        `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`,
        false
      );
      return;
    }

    if (repeat !== pwdLogin) {
      setActiveModalAlert(true, 'Пароли не совпадают', false);
      return;
    }

    setIsSaving(true);

    try {
      await setRecoveryPwd();
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void save();
    }
  };

  const eye = (
    <InputAdornment position="end">
      <div
        className="eye_icon"
        onClick={() => setShowPassword((value) => !value)}
      >
        {showPassword ? <EyeShow_modalOrder /> : <EyeHide_modalOrder />}
      </div>
    </InputAdornment>
  );

  return (
    <div
      className={
        (matches ? 'modalLoginStartMobile' : 'modalLoginStartPC') + ' resetStep'
      }
    >
      <div className="resetVerified">
        <Check className="check_icon" />
        <span>Номер {loginLogin} подтверждён</span>
      </div>

      <MyTextInput
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={pwdLogin}
        func={(event) => setPwdLogin(event)}
        onKeyDown={handleEnter}
        className={
          pwdLogin.length > 0
            ? 'inputLogin legendWide12 margin_bottom_30'
            : 'inputLogin legendWide12 lable_position margin_bottom_30'
        }
        label="Новый пароль"
        inputAdornment={eye}
      />

      <MyTextInput
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={repeat}
        func={(event) => setRepeat(event.target.value.replaceAll(' ', ''))}
        onKeyDown={handleEnter}
        className={
          repeat.length > 0
            ? 'inputLogin legendWide16'
            : 'inputLogin legendWide16 lable_position'
        }
        label="Повторите пароль"
        inputAdornment={eye}
      />

      <ul className="resetRules" aria-live="polite">
        {RULES.map(([rule, text]) => (
          <li key={rule} className={rules[rule] ? 'ok' : ''}>
            <Check className="ruleIcon" aria-hidden="true" />
            <span>
              {text}
              <span className="visuallyHidden">
                {rules[rule] ? ' — выполнено' : ' — не выполнено'}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="resetActions">
        <div
          className="loginLogin"
          role="button"
          tabIndex={0}
          onClick={() => void save()}
          onKeyDown={handleEnter}
          style={{
            backgroundColor: canSave ? '#DD1A32' : 'rgba(0, 0, 0, 0.1)',
            marginBottom: matches ? '10.25641025641vw' : null,
          }}
        >
          <Typography component="span">
            {isSaving ? 'Сохраняем…' : 'Сохранить пароль'}
          </Typography>
        </div>
      </div>
    </div>
  );
}
