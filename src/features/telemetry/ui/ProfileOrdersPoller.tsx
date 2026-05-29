'use client';

import { useEffect } from 'react';
import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { useProfileStore } from '@src/entities/profile';

const POLL_INTERVAL_MS = 30_000;

export function ProfileOrdersPoller() {
  const city = useCityStore((state) => state.slug);
  const isAuth = useHeaderStore((state) => state.isAuth);
  const token = useHeaderStore((state) => state.token);

  useEffect(() => {
    if (typeof window === 'undefined' || isAuth !== 'auth' || !city || !token) {
      return undefined;
    }

    const refreshCounts = () => {
      void useProfileStore.getState().getCountPromosOrders(city, token);
    };

    refreshCounts();

    const intervalId = window.setInterval(refreshCounts, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [city, isAuth, token]);

  return null;
}
