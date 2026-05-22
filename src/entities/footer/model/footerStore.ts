'use client';

import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { api } from '@src/shared/api';
import { reuseAppStore } from '@src/shared/store/hotStore';

const FOOTER_CACHE_TTL_MS = 30000;
let footerInFlightPromise: Promise<Record<string, unknown>> | null = null;
let footerInFlightKey = '';

export type FooterState = {
  links: Record<string, unknown>;
  linksCity: string;
  linksLoadedAt: number;
  setLinks: (links: Record<string, unknown>, city?: string) => void;
  getData: (module: string, city: string) => Promise<Record<string, unknown>>;
};

export const useFooterStore = reuseAppStore(
  'footer',
  createWithEqualityFn<FooterState>(
    (set, get) => ({
      links: {},
      linksCity: '',
      linksLoadedAt: 0,

      setLinks: (links, city = '') => {
        if (!links || typeof links !== 'object' || Array.isArray(links)) {
          return;
        }

        set({
          links,
          linksCity: city || get().linksCity,
          linksLoadedAt: Date.now(),
        });
      },

      getData: async (thisModule, city) => {
        if (!city) {
          return get().links;
        }

        const { links, linksCity, linksLoadedAt } = get();
        const hasLinks = Boolean(
          links && typeof links === 'object' && Object.keys(links).length > 0
        );
        const now = Date.now();
        const requestKey = String(city);

        if (
          hasLinks &&
          linksCity === city &&
          now - Number(linksLoadedAt || 0) < FOOTER_CACHE_TTL_MS
        ) {
          return links;
        }

        if (footerInFlightPromise && footerInFlightKey === requestKey) {
          return footerInFlightPromise;
        }

        footerInFlightKey = requestKey;
        footerInFlightPromise = api(thisModule, {
          type: 'get_page_info',
          city_id: city,
          page: 'info',
        })
          .then((json) => {
            if (
              json?.st === false ||
              !json?.page ||
              typeof json.page !== 'object'
            ) {
              return get().links;
            }

            const page = json.page as Record<string, unknown>;
            set({
              links: page,
              linksCity: city,
              linksLoadedAt: Date.now(),
            });

            return page;
          })
          .finally(() => {
            if (footerInFlightKey === requestKey) {
              footerInFlightPromise = null;
              footerInFlightKey = '';
            }
          });

        return footerInFlightPromise;
      },
    }),
    shallow
  )
);
