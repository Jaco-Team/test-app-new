'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { useHeaderStore } from '@src/entities/header';
import { hitAll } from '@src/shared/lib/analytics/metrika';
import {
  getClientNetworkContext,
  installGlobalSentryHandlers,
  isCustomSentryMonitoringEnabled,
} from '@/utils/clientMonitoring';
import { RuntimeScripts } from './RuntimeScripts';

const HEADER_DESKTOP_BREAKPOINT_PX = 800;

export function ClientRuntime({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousUrlRef = useRef('');
  const setMatches = useHeaderStore((state) => state.setMatches);

  useEffect(() => {
    if (!isCustomSentryMonitoringEnabled()) {
      return undefined;
    }

    return installGlobalSentryHandlers(Sentry);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia(
      `(min-width: ${HEADER_DESKTOP_BREAKPOINT_PX}px)`
    );
    setMatches(media);

    const onChange = () => setMatches(media);
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, [setMatches]);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) {
      return undefined;
    }

    const nextUrl = new URL(pathname, window.location.origin).toString();
    const referer = previousUrlRef.current || document.referrer || undefined;

    const timer = window.setTimeout(() => {
      hitAll(nextUrl, {
        title: document.title,
        referer,
      });
    }, 0);

    previousUrlRef.current = nextUrl;

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    Sentry.setContext('connectivity', getClientNetworkContext());
  }, [pathname]);

  return (
    <>
      <RuntimeScripts />
      {children}
    </>
  );
}
