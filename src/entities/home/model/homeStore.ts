'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { normalizeCategories } from '@src/entities/catalog/model/normalizeCategories';
import type { CatalogCategory } from '@src/entities/catalog/model/types';
import {
  hasDetailedItemsPayload,
  readItemsCatCache,
  saveItemsCatCache,
} from '@src/entities/catalog/lib/itemsCatCache';
import { api } from '@src/shared/api';
import { reuseAppStore } from '@src/shared/store/hotStore';
import { getLocalStorageItem } from '@/utils/browserStorage';

const BANNERS_CACHE_TTL_MS = 10000;
const ITEMS_CAT_CACHE_TTL_MS = 15000;

let bannersInFlightPromise: Promise<unknown[]> | null = null;
let bannersInFlightKey = '';
let itemsCatInFlightPromise: Promise<{
  category: CatalogCategory[];
  items: unknown[];
}> | null = null;
let itemsCatInFlightKey = '';

export type HomeState = {
  bannerList: unknown[];
  bannersCity: string;
  bannersToken: string;
  bannersLoadedAt: number;
  categories: CatalogCategory[];
  catalogItems: unknown[];
  itemsCatCity: string;
  itemsCatLoadedAt: number;
  itemsCatSource: string;
  allTags: unknown[];
  seedFromPage: (
    cats: unknown[],
    allItems: unknown[],
    city: string,
    tags?: unknown[]
  ) => void;
  setAllTags: (tags: unknown[]) => void;
  getBanners: (module: string, city: string) => Promise<unknown[]>;
  getItemsCat: (
    module: string,
    city: string
  ) => Promise<{ category: CatalogCategory[]; items: unknown[] }>;
};

export const useHomeStore = reuseAppStore(
  'home',
  createWithEqualityFn<HomeState>(
    (set, get) => ({
      bannerList: [],
      bannersCity: '',
      bannersToken: '',
      bannersLoadedAt: 0,
      categories: [],
      catalogItems: [],
      itemsCatCity: '',
      itemsCatLoadedAt: 0,
      itemsCatSource: 'none',
      allTags: [],

      setAllTags: (tags) => {
        set({ allTags: Array.isArray(tags) ? tags : [] });
      },

      seedFromPage: (cats, allItems) => {
        const normalized = normalizeCategories(cats);
        const hasDetailedItems = hasDetailedItemsPayload(allItems);

        if (normalized.length > 0) {
          set({
            categories: hasDetailedItems
              ? normalized
              : normalized.length > 0
                ? normalized
                : get().categories,
          });
        }
      },

      getBanners: async (thisModule, city) => {
        if (!city) {
          return get().bannerList;
        }

        let token = '';
        if (typeof window !== 'undefined') {
          token = getLocalStorageItem('token') || '';
        }

        const requestKey = `${city}|${token}`;
        const now = Date.now();
        const { bannerList, bannersCity, bannersToken, bannersLoadedAt } =
          get();

        if (
          bannersCity === city &&
          bannersToken === token &&
          Array.isArray(bannerList) &&
          bannerList.length > 0 &&
          now - Number(bannersLoadedAt || 0) < BANNERS_CACHE_TTL_MS
        ) {
          return bannerList;
        }

        if (bannersInFlightPromise && bannersInFlightKey === requestKey) {
          return bannersInFlightPromise;
        }

        bannersInFlightKey = requestKey;
        bannersInFlightPromise = api(thisModule, {
          type: 'get_banners',
          city_id: city,
          token,
        })
          .then((json) => {
            if (json?.st === false && !Array.isArray(json?.banners)) {
              return get().bannerList;
            }

            const nextBannerList = Array.isArray(json?.banners)
              ? json.banners.filter(
                  (item: { is_active_home?: string | number }) =>
                    parseInt(String(item?.is_active_home ?? 0), 10) === 1
                )
              : [];

            set({
              bannerList: nextBannerList,
              bannersCity: city,
              bannersToken: token,
              bannersLoadedAt: Date.now(),
            });

            return nextBannerList;
          })
          .finally(() => {
            if (bannersInFlightKey === requestKey) {
              bannersInFlightPromise = null;
              bannersInFlightKey = '';
            }
          });

        return bannersInFlightPromise;
      },

      getItemsCat: async (thisModule, city) => {
        if (!city) {
          return { category: get().categories, items: get().catalogItems };
        }

        const now = Date.now();
        const requestKey = String(city);
        const storageCache = readItemsCatCache(city);
        const stateBeforeCache = get();

        if (
          storageCache &&
          (stateBeforeCache.itemsCatCity !== city ||
            !Array.isArray(stateBeforeCache.catalogItems) ||
            stateBeforeCache.catalogItems.length === 0)
        ) {
          set({
            catalogItems: storageCache.items,
            categories: storageCache.category as CatalogCategory[],
            itemsCatCity: city,
            itemsCatLoadedAt: storageCache.loadedAt,
            itemsCatSource: 'cache',
          });
        }

        const {
          catalogItems,
          categories,
          itemsCatCity,
          itemsCatLoadedAt,
          itemsCatSource,
        } = get();

        if (
          itemsCatSource === 'api' &&
          itemsCatCity === city &&
          Array.isArray(catalogItems) &&
          catalogItems.length > 0 &&
          now - Number(itemsCatLoadedAt || 0) < ITEMS_CAT_CACHE_TTL_MS
        ) {
          return { category: categories, items: catalogItems };
        }

        if (itemsCatInFlightPromise && itemsCatInFlightKey === requestKey) {
          return itemsCatInFlightPromise;
        }

        itemsCatInFlightKey = requestKey;
        itemsCatInFlightPromise = api(thisModule, {
          type: 'get_items_cat',
          city_id: city,
        })
          .then((json) => {
            if (
              json?.st === false ||
              !Array.isArray(json?.items) ||
              !Array.isArray(json?.main_cat)
            ) {
              const fallback = get();
              if (fallback.catalogItems.length > 0) {
                return {
                  category: fallback.categories,
                  items: fallback.catalogItems,
                };
              }

              const storageFallback = readItemsCatCache(city);
              if (storageFallback) {
                set({
                  catalogItems: storageFallback.items,
                  categories: storageFallback.category as CatalogCategory[],
                  itemsCatCity: city,
                  itemsCatLoadedAt: storageFallback.loadedAt,
                  itemsCatSource: 'cache',
                });
              }

              return {
                category: get().categories,
                items: get().catalogItems,
              };
            }

            set({
              catalogItems: json.items,
              categories: json.main_cat as CatalogCategory[],
              itemsCatCity: city,
              itemsCatLoadedAt: Date.now(),
              itemsCatSource: 'api',
            });

            saveItemsCatCache(city, json.main_cat, json.items);

            return {
              category: json.main_cat as CatalogCategory[],
              items: json.items as unknown[],
            };
          })
          .finally(() => {
            if (itemsCatInFlightKey === requestKey) {
              itemsCatInFlightPromise = null;
              itemsCatInFlightKey = '';
            }
          });

        return itemsCatInFlightPromise;
      },
    }),
    shallow
  )
);
