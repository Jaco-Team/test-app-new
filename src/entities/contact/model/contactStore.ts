'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { api } from '@src/shared/api';
import { reusePreviewStore } from '@src/shared/store/hotStore';

/** Preview slice for contacts — expand when `/preview/[city]/contacts` ships. */
export type ContactState = {
  page: Record<string, unknown> | null;
  loadPage: (city: string) => Promise<Record<string, unknown> | null>;
};

export const useContactStore = reusePreviewStore(
  'preview-contact',
  createWithEqualityFn<ContactState>(
    (set) => ({
      page: null,
      loadPage: async (city) => {
        const json = await api('contacts', {
          type: 'get_page_info',
          city_id: city,
          page: '',
        });

        if (json?.st === false || !json?.page) {
          return null;
        }

        const page = json.page as Record<string, unknown>;
        set({ page });
        return page;
      },
    }),
    shallow
  )
);
