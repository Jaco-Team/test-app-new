import type { StoreApi, UseBoundStore } from 'zustand';

const hotStores =
  typeof globalThis !== 'undefined'
    ? ((
        globalThis as typeof globalThis & {
          __JACO_PREVIEW_STORES__?: Record<string, unknown>;
        }
      ).__JACO_PREVIEW_STORES__ =
        (
          globalThis as typeof globalThis & {
            __JACO_PREVIEW_STORES__?: Record<string, unknown>;
          }
        ).__JACO_PREVIEW_STORES__ || {})
    : null;

/** Dev HMR-safe store registry (same contract as legacy `reuseHotStore`). */
export function reusePreviewStore<T extends UseBoundStore<StoreApi<unknown>>>(
  key: string,
  store: T
): T {
  if (process.env.NODE_ENV === 'production' || !hotStores) {
    return store;
  }

  if (!hotStores[key]) {
    hotStores[key] = store;
  }

  return hotStores[key] as T;
}
