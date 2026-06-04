'use client';

import { create } from 'zustand';
import {
  getLocalStorageItem,
  getLocalStorageJson,
  setLocalStorageItem,
} from '@/utils/browserStorage';
import { getCartIntroKind, recomputeDopListCart } from './cartExtras';
import { countCartLines, sumCartSubtotal } from './cartTotals';
import { saveUserAction } from '@src/features/telemetry';
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

function catalogLine(
  catalogItem: CatalogProduct | undefined,
  itemId: number | string,
  count: number,
  fallbackCatId?: number | string
): CartLineItem {
  const onePrice = toNumber(catalogItem?.price);
  return {
    item_id: itemId,
    count,
    one_price: onePrice,
    all_price: onePrice * count,
    cat_id:
      (catalogItem as { cat_id?: number | string } | undefined)?.cat_id ??
      fallbackCatId,
    name: (catalogItem as { name?: string } | undefined)?.name,
    img_app: (catalogItem as { img_app?: string } | undefined)?.img_app,
    cat_name: (catalogItem as { cat_name?: string } | undefined)?.cat_name,
  };
}

function persistCart(items: CartLineItem[]): void {
  const savedCity = getLocalStorageJson('setCity', null) as {
    link?: string;
  } | null;
  setLocalStorageItem(
    'setCart',
    JSON.stringify({
      items,
      city: savedCity?.link ? { link: savedCity.link } : undefined,
      updatedAt: Date.now(),
    })
  );
}

export const useCartStore = create<CartState>((set, get) => ({
  allItems: [],
  freeItems: [],
  needDops: {},
  items: [],
  itemsOffDops: [],
  dopListCart: [],
  cartIntroKind: 'all',
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
    set({ needDops: items ?? {} });
    get().recomputeTotals();
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
    const { items, allItems, needDops, checkPromo } = get();
    const itemsOffDops = recomputeOffDops(items);
    const dopListCart = recomputeDopListCart(items, allItems, needDops);
    const cartIntroKind = getCartIntroKind(items, allItems);
    const baseTotal = sumCartSubtotal(itemsOffDops, dopListCart);
    const promoTotal =
      checkPromo?.st && itemsOffDops.length > 0
        ? toNumber(get().allPrice)
        : baseTotal;

    set({
      itemsOffDops,
      dopListCart,
      cartIntroKind,
      itemsCount: countCartLines(items),
      allPriceWithoutPromo: baseTotal,
      allPrice: promoTotal > 0 ? promoTotal : baseTotal,
    });
  },

  plus: (itemId, catId) => {
    if (
      itemId === undefined ||
      itemId === null ||
      String(itemId).length === 0
    ) {
      return;
    }

    const itemKey = String(itemId);
    const allItems = get().allItems;
    const catalogItem = allItems.find((item) => String(item.id) === itemKey);
    const items = get().items.slice();
    const index = items.findIndex((item) => String(item.item_id) === itemKey);

    let telemetryLine: CartLineItem | undefined;

    if (index >= 0) {
      const nextCount = toNumber(items[index].count) + 1;
      items[index] = catalogLine(
        catalogItem,
        items[index].item_id ?? itemId,
        nextCount,
        items[index].cat_id ?? catId
      );
      telemetryLine = items[index];
    } else {
      const line = catalogLine(catalogItem, itemId, 1, catId);
      items.push(line);
      telemetryLine = line;
    }

    set({ items });
    get().recomputeTotals();
    persistCart(get().items);

    if (telemetryLine) {
      void saveUserAction({
        event: 'plus_item',
        data: telemetryLine.name ?? '',
        price: toNumber(telemetryLine.one_price),
        itemId,
      });
    }
  },

  minus: (itemId) => {
    if (
      itemId === undefined ||
      itemId === null ||
      String(itemId).length === 0
    ) {
      return;
    }

    const itemKey = String(itemId);
    const allItems = get().allItems;
    let telemetryLine: CartLineItem | undefined;

    const items = get().items.reduce<CartLineItem[]>((acc, item) => {
      if (String(item.item_id) !== itemKey) {
        acc.push(item);
        return acc;
      }

      telemetryLine = item;
      const nextCount = toNumber(item.count) - 1;
      if (nextCount > 0) {
        const catalogItem = allItems.find((row) => String(row.id) === itemKey);
        acc.push(
          catalogLine(
            catalogItem,
            item.item_id ?? itemId,
            nextCount,
            item.cat_id
          )
        );
      }
      return acc;
    }, []);

    set({ items });
    get().recomputeTotals();
    persistCart(get().items);

    if (telemetryLine) {
      void saveUserAction({
        event: 'minus_item',
        data: telemetryLine.name ?? '',
        price: toNumber(telemetryLine.one_price),
        itemId,
      });
    }
  },

  setCount: (itemId, count, catId) => {
    if (
      itemId === undefined ||
      itemId === null ||
      String(itemId).length === 0
    ) {
      return;
    }

    const itemKey = String(itemId);
    const nextCount = Math.max(0, Math.floor(toNumber(count)));
    const allItems = get().allItems;
    const catalogItem = allItems.find((item) => String(item.id) === itemKey);
    const previousLine = get().items.find(
      (item) => String(item.item_id) === itemKey
    );
    const previousCount = previousLine ? toNumber(previousLine.count) : 0;
    const withoutItem = get().items.filter(
      (item) => String(item.item_id) !== itemKey
    );
    const nextLine =
      nextCount > 0
        ? catalogLine(catalogItem, itemId, nextCount, catId)
        : undefined;
    const items = nextLine ? [...withoutItem, nextLine] : withoutItem;

    set({ items });
    get().recomputeTotals();
    persistCart(get().items);

    if (nextCount === previousCount) {
      return;
    }

    const actionLine =
      nextLine ??
      previousLine ??
      catalogLine(catalogItem, itemId, nextCount, catId);
    const event = nextCount > previousCount ? 'plus_item' : 'minus_item';

    void saveUserAction({
      event,
      data: actionLine.name ?? '',
      price: toNumber(actionLine.one_price),
      itemId,
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
