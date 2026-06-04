import type { CartLineItem, CatalogProduct } from './types';

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function catalogCatId(item: CatalogProduct | undefined): number {
  return toNumber((item as { cat_id?: unknown } | undefined)?.cat_id);
}

/** Legacy `getItems` → `cart_is` (только эти категории = «роллы» для текста). */
const ROLLY_INTRO_CAT_IDS = new Set([4, 9, 10, 12, 13]);
const PIZZA_CAT_ID = 14;

/** Legacy `check_need_dops` — не считаем доп. категории и пиццу в «rolls». */
const DOP_ROLL_EXCLUDED_CAT_IDS = new Set([5, 6, 7, PIZZA_CAT_ID]);

export type CartIntroKind = 'rolly' | 'pizza' | 'all';

export const CART_EXTRAS_INTRO: Record<CartIntroKind, string> = {
  rolly: 'Не забудьте про соусы, приправы и приборы',
  pizza: 'Попробуйте необычное сочетание пиццы и соуса',
  all: 'Не забудьте про соусы, приправы и приборы',
};

export function getCartExtrasIntroText(kind: CartIntroKind): string {
  return CART_EXTRAS_INTRO[kind];
}

type NeedDopsPayload = {
  rolls?: CatalogProduct[];
  pizza?: CatalogProduct[];
};

function resolveCatalogLine(
  line: CartLineItem,
  allItems: CatalogProduct[]
): CatalogProduct | undefined {
  return allItems.find((item) => toNumber(item.id) === toNumber(line.item_id));
}

/**
 * Подпись блока допов — legacy `getItems` / `cart_is` (по наличию категорий, не по qty).
 */
export function getCartIntroKind(
  items: CartLineItem[],
  allItems: CatalogProduct[]
): CartIntroKind {
  let hasRolly = false;
  let hasPizza = false;

  for (const line of items) {
    const catalogItem = resolveCatalogLine(line, allItems);
    if (!catalogItem) {
      continue;
    }

    const catId = catalogCatId(catalogItem);
    if (catId === PIZZA_CAT_ID) {
      hasPizza = true;
    }
    if (ROLLY_INTRO_CAT_IDS.has(catId)) {
      hasRolly = true;
    }
  }

  if (hasRolly && !hasPizza) {
    return 'rolly';
  }
  if (!hasRolly && hasPizza) {
    return 'pizza';
  }
  return 'all';
}

function countDopPizza(
  items: CartLineItem[],
  allItems: CatalogProduct[]
): number {
  let total = 0;

  for (const line of items) {
    const catalogItem = resolveCatalogLine(line, allItems);
    if (!catalogItem || catalogCatId(catalogItem) !== PIZZA_CAT_ID) {
      continue;
    }
    total += toNumber(line.count);
  }

  return total;
}

function countDopRolls(
  items: CartLineItem[],
  allItems: CatalogProduct[]
): number {
  let total = 0;

  for (const line of items) {
    const catalogItem = resolveCatalogLine(line, allItems);
    if (!catalogItem) {
      continue;
    }

    const catId = catalogCatId(catalogItem);
    if (catId === PIZZA_CAT_ID || DOP_ROLL_EXCLUDED_CAT_IDS.has(catId)) {
      continue;
    }
    total += toNumber(line.count);
  }

  return total;
}

function selectNeedDopsCatalog(
  need: NeedDopsPayload,
  countRolls: number,
  countPizza: number
): CatalogProduct[] {
  const rollsList = need.rolls ?? [];
  const pizzaList = need.pizza ?? [];

  if (countRolls > 0 && countPizza === 0) {
    return rollsList.slice();
  }
  if (countRolls === 0 && countPizza > 0) {
    return pizzaList.slice();
  }
  return [...rollsList, ...pizzaList];
}

/**
 * Список допов в корзине — legacy `check_need_dops`.
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
  const countPizza = countDopPizza(items, allItems);
  const countRolls = countDopRolls(items, allItems);
  let allNeedDops = selectNeedDopsCatalog(need, countRolls, countPizza);

  const dopsInCart: CatalogProduct[] = [];
  for (const line of items) {
    const catalogItem = resolveCatalogLine(line, allItems);
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
