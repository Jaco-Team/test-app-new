'use client';

import Cookies from 'js-cookie';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { useProfileStore } from '@src/entities/profile';
import { useHeaderStore } from '@src/entities/header';
import { api } from '@src/shared/api';
import { syncSentryUser } from '@src/shared/lib/monitoring/sentryAccount';
import { reuseAppStore } from '@src/shared/store/hotStore';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/browserStorage';
import { normalizeLogin } from '../lib/normalizeLogin';

export type AuthLoginStep =
  | 'start'
  | 'create'
  | 'loginSMS'
  | 'loginSMSCode'
  | 'resetPWD'
  | 'finish';

export type AuthState = {
  errTextAuth: string;
  token: string;
  typeLogin: AuthLoginStep;
  preTypeLogin: string;
  loginLogin: string;
  pwdLogin: string;
  code: string;
  loading: boolean;
  timer: number;
  timerPage: boolean;
  doubleClickSMS: boolean;
  yandexAuthLink: string;
  navigate: (step: AuthLoginStep) => void;
  changeLogin: (event: { target: { value: string } }) => void;
  setPwdLogin: (event: { target: { value: string } } | null) => void;
  changeCode: (code: string) => void;
  logIn: () => Promise<void>;
  checkCode: () => Promise<void>;
  createProfile: (token?: string) => Promise<boolean>;
  sendsmsNewLogin: () => Promise<void>;
  closeModalAuth: () => void;
  signOut: (city: string) => void;
  yandexAuthCheck: (code: string) => Promise<void>;
  getYandexLinkAuth: (city: string) => Promise<string>;
};

function setNameUser(name: unknown): string {
  return String(name ?? '').trim();
}

export const useAuthStore = reuseAppStore(
  'auth',
  createWithEqualityFn<AuthState>(
    (set, get) => ({
      errTextAuth: '',
      token: '',
      typeLogin: 'start',
      preTypeLogin: '',
      loginLogin: '',
      pwdLogin: '',
      code: '',
      loading: false,
      timer: 89,
      timerPage: false,
      doubleClickSMS: false,
      yandexAuthLink: '',

      navigate: (typeLogin) => {
        set({
          typeLogin,
          errTextAuth: '',
          preTypeLogin: get().typeLogin,
        });
      },

      changeLogin: (event) => {
        set({ loginLogin: normalizeLogin(event.target.value) });
      },

      setPwdLogin: (event) => {
        if (event) {
          set({ pwdLogin: event.target.value.replaceAll(' ', '') });
        } else {
          set({ pwdLogin: '' });
        }
      },

      changeCode: (code) => {
        const normalized = String(code ?? '').replaceAll('•', '');
        set({ code: normalized, errTextAuth: '' });
        if (normalized.length === 4) {
          void get().checkCode();
        }
      },

      closeModalAuth: () => {
        useHeaderStore.getState().setActiveModalAuth(false);
        set({
          errTextAuth: '',
          typeLogin: 'start',
          preTypeLogin: '',
          loginLogin: '',
          pwdLogin: '',
          code: '',
          timer: 89,
          timerPage: false,
        });
      },

      logIn: async () => {
        set({ loading: true });
        const login = normalizeLogin(get().loginLogin);
        const json = await api('auth', {
          type: 'site_login',
          number: login,
          pwd: get().pwdLogin,
        });

        if (json?.st === false) {
          set({ errTextAuth: String(json?.text ?? ''), loading: false });
          return;
        }

        const token = String(json?.token ?? '');
        set({
          errTextAuth: '',
          token,
          loading: false,
        });
        useHeaderStore.getState().setActiveModalAuth(false);
        useHeaderStore.setState({
          token,
          isAuth: 'auth',
          userName: setNameUser(json?.name),
        });
        setLocalStorageItem('token', token);
        Cookies.set('token', token, { expires: 60 });
      },

      checkCode: async () => {
        const login = normalizeLogin(get().loginLogin);
        const isSpecialUser = Cookies.get('isSpecialUser');
        const data: Record<string, unknown> = {
          type: 'check_profile',
          number: login,
          cod: get().code,
        };
        if (isSpecialUser) {
          data.isSpecialUser = true;
        }

        const res = await api('auth', data);
        if (res?.st === false) {
          set({ errTextAuth: String(res?.text ?? '') });
          return;
        }

        const token = String(res?.token ?? '');
        if (get().preTypeLogin === 'create') {
          set({ typeLogin: 'finish', token });
        } else {
          get().closeModalAuth();
        }

        useHeaderStore.setState({
          token,
          isAuth: 'auth',
          userName: setNameUser(res?.name),
        });
        setLocalStorageItem('token', token);
        Cookies.set('token', token, { expires: 60 });
      },

      createProfile: async (token) => {
        if (get().doubleClickSMS) {
          return false;
        }
        set({ doubleClickSMS: true });

        const login = normalizeLogin(get().loginLogin);
        const isSpecialUser = Cookies.get('isSpecialUser');
        const data: Record<string, unknown> = {
          type: 'create_profile',
          number: login,
          token,
        };
        if (isSpecialUser) {
          data.isSpecialUser = true;
        }

        const json = await api('auth', data);
        window.setTimeout(() => set({ doubleClickSMS: false }), 300);

        if (json?.st) {
          set({ errTextAuth: '' });
          return true;
        }

        set({ errTextAuth: String(json?.text ?? '') });
        return false;
      },

      sendsmsNewLogin: async () => {
        if (get().doubleClickSMS) {
          return;
        }
        set({ doubleClickSMS: true });

        if (get().typeLogin !== 'loginSMSCode') {
          set({ timerPage: false, timer: 89 });
          get().navigate('loginSMSCode');
        }

        const login = normalizeLogin(get().loginLogin);
        const json = await api('auth', {
          type: 'sendsmsrp',
          number: login,
          pwd: get().pwdLogin,
        });

        window.setTimeout(() => set({ doubleClickSMS: false }), 300);

        if (json?.st === true) {
          set({ errTextAuth: '' });
        } else {
          set({ errTextAuth: String(json?.text ?? '') });
        }
      },

      signOut: (city) => {
        syncSentryUser(null, city);
        removeLocalStorageItem('token');
        Cookies.remove('token');
        useHeaderStore.setState({ isAuth: 'none', token: '', userName: '' });
        set({ token: '' });
      },

      getYandexLinkAuth: async (city) => {
        const json = await api('auth', { type: 'getYaLinkAuth', city });
        const link = typeof json?.link === 'string' ? json.link.trim() : '';
        set({ yandexAuthLink: link });
        return link;
      },

      yandexAuthCheck: async (code) => {
        const isSpecialUser = Cookies.get('isSpecialUser');
        const data: Record<string, unknown> = {
          type: 'checkAuthYandex',
          code,
        };
        if (isSpecialUser) {
          data.isSpecialUser = true;
        }

        const json = await api('auth', data);
        if (json?.st === false) {
          set({ errTextAuth: String(json?.text ?? '') });
          return;
        }

        if (json?.st === true) {
          const token = String(json?.token ?? '');
          useHeaderStore.setState({
            token,
            isAuth: 'auth',
            userName: setNameUser(json?.name),
          });
          set({ token });
          setLocalStorageItem('token', token);
          Cookies.set('token', token, { expires: 60 });
          get().closeModalAuth();
        }
      },
    }),
    shallow
  )
);
