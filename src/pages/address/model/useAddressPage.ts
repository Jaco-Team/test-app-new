'use client';

import { useProfileStore } from '@src/entities/profile';
import { useAddressPickerStore } from '@src/features/address-picker';
import { useCabinetProfileData } from '@src/features/cabinet-access';

export function useAddressPage(citySlug: string, token: string) {
  const { streets } = useCabinetProfileData(citySlug, token);
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

  return {
    streets,
    openModalAddr,
    delAddr,
  };
}
