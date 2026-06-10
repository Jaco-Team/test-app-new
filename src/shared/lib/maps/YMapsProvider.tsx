'use client';

import type { ReactNode } from 'react';
import { YMaps } from '@pbe/react-yandex-maps';
import { YMAPS_QUERY } from './constants';

export type YMapsProviderProps = {
  children: ReactNode;
  /** When false, children render without the react-yandex-maps context. */
  enabled?: boolean;
};

/**
 * App-level Yandex Maps context. Pair with `RuntimeScripts loadYmaps` and
 * `waitForYMapsReady` / `withYMapsReady` for script readiness.
 *
 * Mount once in `ClientRuntime` so any feature (contacts, address picker, cart)
 * can render `<Map>` without nesting its own provider.
 */
export function YMapsProvider({
  children,
  enabled = true,
}: YMapsProviderProps) {
  if (!enabled) {
    return children;
  }

  return <YMaps query={YMAPS_QUERY}>{children}</YMaps>;
}

/** @deprecated Use `YMapsProvider` — kept for incremental migration. */
export const YMapsRoot = YMapsProvider;
