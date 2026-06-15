'use client';

import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useProfileStore } from '@src/entities/profile';

const PROFILE_MODULE = 'profile';

export function useCabinetProfileData(citySlug: string, token: string) {
  const { countOrders, countPromo, getUserInfo, shortName, streets, userInfo } =
    useProfileStore(
      (state) => ({
        userInfo: state.userInfo,
        streets: state.streets,
        shortName: state.shortName,
        countPromo: state.countPromo,
        countOrders: state.countOrders,
        getUserInfo: state.getUserInfo,
      }),
      shallow
    );

  useEffect(() => {
    if (!token.length) {
      return;
    }

    void getUserInfo(PROFILE_MODULE, citySlug, token);
  }, [citySlug, getUserInfo, token]);

  return {
    userInfo,
    streets,
    shortName,
    countPromo,
    countOrders,
  };
}
