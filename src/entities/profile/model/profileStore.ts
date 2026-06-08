'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { api } from '@src/shared/api';
import { syncSentryUser } from '@src/shared/lib/monitoring/sentryAccount';
import { reuseAppStore } from '@src/shared/store/hotStore';
import type {
  ProfileOrder,
  ProfilePromo,
  ProfileStreet,
  ProfileUser,
} from './types';

export type { ProfileOrder, ProfilePromo, ProfileStreet, ProfileUser };

export type ProfileState = {
  userInfo: ProfileUser;
  streets: ProfileStreet[];
  promoListActive: ProfilePromo[];
  promoListOld: ProfilePromo[];
  orderList: ProfileOrder[];
  shortName: string;
  city: string;
  countPromo: number;
  countOrders: number;
  isOpenModalAddr: boolean;
  setUser: (user: ProfileUser, city?: string) => void;
  getUserInfo: (
    moduleName: string,
    city: string,
    userToken?: string
  ) => Promise<void>;
  updateUser: (
    moduleName: string,
    city: string,
    userToken?: string
  ) => Promise<void>;
  getPromoList: (
    moduleName: string,
    city: string,
    userToken?: string
  ) => Promise<void>;
  getOrderList: (
    moduleName: string,
    city: string,
    userToken?: string
  ) => Promise<void>;
  getCountPromosOrders: (city: string, userToken?: string) => Promise<void>;
  clearOrderList: () => void;
  delAddr: (addrId: number | string, token: string) => Promise<void>;
  openModalAddr: (id: number | string, city?: string) => Promise<void>;
  closeModalAddr: () => void;
};

function buildShortName(user?: ProfileUser | null): string {
  const name = String(user?.name ?? '').trim();
  return name ? name.slice(0, 1).toUpperCase() : '';
}

export const useProfileStore = reuseAppStore(
  'profile',
  createWithEqualityFn<ProfileState>(
    (set, get) => ({
      userInfo: {},
      streets: [],
      promoListActive: [],
      promoListOld: [],
      orderList: [],
      shortName: '',
      city: '',
      countPromo: 0,
      countOrders: 0,
      isOpenModalAddr: false,

      setUser: (user, city = '') => {
        syncSentryUser(user ?? {}, city || null);
        set({
          userInfo: user ?? {},
          shortName: buildShortName(user),
        });
      },

      getUserInfo: async (moduleName, city, userToken) => {
        const token = userToken ?? '';
        if (!token.length) {
          return;
        }

        const json = await api(moduleName, {
          type: 'get_my_info',
          city_id: city,
          user_id: token,
        });

        const user = (json?.user as ProfileUser | undefined) ?? {};
        const uid = user?.id;

        if (uid && typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'userId', user_id: String(uid) });
        }

        syncSentryUser(user, city);

        set({
          shortName: buildShortName(user),
          userInfo: user,
          streets: Array.isArray(json?.streets)
            ? (json.streets as ProfileStreet[])
            : [],
          city,
        });
      },

      updateUser: async (moduleName, city, userToken) => {
        const token = userToken ?? '';
        if (!token.length) {
          return;
        }

        await api(moduleName, {
          type: 'update_user',
          city_id: city,
          user_id: token,
          user: JSON.stringify(get().userInfo),
        });

        await get().getUserInfo(moduleName, city, token);
      },

      getPromoList: async (moduleName, city, userToken) => {
        const token = userToken ?? '';
        if (!token.length) {
          return;
        }

        const json = await api(moduleName, {
          type: 'get_my_promos',
          city_id: city,
          user_id: token,
        });

        set({
          promoListActive: Array.isArray(json?.active_list)
            ? (json.active_list as ProfilePromo[])
            : [],
          promoListOld: Array.isArray(json?.old_list)
            ? (json.old_list as ProfilePromo[])
            : [],
          city,
        });
      },

      getOrderList: async (moduleName, city, userToken) => {
        const token = userToken ?? '';
        if (!token.length) {
          return;
        }

        const json = await api(moduleName, {
          type: 'get_my_orders_new_',
          city_id: city,
          user_id: token,
        });

        set({
          orderList: Array.isArray(json?.order_list)
            ? (json.order_list as ProfileOrder[])
            : [],
          city,
        });
      },

      getCountPromosOrders: async (city, userToken) => {
        const token = userToken ?? '';
        if (!token.length) {
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

      clearOrderList: () => {
        set({ orderList: [] });
      },

      delAddr: async (addrId, token) => {
        const json = await api('profile', {
          type: 'del_my_addr',
          city_id: get().city,
          token,
          addr_id: addrId,
        });

        if (json?.st === true) {
          await get().getUserInfo('profile', get().city, token);
        }
      },

      openModalAddr: async (id, city = '') => {
        const json = await api('profile', {
          type: 'get_data_for_streets',
          city_id: city || get().city,
          street_id: id,
        });

        const streetParts = json?.this_info?.street?.split(', ');
        if (
          json?.this_info?.street &&
          Array.isArray(streetParts) &&
          streetParts.length > 1
        ) {
          json.this_info.street = streetParts[1];
        }

        set({
          isOpenModalAddr: true,
        });
      },

      closeModalAddr: () => {
        set({ isOpenModalAddr: false });
      },
    }),
    shallow
  )
);
