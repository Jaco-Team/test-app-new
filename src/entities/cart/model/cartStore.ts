'use client';

import { create } from 'zustand';
import {
  getLocalStorageItem,
  getLocalStorageJson,
} from '@/utils/browserStorage';
import type {
  CartLineItem,
  CartPersistedPayload,
  CartState,
  CatalogProduct,
} from './types';

const CART_TTL_MS = 3 * 24 * 60 * 60 * 1000;

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function recomputeOffDops(items: CartLineItem[]): CartLineItem[] {
  return items.filter(
    (item) =>
      (toNumber(item.cat_id) !== 7 || Boolean(item.disabled)) &&
      item.cat_id !== undefined
  );
}

function sumCartLines(lines: CartLineItem[]): number {
  return lines.reduce(
    (sum, item) => sum + toNumber(item.count) * toNumber(item.one_price),
    0
  );
}

function countCartLines(lines: CartLineItem[]): number {
  return lines.reduce((sum, item) => sum + toNumber(item.count), 0);
}

export const useCartStore = create<CartState>((set, get) => ({
  allItems: [],
  freeItems: [],
  needDops: [],
  items: [],
  itemsOffDops: [],
  dopListCart: [],
  itemsCount: 0,
  allPrice: 0,
  allPriceWithoutPromo: null,
  checkPromo: null,

  setAllItems: (items) => {
    set({
      allItems: Array.isArray(items) ? (items as CatalogProduct[]) : [],
    });
  },

  setFreeItems: (items) => {
    set({ freeItems: Array.isArray(items) ? items : [] });
  },

  setNeedDops: (items) => {
    set({ needDops: Array.isArray(items) ? items : [] });
  },

  changeAllItems: () => {
    const allItems = get().allItems;
    const items = get().items.map((item) => {
      const catalogItem = allItems.find(
        (row) => toNumber(row.id) === toNumber(item.item_id)
      );
      if (!catalogItem) {
        return item;
      }
      const onePrice = toNumber(catalogItem.price);
      return {
        ...item,
        one_price: onePrice,
        all_price: onePrice * toNumber(item.count),
      };
    });

    set({ items });
    get().recomputeTotals();
  },

  recomputeTotals: () => {
    const { items, dopListCart, checkPromo } = get();
    const itemsOffDops = recomputeOffDops(items);
    const baseTotal = sumCartLines(itemsOffDops) + sumCartLines(dopListCart);
    const promoTotal =
      checkPromo?.st && itemsOffDops.length > 0
        ? toNumber(get().allPrice)
        : baseTotal;

    set({
      itemsOffDops,
      itemsCount: countCartLines(items),
      allPriceWithoutPromo: baseTotal,
      allPrice: promoTotal > 0 ? promoTotal : baseTotal,
    });
  },

  hydrateFromLocalStorage: () => {
    const allItems = get().allItems;
    if (!allItems.length) {
      return;
    }

    const raw = getLocalStorageItem('setCart');
    if (!raw) {
      get().recomputeTotals();
      return;
    }

    let cart: CartPersistedPayload | null = null;
    try {
      cart = JSON.parse(raw) as CartPersistedPayload;
    } catch {
      get().recomputeTotals();
      return;
    }

    const updatedAt = toNumber(cart?.updatedAt);
    const expired = !updatedAt || Date.now() - updatedAt > CART_TTL_MS;
    if (expired) {
      get().recomputeTotals();
      return;
    }

    const savedCity = getLocalStorageJson('setCity', null) as {
      link?: string;
    } | null;

    if (!savedCity?.link || savedCity.link !== cart?.city?.link) {
      get().recomputeTotals();
      return;
    }

    const hydrated = (cart?.items ?? []).reduce<CartLineItem[]>((acc, line) => {
      const catalogItem = allItems.find(
        (item) => toNumber(item.id) === toNumber(line.item_id)
      );
      if (!catalogItem) {
        return acc;
      }

      const onePrice = toNumber(catalogItem.price);
      const count = toNumber(line.count);
      acc.push({
        ...line,
        one_price: onePrice,
        all_price: onePrice * count,
        cat_id: (catalogItem as { cat_id?: number | string }).cat_id,
      });
      return acc;
    }, []);

    set({ items: hydrated });
    get().recomputeTotals();
  },
}));
