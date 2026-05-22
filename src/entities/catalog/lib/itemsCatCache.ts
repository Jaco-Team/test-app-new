import {
  getLocalStorageJson,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/browserStorage';

const ITEMS_CAT_LOCAL_CACHE_PREFIX = 'itemsCatCacheV2:';
const ITEMS_CAT_LOCAL_CACHE_TTL_MS = 1000 * 60 * 60 * 12;

export type ItemsCatCachePayload = {
  loadedAt: number;
  category: unknown[];
  items: unknown[];
};

function getItemsCatCacheKey(city = ''): string {
  const safeCity = String(city ?? '')
    .trim()
    .toLowerCase();
  return safeCity.length > 0
    ? `${ITEMS_CAT_LOCAL_CACHE_PREFIX}${safeCity}`
    : '';
}

export function readItemsCatCache(city = ''): ItemsCatCachePayload | null {
  const cacheKey = getItemsCatCacheKey(city);
  if (!cacheKey) {
    return null;
  }

  const payload = getLocalStorageJson(
    cacheKey,
    null
  ) as ItemsCatCachePayload | null;
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const loadedAt = Number(payload?.loadedAt || 0);
  if (!Number.isFinite(loadedAt) || loadedAt <= 0) {
    return null;
  }

  if (Date.now() - loadedAt > ITEMS_CAT_LOCAL_CACHE_TTL_MS) {
    removeLocalStorageItem(cacheKey);
    return null;
  }

  const category = Array.isArray(payload?.category) ? payload.category : [];
  const items = Array.isArray(payload?.items) ? payload.items : [];

  if (!category.length || !items.length) {
    return null;
  }

  return { category, items, loadedAt };
}

export function saveItemsCatCache(
  city = '',
  category: unknown[] = [],
  items: unknown[] = []
): boolean {
  const cacheKey = getItemsCatCacheKey(city);
  if (!cacheKey) {
    return false;
  }

  const safeCategory = Array.isArray(category) ? category : [];
  const safeItems = Array.isArray(items) ? items : [];

  if (!safeCategory.length || !safeItems.length) {
    return false;
  }

  return setLocalStorageItem(
    cacheKey,
    JSON.stringify({
      loadedAt: Date.now(),
      category: safeCategory,
      items: safeItems,
    })
  );
}

export function hasDetailedItemsPayload(items: unknown[] = []): boolean {
  const safeItems = Array.isArray(items) ? items : [];

  return safeItems.some((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    return (
      Object.prototype.hasOwnProperty.call(item, 'marc_desc') ||
      Object.prototype.hasOwnProperty.call(item, 'tmp_desc') ||
      Object.prototype.hasOwnProperty.call(item, 'count_part') ||
      Object.prototype.hasOwnProperty.call(item, 'count_part_new') ||
      Object.prototype.hasOwnProperty.call(item, 'weight') ||
      Object.prototype.hasOwnProperty.call(item, 'size_pizza')
    );
  });
}
