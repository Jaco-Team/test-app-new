'use client';

import { create } from 'zustand';
import type { CityState } from './types';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';

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
