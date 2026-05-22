'use client';

import { create } from 'zustand';
import { normalizeCategories } from './normalizeCategories';
import type { CatalogCategory, CatalogState } from './types';

export const useCatalogStore = create<CatalogState>((set) => ({
  categories: [],
  tags: [],
  allItems: [],
  seedFromPage: (cats, allItems, _citySlug, tags = []) => {
    const normalized = normalizeCategories(cats);
    set({
      categories: normalized,
      allItems: Array.isArray(allItems) ? allItems : [],
      tags: Array.isArray(tags) ? tags : [],
    });
  },
}));

export type { CatalogCategory };
