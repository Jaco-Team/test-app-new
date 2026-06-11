'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { cityBase } from '@src/shared/lib/sitePaths';
import { BREAKPOINTS } from '@src/shared/ui/foundation/breakpoints';

export function useCabinetAccess() {
  const router = useRouter();
  const citySlug = useCityStore((state) => state.slug);
  const compactMedia = useMediaQuery(
    `(max-width: ${BREAKPOINTS.compactMax}px)`,
    { noSsr: true }
  );
  const token = useHeaderStore((state) => state.token);
  const isAuth = useHeaderStore((state) => state.isAuth);
  const hydrateSession = useHeaderStore((state) => state.hydrateSession);
  const [sessionReady, setSessionReady] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setSessionReady(true);
  }, []);

  useEffect(() => {
    if (!sessionReady) {
      return;
    }

    let cancelled = false;

    void hydrateSession(citySlug).finally(() => {
      if (!cancelled) {
        setAuthReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [citySlug, hydrateSession, sessionReady]);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (isAuth !== 'auth' || !token.length) {
      router.replace(cityBase(citySlug));
    }
  }, [authReady, citySlug, isAuth, router, token]);

  return {
    citySlug,
    compact: sessionReady ? compactMedia : false,
    ready: sessionReady && authReady && isAuth === 'auth' && token.length > 0,
    token,
  };
}
