'use client';

import { cityPath } from '@src/shared/lib/sitePaths';

const ADDRESS_PICKER_INTENT_KEY = 'preview-address-picker:intent';

export type AddressPickerSource = 'cart';

export type AddressPickerIntent = {
  source: AddressPickerSource;
  citySlug: string;
  returnTo: string;
  createdAt: string;
};

function canUseSessionStorage(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.sessionStorage !== 'undefined'
  );
}

export function saveAddressPickerIntent(intent: AddressPickerIntent): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(
    ADDRESS_PICKER_INTENT_KEY,
    JSON.stringify(intent)
  );
}

export function readAddressPickerIntent(): AddressPickerIntent | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(ADDRESS_PICKER_INTENT_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AddressPickerIntent;
  } catch {
    return null;
  }
}

export function clearAddressPickerIntent(): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(ADDRESS_PICKER_INTENT_KEY);
}

export function buildProfileAddressPickerHref(citySlug: string): string {
  return `${cityPath(citySlug, 'profile')}?openAddressModal=1`;
}
