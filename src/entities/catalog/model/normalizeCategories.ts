import type { CatalogCategory } from './types';

/** Mirrors legacy `seedItemsCatFromPage` category normalization. */
export function normalizeCategories(cats: unknown[]): CatalogCategory[] {
  const safeCats = Array.isArray(cats) ? cats : [];

  return safeCats.map((raw) => {
    const cat = raw as CatalogCategory;
    const nestedCats = Array.isArray(cat?.cats) ? cat.cats : [];

    return {
      ...cat,
      cats: nestedCats.map((nested) => ({
        ...nested,
        cats: Array.isArray(nested?.cats) ? nested.cats : [],
        parent_id: nested?.parent_id ?? cat?.id ?? '0',
        main_link: nested?.main_link ?? cat?.main_link ?? cat?.link ?? '',
      })),
      parent_id: cat?.parent_id ?? '0',
      main_link: cat?.main_link ?? cat?.link ?? '',
    };
  });
}
