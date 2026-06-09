'use client';

export type AddressPickerSource = 'cart' | 'profile' | 'address';

export type AddressPickerMode = 'create' | 'edit';

export type AddressPickerCityOption = {
  value: string;
  label: string;
  citySlug: string;
};

export type AddressPickerSuggestion = {
  name: string;
  title: string;
  full?: {
    address?: {
      component?: Array<{
        kind?: string[];
        name?: string;
      }>;
    };
    [key: string]: unknown;
  };
};

export type AddressPickerResolvedAddress = {
  id: string;
  street: string;
  home: string;
  district: string;
  cityName: string;
  addressLine: string;
  xy: [number, number] | null;
};

export type AddressPickerZone = {
  zone: [number, number][];
  center: [number, number] | null;
};

export type AddressPickerDraft = {
  name: string;
  pd: string;
  et: string;
  kv: string;
  comment: string;
  domophome: boolean;
  isMain: boolean;
};
