'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { api } from '@src/shared/api';
import { syncSentryUser } from '@src/shared/lib/monitoring/sentryAccount';
import { reuseAppStore } from '@src/shared/store/hotStore';

export type ProfileUser = Record<string, unknown>;

export type ProfileState = {
  userInfo: ProfileUser;
  countPromo: number;
  countOrders: number;
  setUser: (user: ProfileUser, city?: string) => void;
  getCountPromosOrders: (city: string, userToken?: string) => Promise<void>;
};

export const useProfileStore = reuseAppStore(
  'profile',
  createWithEqualityFn<ProfileState>(
    (set, get) => ({
      userInfo: {},
      countPromo: 0,
      countOrders: 0,

      setUser: (user, city = '') => {
        syncSentryUser(user as { id?: number | string }, city || null);
        set({ userInfo: user ?? {} });
      },

      getCountPromosOrders: async (city, userToken) => {
        const token = userToken ?? '';
        if (!token || token.length === 0) {
          return;
        }

        const json = await api('zakazy', {
          type: 'get_my_count_orders_promos',
          city_id: city,
          user_id: token,
        });

        set({
          countPromo: parseInt(String(json?.count_promo ?? 0), 10) || 0,
          countOrders: parseInt(String(json?.count_orders ?? 0), 10) || 0,
        });
      },
    }),
    shallow
  )
);
