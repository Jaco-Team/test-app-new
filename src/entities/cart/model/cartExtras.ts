import type { CartLineItem, CatalogProduct } from './types';

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function catalogCatId(item: CatalogProduct | undefined): number {
  return toNumber((item as { cat_id?: unknown } | undefined)?.cat_id);
}

export type CartKind = 'rolls' | 'pizza' | 'all';

/** Синхронно с legacy `check_need_dops` / `cart_is` в `components/store.js`. */
export function getCartKind(
  items: CartLineItem[],
  allItems: CatalogProduct[]
): CartKind {
  let rolls = 0;
  let pizza = 0;

  for (const line of items) {
    const catalogItem = allItems.find(
      (item) => toNumber(item.id) === toNumber(line.item_id)
    );
    if (!catalogItem) {
      continue;
    }

    const catId = catalogCatId(catalogItem);
    const count = toNumber(line.count);

    if (catId === 14) {
      pizza += count;
      continue;
    }

    if (![5, 6, 7, 14].includes(catId)) {
      rolls += count;
    }
  }

  if (rolls > 0 && pizza === 0) {
    return 'rolls';
  }
  if (rolls === 0 && pizza > 0) {
    return 'pizza';
  }
  return 'all';
}

type NeedDopsPayload = {
  rolls?: CatalogProduct[];
  pizza?: CatalogProduct[];
};

/**
 * Строит `dopListCart` из needDops + позиций cat_id=7 в корзине.
 * Порт legacy `check_need_dops`.
 */
export function recomputeDopListCart(
  items: CartLineItem[],
  allItems: CatalogProduct[],
  needDops: unknown
): CartLineItem[] {
  if (!allItems.length) {
    return [];
  }

  const need = (needDops ?? {}) as NeedDopsPayload;
  const rollsList = need.rolls ?? [];
  const pizzaList = need.pizza ?? [];

  let countPizza = 0;
  let countRolls = 0;

  for (const line of items) {
    const catalogItem = allItems.find(
      (item) => toNumber(item.id) === toNumber(line.item_id)
    );
    if (!catalogItem) {
      continue;
    }

    const catId = catalogCatId(catalogItem);
    const count = toNumber(line.count);

    if (catId === 14) {
      countPizza += count;
    } else if (![5, 6, 7, 14].includes(catId)) {
      countRolls += count;
    }
  }

  let allNeedDops: CatalogProduct[] = [];

  if (countRolls > 0 && countPizza === 0) {
    allNeedDops = rollsList.slice();
  } else if (countRolls === 0 && countPizza > 0) {
    allNeedDops = pizzaList.slice();
  } else {
    allNeedDops = [...rollsList, ...pizzaList];
  }

  const dopsInCart: CatalogProduct[] = [];
  for (const line of items) {
    const catalogItem = allItems.find(
      (item) => toNumber(item.id) === toNumber(line.item_id)
    );
    if (catalogItem && catalogCatId(catalogItem) === 7) {
      dopsInCart.push(catalogItem);
    }
  }

  const extraDops = dopsInCart.filter(
    (dop) =>
      !allNeedDops.some((needDop) => toNumber(needDop.id) === toNumber(dop.id))
  );

  allNeedDops = [...allNeedDops, ...extraDops];

  return allNeedDops.map((catalogItem) => {
    const cartLine = items.find(
      (line) => toNumber(line.item_id) === toNumber(catalogItem.id)
    );
    const count = cartLine ? toNumber(cartLine.count) : 0;
    const onePrice = toNumber(catalogItem.price);

    return {
      item_id: catalogItem.id,
      count,
      one_price: onePrice,
      all_price: onePrice * count,
      cat_id: 7,
      name: (catalogItem as { name?: string }).name,
      img_app: (catalogItem as { img_app?: string }).img_app,
      price: catalogItem.price,
    };
  });
}
