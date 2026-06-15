'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  ArrowLeftMobile,
  EditPencilMobile,
  LockMobile,
  ProfileIconNew,
} from '@src/shared/ui/icons/Icons';
import { useAuthStore } from '@src/features/auth/model/authStore';
import { cityBase, cityPath } from '@src/shared/lib/sitePaths';
import {
  MuiMobileDatePickerField,
  MuiSwitch,
  MuiTextField,
} from '@src/shared/ui';
import { useCabinetAccess } from '@src/features/cabinet-access';
import { useProfilePage } from '../model/useProfilePage';
import './ProfilePage.scss';

function blurActiveElement() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

const profileCompactInputSlotProps = {
  input: {
    className: 'profile-page__input-control',
  },
  htmlInput: {
    className: 'profile-page__input-element',
  },
} as const;

const profileDesktopInputSlotProps = {
  input: {
    className: 'profile-page__desktop-input-control',
  },
} as const;

const profileCompactBirthdayTextFieldSlotProps = {
  input: {
    className: 'profile-page__birthday-control',
  },
  htmlInput: {
    className: 'profile-page__birthday-element',
    style: { fontWeight: 500, userSelect: 'none' },
  },
} as const;

const profileDesktopBirthdayTextFieldSlotProps = {
  input: {
    className: 'profile-page__birthday-desktop-control',
  },
} as const;

