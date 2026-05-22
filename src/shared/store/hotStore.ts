import type { StoreApi, UseBoundStore } from 'zustand';

const hotStores =
  typeof globalThis !== 'undefined'
    ? ((
        globalThis as typeof globalThis & {
          __JACO_APP_STORES__?: Record<string, unknown>;
        }
      ).__JACO_APP_STORES__ =
        (
          globalThis as typeof globalThis & {
            __JACO_APP_STORES__?: Record<string, unknown>;
          }
        ).__JACO_APP_STORES__ || {})
    : null;

/** Dev HMR-safe store registry. */
export function reuseAppStore<T extends UseBoundStore<StoreApi<unknown>>>(
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
