//'use_client'

import { useEffect, useRef } from 'react';
import * as Sentry from '@sentry/nextjs';

import { useContactStore } from '@/components/store.js';
import { getClientNetworkContext, waitForYMapsReady } from '@/utils/clientMonitoring';

export default function LoadMap({ city }) {
  const [getMap] = useContactStore(state => [state.getMap]);
  const requestedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    requestedRef.current = false;

    if (!city) {
      return undefined;
    }

    const loadMapData = async () => {
      const ready = await waitForYMapsReady();

      if (cancelled) {
        return;
      }

      if (!ready) {
        Sentry.captureMessage('Yandex Maps API did not become ready', {
          level: 'error',
          tags: {
            kind: 'ymaps_bootstrap_timeout',
            source: 'LoadMap',
          },
          extra: {
            city,
            pageUrl: typeof window !== 'undefined' ? window.location.href : null,
            ...getClientNetworkContext(),
          },
        });
        return;
      }

      if (!requestedRef.current) {
        requestedRef.current = true;
        getMap('contacts', city);
      }
    };

    loadMapData();

    return () => {
      cancelled = true;
    };
  }, [city, getMap]);

  return null;
}
