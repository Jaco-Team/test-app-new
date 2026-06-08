'use client';

import Link from 'next/link';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import type {
  PickersActionBarAction,
  PickersActionBarProps,
} from '@mui/x-date-pickers/PickersActionBar';
import { ru } from 'date-fns/locale';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  ArrowLeftMobile,
  EditPencilMobile,
  LockMobile,
  ProfileIconNew,
} from '@src/shared/ui/icons/Icons';
import { useAuthStore } from '@src/features/auth/model/authStore';
import { cityBase, cityPath } from '@src/shared/lib/sitePaths';
import { MuiSwitch, MuiTextField } from '@src/shared/ui';
import { useCabinetAccess } from '../model/useCabinetAccess';
import { useProfilePage } from '../model/useProfilePage';
import './ProfilePage.scss';

function DatePickerActionBar({
  onAccept,
  onCancel,
  actions,
  className,
}: PickersActionBarProps) {
  return (
    <DialogActions
      className={className}
      sx={{
        flexDirection: 'column',
        paddingBottom: '7vw',
        paddingLeft: '7vw',
        paddingRight: '7vw',
      }}
    >
      {actions?.includes('cancel') ? (
        <Button
          onClick={onCancel}
          sx={{
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: 100,
            color: 'black',
            width: '100%',
            marginBottom: '3vw',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Отмена
        </Button>
      ) : null}
      {actions?.includes('accept') ? (
        <Button
          onClick={onAccept}
          sx={{
            backgroundColor: '#cc0033',
            border: '1px solid #cc0033',
            color: 'white',
            borderRadius: 100,
            width: '100%',
            marginLeft: '0 !important',
            '&:hover': { backgroundColor: '#cc0033' },
          }}
        >
          Выбрать
        </Button>
      ) : null}
    </DialogActions>
  );
}

export function ProfilePage() {
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
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ru}
              localeText={{
                cancelButtonLabel: 'Отмена',
                okButtonLabel: 'Выбрать',
                todayButtonLabel: 'Сегодня',
                datePickerToolbarTitle: 'Выбрать дату',
              }}
            >
              <MobileDatePicker
                value={birthDate}
                onChange={(value) => setBirthDate(value)}
                format="d MMMM yyyy"
                minDate={minDate}
                maxDate={maxDate}
                disabled={birthDateLocked}
                onAccept={(value) => saveBirthDate(value)}
                onClose={() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }}
                slots={{ actionBar: DatePickerActionBar }}
                views={['year', 'month', 'day']}
                slotProps={
                  {
                    actionBar: { actions: ['cancel', 'accept'] },
                    toolbar: {
                      toolbarFormat: 'd MMMM yyyy',
                      sx: {
                        '& span, & h4': {
                          textAlign: 'center',
                          width: '100%',
                        },
                      },
                    },
                    mobilePaper: {
                      sx: { borderRadius: '5vw' },
                    },
                    textField: {
                      className: 'profile-page__birthday-input',
                      sx: {
                        '& .MuiOutlinedInput-root fieldset': {
                          borderWidth: 0,
                        },
                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                          borderColor: 'transparent',
                        },
                        '& .MuiOutlinedInput-input': {
                          fontWeight: 500,
                          userSelect: 'none',
                        },
                      },
                    },
                    day: {
                      sx: {
                        '&.Mui-selected': {
                          backgroundColor: '#cc0033',
                          color: '#fff',
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: '#cc0033',
                        },
                      },
                    },
                  } as {
                    actionBar?: { actions?: PickersActionBarAction[] };
                  }
                }
              />
            </LocalizationProvider>
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
            range="responsive"
            surface="outlined"
            placeholder="Имя"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={saveMainData}
          />
          <MuiTextField
            className="profile-page__desktop-input"
            range="responsive"
            surface="outlined"
            value={login}
            InputProps={{ readOnly: true }}
          />
          <MuiTextField
            className="profile-page__desktop-input"
            range="responsive"
            surface="outlined"
            placeholder="name@mail.ru"
            value={mail}
            onChange={(event) => setMail(event.target.value)}
            onBlur={saveMainData}
          />
        </div>
      </section>

      <section className="profile-page__checks">
        <span>Хочу получать СМС с акциями и скидками</span>
        <MuiSwitch
          className="profile-page__sms-switch profile-page__sms-switch--desktop"
          size="profile"
          checked={isSpam === 1}
          onChange={(event) => changeSpam(event.target.checked)}
        />
      </section>

      <section className="profile-page__birthday-block">
        <div className="profile-page__birthday-promo">
          <span>Подарим промокод на бесплатный ролл ко дню рождения.</span>
        </div>
        <div className="profile-page__birthday-form">
          <div className="profile-page__birthday-caption">
            Дата вашего рождения
          </div>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ru}
            localeText={{
              cancelButtonLabel: 'Отмена',
              okButtonLabel: 'Выбрать',
              todayButtonLabel: 'Сегодня',
              datePickerToolbarTitle: 'Выбрать дату',
            }}
          >
            <MobileDatePicker
              value={birthDate}
              onChange={(value) => setBirthDate(value)}
              format="d MMMM yyyy"
              minDate={minDate}
              maxDate={maxDate}
              disabled={birthDateLocked}
              onAccept={(value) => saveBirthDate(value)}
              slots={{ actionBar: DatePickerActionBar }}
              views={['year', 'month', 'day']}
              slotProps={
                {
                  actionBar: { actions: ['cancel', 'accept'] },
                  toolbar: {
                    toolbarFormat: 'd MMMM yyyy',
                    sx: {
                      '& span, & h4': {
                        textAlign: 'center',
                        width: '100%',
                      },
                    },
                  },
                  mobilePaper: {
                    sx: { borderRadius: '1.488vw' },
                  },
                  textField: {
                    className:
                      'profile-page__birthday-input profile-page__birthday-input--desktop',
                  },
                  day: {
                    sx: {
                      '&.Mui-selected': {
                        backgroundColor: '#cc0033',
                        color: '#fff',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: '#cc0033',
                      },
                    },
                  },
                } as {
                  actionBar?: { actions?: PickersActionBarAction[] };
                }
              }
            />
          </LocalizationProvider>
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
            onClick={() => void openModalAddr(0, citySlug)}
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
                      onClick={() =>
                        void openModalAddr(
                          item.id,
                          String(item.city ?? citySlug)
                        )
                      }
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
