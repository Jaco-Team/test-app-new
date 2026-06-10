'use client';

import { useEffect, useRef } from 'react';
import * as Sentry from '@sentry/nextjs';
import { getClientNetworkContext } from '@/utils/clientMonitoring';
import { waitForYMapsReady } from '@src/shared/lib/maps';
import { useContactStore } from './contactStore';

export type UseContactMapBootstrapOptions = {
  city: string;
  module?: string;
  enabled?: boolean;
};

/**
 * Waits for the global Yandex Maps script and loads contact zone data into
 * `useContactStore` once per mount. Used by contacts page and cart checkout map.
 */
export function useContactMapBootstrap({
  city,
  module = 'contacts',
  enabled = true,
}: UseContactMapBootstrapOptions): void {
  const getMap = useContactStore((state) => state.getMap);
  const requestedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    requestedRef.current = false;

    if (!enabled || !city) {
      return undefined;
    }

    const load = async () => {
      const ready = await waitForYMapsReady();
      if (cancelled) {
        return;
      }

      if (!ready) {
        Sentry.captureMessage('Yandex Maps API did not become ready', {
          level: 'error',
          tags: {
            kind: 'ymaps_bootstrap_timeout',
            source: 'useContactMapBootstrap',
          },
          extra: {
            city,
            module,
            pageUrl:
              typeof window !== 'undefined' ? window.location.href : null,
            ...getClientNetworkContext(),
          },
        });
        return;
      }

      if (!requestedRef.current) {
        requestedRef.current = true;
        await getMap(module, city);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [city, enabled, getMap, module]);
}
