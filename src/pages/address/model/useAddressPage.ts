'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@src/entities/profile';
import { useAddressPickerStore } from '@src/features/address-picker';

const PROFILE_MODULE = 'profile';

export function useAddressPage(citySlug: string, token: string) {
  const streets = useProfileStore((state) => state.streets);
  const getUserInfo = useProfileStore((state) => state.getUserInfo);
  const openAddressPicker = useAddressPickerStore(
    (state) => state.openAddressPicker
  );
  const delAddr = useProfileStore((state) => state.delAddr);

  async function openModalAddr(id: number | string) {
    await openAddressPicker({
      citySlug,
      addressId: id,
      source: 'address',
    });
  }

  useEffect(() => {
    if (!token.length) {
      return;
    }

    void getUserInfo(PROFILE_MODULE, citySlug, token);
  }, [citySlug, getUserInfo, token]);

  return {
    streets,
    openModalAddr,
    delAddr,
  };
}
