'use client';

import Cookies from 'js-cookie';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { useProfileStore } from '@src/entities/profile/model/profileStore';
import { api } from '@src/shared/api';
import { syncSentryUser } from '@src/shared/lib/monitoring/sentryAccount';
import { reusePreviewStore } from '@src/shared/store/hotStore';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/browserStorage';

export type HeaderState = {
  activePage: string;
  openCityModal: boolean;
  openCityModalList: boolean;
  openAuthModal: boolean;
  openBasket: boolean;
  compactMenuOpen: boolean;
  matches: MediaQueryList | null;
  token: string;
  isAuth: 'none' | 'auth' | string;
  userName: string;
  isShowLoad: boolean;
  setActivePage: (page: string) => void;
  setActiveModalCity: (active: boolean) => void;
  setActiveModalCityList: (active: boolean) => void;
  setActiveModalAuth: (active: boolean) => void;
  setActiveBasket: (active: boolean) => void;
  setCompactMenuOpen: (open: boolean) => void;
  toggleCompactMenu: () => void;
  setMatches: (matches: MediaQueryList | null) => void;
  showLoad: (visible: boolean) => void;
  hydrateSession: (city: string) => Promise<void>;
};

export const useHeaderStore = reusePreviewStore(
  'preview-header',
  createWithEqualityFn<HeaderState>(
    (set, get) => ({
      activePage: 'home',
      openCityModal: false,
      openCityModalList: false,
      openAuthModal: false,
      openBasket: false,
      compactMenuOpen: false,
      matches: null,
      token: '',
      isAuth: 'none',
      userName: '',
      isShowLoad: false,

      setActivePage: (page) => set({ activePage: page }),
      setActiveModalCity: (active) => set({ openCityModal: active }),
      setActiveModalCityList: (active) => set({ openCityModalList: active }),
      setActiveModalAuth: (active) =>
        set({
          openAuthModal: active,
        }),
      setActiveBasket: (active) => set({ openBasket: active }),
      setCompactMenuOpen: (open) => set({ compactMenuOpen: open }),
      toggleCompactMenu: () =>
        set((state) => ({ compactMenuOpen: !state.compactMenuOpen })),
      setMatches: (matches) => set({ matches }),
      showLoad: (visible) => set({ isShowLoad: visible }),

      hydrateSession: async (city) => {
        if (typeof window === 'undefined') {
          return;
        }

        const applyAuth = (token: string, user: Record<string, unknown>) => {
          useProfileStore.getState().setUser(user, city);
          set({
            token,
            userName: String(user?.name ?? ''),
            isAuth: 'auth',
          });
          setLocalStorageItem('token', token);
          Cookies.set('token', token, { expires: 60 });
        };

        const checkToken = async (token: string) => {
          const json = await api('auth', { type: 'check_token', token });
          if (json?.st === false) {
            syncSentryUser(null, city);
            set({ isAuth: 'none', token: '' });
            return;
          }

          applyAuth(token, (json?.user as Record<string, unknown>) ?? {});
        };

        const stored = getLocalStorageItem('token');
        if (stored && stored.length > 0) {
          await checkToken(stored);
          return;
        }

        const cookieToken = Cookies.get('token');
        if (cookieToken && cookieToken.length > 0) {
          await checkToken(cookieToken);
          return;
        }

        syncSentryUser(null, city);
      },
    }),
    shallow
  )
);
