'use client';

import { useCabinetProfileData } from '@src/features/cabinet-access';

export function useAccountPage(citySlug: string, token: string) {
  const { userInfo, shortName, countPromo, countOrders } =
    useCabinetProfileData(citySlug, token);

  return {
    userInfo,
    shortName,
    countPromo,
    countOrders,
  };
}