export function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressModalWasRequested = useRef(false);
  const { citySlug, compact, ready } = useCabinetAccess();
  const {
    streets,
    token,
    shortName,
    name,
    setName,
    mail,
    setMail,
    login,
    isSpam,
    birthDate,
    setBirthDate,
    birthDateLocked,
    saveMainData,
    changeSpam,
    saveBirthDate,
    delAddr,
    openModalAddr,
  } = useProfilePage(citySlug);
  const signOut = useAuthStore((state) => state.signOut);

  const now = new Date();
  const minDate = new Date(
    now.getFullYear() - 100,
    now.getMonth(),
    now.getDate()
  );
  const maxDate = new Date(
    now.getFullYear() - 10,
    now.getMonth(),
    now.getDate()
  );

  useEffect(() => {
    if (!ready || compact || !token.length) {
      return;
    }

    if (searchParams?.get('openAddressModal') !== '1') {
      return;
    }

    if (addressModalWasRequested.current) {
      return;
    }

    addressModalWasRequested.current = true;
    void openModalAddr(0, 'cart');
    router.replace(cityPath(citySlug, 'profile'));
  }, [citySlug, compact, openModalAddr, ready, router, searchParams, token]);

  if (!ready) {
    return null;
  }

  if (compact) {
    return (
      <div className="profile-page profile-page--compact">
        <div className="profile-page__toolbar">
          <Link
            className="profile-page__back"
            href={cityPath(citySlug, 'account')}
            aria-label="Назад в аккаунт"
          >
            <ArrowLeftMobile />
          </Link>
          <span className="profile-page__toolbar-title">Личные данные</span>
        </div>

        <div className="profile-page__fields">
          <div className="profile-page__row profile-page__row--input">
            <MuiTextField
              className="profile-page__input"
              range="compact"
              surface="plain"
              placeholder="Имя"
              slotProps={profileCompactInputSlotProps}
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={saveMainData}
            />
            <EditPencilMobile />
          </div>

          <div className="profile-page__row profile-page__row--readonly">
            <span className="profile-page__readonly-value">{login}</span>
            <LockMobile />
          </div>

          <div className="profile-page__row profile-page__row--birthday">
            <MuiMobileDatePickerField
              className="profile-page__birthday-input"
              range="compact"
              surface="plain"
              placeholder="День рождения"
              value={birthDate}
              onChange={(value) => setBirthDate(value)}
              format="d MMMM yyyy"
              minDate={minDate}
              maxDate={maxDate}
              disabled={birthDateLocked}
              onAccept={(value) => saveBirthDate(value)}
              onClose={blurActiveElement}
              slotProps={{
                textField: {
                  slotProps: profileCompactBirthdayTextFieldSlotProps,
                },
              }}
            />
            {!birthDateLocked ? (
              <div className="profile-page__birthday-hint">
                Подарим промокод ко дню рождения
              </div>
            ) : (
              <LockMobile />
            )}
          </div>

          <div className="profile-page__row profile-page__row--input">
            <MuiTextField
              className="profile-page__input"
              range="compact"
              surface="plain"
              placeholder="Электронная @ почта"
              type="email"
              autoComplete="off"
              slotProps={profileCompactInputSlotProps}
              value={mail}
              onChange={(event) => setMail(event.target.value)}
              onBlur={saveMainData}
            />
            <EditPencilMobile />
          </div>

          <div className="profile-page__row profile-page__row--switch">
            <span
              className={
                'profile-page__switch-label' +
                (isSpam === 1 ? ' profile-page__switch-label--active' : '')
              }
            >
              Хочу получать СМС с акциями, скидками и подарками
            </span>
            <MuiSwitch
              className="profile-page__sms-switch"
              size="profile"
              checked={isSpam === 1}
              onChange={(event) => changeSpam(event.target.checked)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page profile-page--desktop">
      <section className="profile-page__hero-data">
        <div className="profile-page__avatar" aria-hidden="true">
          {shortName ? shortName : <ProfileIconNew />}
        </div>
        <div className="profile-page__hero-fields">
          <MuiTextField
            className="profile-page__desktop-input"
            surface="outlined"
            placeholder="Имя"
            slotProps={profileDesktopInputSlotProps}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={saveMainData}
          />
          <MuiTextField
            className="profile-page__desktop-input"
            surface="outlined"
            value={login}
            slotProps={{
              ...profileDesktopInputSlotProps,
              htmlInput: {
                readOnly: true,
              },
            }}
          />
          <MuiTextField
            className="profile-page__desktop-input"
            surface="outlined"
            placeholder="name@mail.ru"
            slotProps={profileDesktopInputSlotProps}
            value={mail}
            onChange={(event) => setMail(event.target.value)}
            onBlur={saveMainData}
          />

          <div className="profile-page__checks">
            <span>Хочу получать СМС с акциями и скидками</span>
            <MuiSwitch
              className="profile-page__sms-switch profile-page__sms-switch--desktop"
              size="profile"
              checked={isSpam === 1}
              onChange={(event) => changeSpam(event.target.checked)}
            />
          </div>
        </div>
      </section>

      <section className="profile-page__birthday-block">
        <div className="profile-page__birthday-promo">
          <span>
            Подарим промокод на бесплатный ролл <br /> ко дню рождения.
          </span>
        </div>
        <div className="profile-page__birthday-form">
          <div className="profile-page__birthday-caption">
            Дата вашего рождения
          </div>
          <MuiMobileDatePickerField
            className="profile-page__birthday-input profile-page__birthday-input--desktop"
            surface="outlined"
            value={birthDate}
            onChange={(value) => setBirthDate(value)}
            format="d MMMM yyyy"
            minDate={minDate}
            maxDate={maxDate}
            disabled={birthDateLocked}
            onAccept={(value) => saveBirthDate(value)}
            slotProps={{
              textField: {
                slotProps: profileDesktopBirthdayTextFieldSlotProps,
              },
            }}
          />
          <p className="profile-page__birthday-note">
            Дату рождения можно выбрать только один раз. Будьте внимательны, так
            как изменить её позже не получится.
          </p>
        </div>
      </section>

      <section className="profile-page__addresses">
        <div className="profile-page__addresses-head">
          <h2>Мои адреса</h2>
          <button
            className="profile-page__addresses-add"
            type="button"
            onClick={() => void openModalAddr(0)}
          >
            Добавить
          </button>
        </div>
        <div className="profile-page__addresses-table-wrap">
          <table className="profile-page__addresses-table">
            <tbody>
              {streets.map((item) => (
                <tr key={String(item.id)}>
                  <td>{item.city_name}</td>
                  <td>
                    {item.name_street}, д. {item.home}, кв. {item.kv}
                  </td>
                  <td>
                    {parseInt(String(item.is_main ?? 0), 10) === 1 ? (
                      <span className="profile-page__addresses-badge">
                        Основной
                      </span>
                    ) : null}
                  </td>
                  <td>
                    <button
                      className="profile-page__addresses-edit"
                      type="button"
                      onClick={() => void openModalAddr(item.id)}
                    >
                      Изменить
                    </button>
                  </td>
                  <td>
                    <button
                      className="profile-page__addresses-delete"
                      type="button"
                      aria-label="Удалить адрес"
                      onClick={() => void delAddr(item.id, token)}
                    >
                      <CloseRoundedIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="profile-page__logout">
        <span className="profile-page__logout-hidden">Удалить аккаунт</span>
        <Link href={cityBase(citySlug)} onClick={() => signOut(citySlug)}>
          Выйти
        </Link>
      </div>
    </div>
  );
}
