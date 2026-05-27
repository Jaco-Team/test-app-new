export type CartLineItem = {
  item_id?: number | string;
  count?: number | string;
  one_price?: number | string;
  all_price?: number | string;
  cat_id?: number | string;
  disabled?: boolean;
  [key: string]: unknown;
};

export type CartPersistedPayload = {
  items?: CartLineItem[];
  city?: { link?: string };
  updatedAt?: number;
  [key: string]: unknown;
};

export type CatalogProduct = {
  id?: number | string;
  price?: number | string;
  [key: string]: unknown;
};

export type CartState = {
  allItems: CatalogProduct[];
  freeItems: unknown[];
  needDops: unknown;
  items: CartLineItem[];
  itemsOffDops: CartLineItem[];
  dopListCart: CartLineItem[];
  itemsCount: number;
  allPrice: number;
  allPriceWithoutPromo: number | null;
  checkPromo: { st?: boolean } | null;
  setAllItems: (items: unknown[]) => void;
  setFreeItems: (items: unknown[]) => void;
  setNeedDops: (items: unknown) => void;
  changeAllItems: () => void;
  hydrateFromLocalStorage: () => void;
  plus: (itemId: number | string | undefined, catId?: number | string) => void;
  minus: (itemId: number | string | undefined) => void;
  setCount: (
    itemId: number | string | undefined,
    count: number,
    catId?: number | string
  ) => void;
  recomputeTotals: () => void;
};
