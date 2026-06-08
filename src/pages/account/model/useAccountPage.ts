'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@src/entities/profile';

const PROFILE_MODULE = 'profile';

export function useAccountPage(citySlug: string, token: string) {
  const userInfo = useProfileStore((state) => state.userInfo);
  const shortName = useProfileStore((state) => state.shortName);
  const countPromo = useProfileStore((state) => state.countPromo);
  const countOrders = useProfileStore((state) => state.countOrders);
  const getUserInfo = useProfileStore((state) => state.getUserInfo);

  useEffect(() => {
    if (!token.length) {
      return;
    }

    void getUserInfo(PROFILE_MODULE, citySlug, token);
  }, [citySlug, getUserInfo, token]);

  return {
    userInfo,
    shortName,
    countPromo,
    countOrders,
  };
}
