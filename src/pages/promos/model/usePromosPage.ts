'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@src/entities/profile';

const PROMOS_MODULE = 'promokody';

export function usePromosPage(citySlug: string, token: string) {
  const promoListActive = useProfileStore((state) => state.promoListActive);
  const getPromoList = useProfileStore((state) => state.getPromoList);

  useEffect(() => {
    if (!token.length) {
      return;
    }

    void getPromoList(PROMOS_MODULE, citySlug, token);
  }, [citySlug, getPromoList, token]);

  return {
    promoListActive,
  };
}
