'use client';

import { useEffect } from 'react';
import { useHeaderStore } from '@src/entities/header';
import {
  startZakazyCountPolling,
  stopZakazyCountPolling,
} from '../model/zakazyCountPolling';

/**
 * Global `zakazy` count polling (legacy: navBarPC / navBarMobile, 30s interval).
 */
export function ProfileOrdersPoller() {
  const isAuth = useHeaderStore((state) => state.isAuth);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (isAuth !== 'auth') {
      stopZakazyCountPolling();
      return undefined;
    }

    startZakazyCountPolling();

    return () => stopZakazyCountPolling();
  }, [isAuth]);

  return null;
}
