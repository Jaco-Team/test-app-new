'use client';

import { create } from 'zustand';
import type { CityRecord, CityState } from './types';

function resolveCityLabel(slug: string, list: CityRecord[]): string {
  const found = list.find((item) => String(item?.link ?? '') === slug);
  return found?.name ? String(found.name) : slug;
}

export const useCityStore = create<CityState>((set) => ({
  slug: '',
  labelRu: '',
  list: [],
  setCity: (slug, labelRu, list = []) => {
    const resolved =
      labelRu.trim().length > 0 ? labelRu : resolveCityLabel(slug, list);
    set({
      slug,
      labelRu: resolved,
      list,
    });
  },
}));
