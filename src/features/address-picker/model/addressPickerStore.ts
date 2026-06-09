'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { api, apiAddress } from '@src/shared/api';
import { geocodeHouseAtCoords } from '@src/shared/lib/maps/geocodeAddress';
import { resolveAddressPickerMapZoom } from '@src/shared/lib/maps/mapZoom';
import { reuseAppStore } from '@src/shared/store/hotStore';
import { useProfileStore } from '@src/entities/profile';
import type {
  AddressPickerCityOption,
  AddressPickerDraft,
  AddressPickerMode,
  AddressPickerResolvedAddress,
  AddressPickerSource,
  AddressPickerSuggestion,
  AddressPickerZone,
} from './types';

type OpenAddressPickerParams = {
  citySlug: string;
  addressId?: number | string;
  source: AddressPickerSource;
};

type AddressPickerState = {
  open: boolean;
  loading: boolean;
  submitting: boolean;
  mapResolving: boolean;
  errorText: string;
  successText: string;
  source: AddressPickerSource;
  mode: AddressPickerMode;
  citySlug: string;
  addressId: string;
  cityOptions: AddressPickerCityOption[];
  activeCityId: string;
  activeCityLabel: string;
  zones: AddressPickerZone[];
  mapCenter: [number, number] | null;
  mapPoint: [number, number] | null;
  mapZoom: number;
  query: string;
  suggestions: AddressPickerSuggestion[];
  selectedAddress: AddressPickerResolvedAddress | null;
  resolvedCandidates: AddressPickerResolvedAddress[];
  draft: AddressPickerDraft;
  openAddressPicker: (params: OpenAddressPickerParams) => Promise<void>;
  closeAddressPicker: () => void;
  setDraftField: <K extends keyof AddressPickerDraft>(
    field: K,
    value: AddressPickerDraft[K]
  ) => void;
  setQuery: (value: string) => void;
  fetchSuggestions: (value: string) => Promise<void>;
  selectSuggestion: (item: AddressPickerSuggestion) => Promise<void>;
  selectResolvedAddress: (item: AddressPickerResolvedAddress) => void;
  pickAddressFromMap: (coords: [number, number]) => Promise<void>;
  changeCity: (cityId: string) => Promise<void>;
  submit: (token: string) => Promise<boolean>;
  clearFeedback: () => void;
};

type AddressModalResponse = {
  this_info?: Record<string, unknown> | null;
  cities?: Array<Record<string, unknown>>;
  city?: number | string;
  city_center?: [number, number];
  zones?: Array<Record<string, unknown>>;
};

function normalizeCityOptions(
  items: Array<Record<string, unknown>> | undefined
): AddressPickerCityOption[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => ({
    value: String(item.id ?? ''),
    label: String(item.name ?? ''),
    citySlug: String(item.link ?? ''),
  }));
}

function normalizeResolvedAddress(
  value: Record<string, unknown> | null | undefined
): AddressPickerResolvedAddress | null {
  if (!value) {
    return null;
  }

  const xyRaw = Array.isArray(value.xy) ? value.xy : null;
  const xy =
    xyRaw && xyRaw.length >= 2
      ? ([Number(xyRaw[0]), Number(xyRaw[1])] as [number, number])
      : null;
  const street = String(value.street ?? value.name_street ?? '').trim();
  const home = String(value.home ?? '').trim();
  const district = String(value.city_name_dop ?? value.dop_name ?? '').trim();
  const cityName = String(value.city_name ?? '').trim();
  const addressLine = String(value.addressLine ?? '').trim();

  return {
    id: String(value.id ?? value.street_id ?? ''),
    street,
    home,
    district,
    cityName,
    addressLine,
    xy,
  };
}

function normalizeDraft(
  value: Record<string, unknown> | null | undefined
): AddressPickerDraft {
  return {
    name: String(value?.name ?? value?.addr_name ?? '').trim(),
    pd: String(value?.pd ?? '').trim(),
    et: String(value?.et ?? '').trim(),
    kv: String(value?.kv ?? '').trim(),
    comment: String(value?.comment ?? '').trim(),
    domophome: parseInt(String(value?.domophome ?? 1), 10) === 1,
    isMain: parseInt(String(value?.is_main ?? 0), 10) === 1,
  };
}

function normalizeStreetText(
  value: Record<string, unknown> | null | undefined
) {
  const current = String(value?.street ?? '').trim();
  if (!current.length) {
    return '';
  }

  const parts = current
    .split(', ')
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts[1] : current;
}

function buildAddressSummary(
  selectedAddress: AddressPickerResolvedAddress | null
): string {
  if (!selectedAddress) {
    return '';
  }

  const parts = [
    selectedAddress.district,
    selectedAddress.street,
    selectedAddress.home ? `д. ${selectedAddress.home}` : '',
  ].filter(Boolean);

  return parts.join(', ');
}

function normalizeZones(
  items: Array<Record<string, unknown>> | undefined
): AddressPickerZone[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const rawZone = Array.isArray(item.zone) ? item.zone : [];
      const zone = rawZone
        .map((point) =>
          Array.isArray(point) && point.length >= 2
            ? ([Number(point[0]), Number(point[1])] as [number, number])
            : null
        )
        .filter(Boolean) as [number, number][];
      const centerRaw =
        item.xy_center_map && typeof item.xy_center_map === 'object'
          ? (item.xy_center_map as Record<string, unknown>)
          : null;
      const latitude = Number(centerRaw?.latitude ?? NaN);
      const longitude = Number(centerRaw?.longitude ?? NaN);

      return {
        zone,
        center:
          Number.isFinite(latitude) && Number.isFinite(longitude)
            ? ([latitude, longitude] as [number, number])
            : null,
      };
    })
    .filter((item) => item.zone.length > 0);
}

function normalizeCityCenter(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length < 2) {
    return null;
  }

  const latitude = Number(value[0]);
  const longitude = Number(value[1]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return [latitude, longitude];
}

function resolveMapCenter(params: {
  selectedAddress: AddressPickerResolvedAddress | null;
  cityCenter: [number, number] | null;
  zones: AddressPickerZone[];
}): [number, number] | null {
  if (params.selectedAddress?.xy) {
    return params.selectedAddress.xy;
  }

  if (params.cityCenter) {
    return params.cityCenter;
  }

  return params.zones[0]?.center ?? null;
}

function resolveCitySlug(
  requestedCitySlug: string,
  cityId: string,
  options: AddressPickerCityOption[]
): string {
  const matched = options.find((item) => item.value === cityId);
  return matched?.citySlug || requestedCitySlug;
}

async function loadAddressModalData(
  citySlug: string,
  addressId: string
): Promise<{
  cityOptions: AddressPickerCityOption[];
  selectedAddress: AddressPickerResolvedAddress | null;
  draft: AddressPickerDraft;
  query: string;
  zones: AddressPickerZone[];
  mapCenter: [number, number] | null;
  mapPoint: [number, number] | null;
  activeCityId: string;
  activeCityLabel: string;
  nextCitySlug: string;
}> {
  const response = (await api('profile', {
    type: 'get_data_for_streets',
    city_id: citySlug,
    street_id: addressId,
  })) as AddressModalResponse;

  const info =
    response?.this_info && typeof response.this_info === 'object'
      ? { ...response.this_info }
      : null;

  if (info) {
    info.street = normalizeStreetText(info);
  }

  const cityOptions = normalizeCityOptions(response?.cities);
  const activeCityId = String(response?.city ?? info?.city_id ?? '');
  const activeCityLabel =
    cityOptions.find((item) => item.value === activeCityId)?.label ?? '';
  const nextCitySlug = resolveCitySlug(citySlug, activeCityId, cityOptions);
  const selectedAddress = normalizeResolvedAddress(info);
  const zones = normalizeZones(response?.zones);
  const mapCenter = resolveMapCenter({
    selectedAddress,
    cityCenter: normalizeCityCenter(response?.city_center),
    zones,
  });

  return {
    cityOptions,
    selectedAddress,
    draft: normalizeDraft(info),
    query: buildAddressSummary(selectedAddress),
    zones,
    mapCenter,
    mapPoint: selectedAddress?.xy ?? null,
    activeCityId,
    activeCityLabel,
    nextCitySlug,
  };
}

function parseSuggestionParts(item: AddressPickerSuggestion): {
  street: string;
  home: string;
  district: string;
} {
  const result = {
    street: '',
    home: '',
    district: '',
  };

  item.full?.address?.component?.forEach((component) => {
    if (
      component.kind?.[0] === 'STREET' ||
      component.kind?.[0] === 'LOCALITY'
    ) {
      result.street = String(component.name ?? '');
    }
    if (component.kind?.[0] === 'HOUSE') {
      result.home = String(component.name ?? '');
    }
    if (component.kind?.[0] === 'DISTRICT') {
      result.district = String(component.name ?? '');
    }
  });

  return result;
}

async function resolveStreetSelection(params: {
  activeCityId: string;
  street: string;
  home: string;
  district: string;
  mapPoint?: [number, number] | null;
}) {
  const response = (await api('profile', {
    type: 'check_street',
    city_id: params.activeCityId,
    street: [params.district, params.street].filter(Boolean).join(' '),
    pd: '',
    home: params.home,
  })) as { addrs?: unknown };

  const addrs = Array.isArray(response?.addrs)
    ? response.addrs
    : response?.addrs
      ? [response.addrs]
      : [];
  const resolvedCandidates = addrs
    .map((entry) => normalizeResolvedAddress(entry as Record<string, unknown>))
    .filter(Boolean) as AddressPickerResolvedAddress[];
  const selectedAddress =
    resolvedCandidates.length === 1 ? resolvedCandidates[0] : null;
  const query = [params.district, params.street, params.home]
    .filter(Boolean)
    .join(', ');
  const nextMapPoint = selectedAddress?.xy ?? params.mapPoint ?? null;

  return {
    resolvedCandidates,
    selectedAddress,
    query,
    mapCenter: nextMapPoint,
    mapPoint: nextMapPoint,
    mapZoom: resolveAddressPickerMapZoom(),
    errorText:
      resolvedCandidates.length === 0
        ? 'Адрес не найден. Уточните улицу и номер дома.'
        : '',
  };
}

export const useAddressPickerStore = reuseAppStore(
  'address-picker',
  createWithEqualityFn<AddressPickerState>(
    (set, get) => ({
      open: false,
      loading: false,
      submitting: false,
      mapResolving: false,
      errorText: '',
      successText: '',
      source: 'profile',
      mode: 'create',
      citySlug: '',
      addressId: '',
      cityOptions: [],
      activeCityId: '',
      activeCityLabel: '',
      zones: [],
      mapCenter: null,
      mapPoint: null,
      mapZoom: resolveAddressPickerMapZoom(),
      query: '',
      suggestions: [],
      selectedAddress: null,
      resolvedCandidates: [],
      draft: {
        name: '',
        pd: '',
        et: '',
        kv: '',
        comment: '',
        domophome: true,
        isMain: false,
      },

      openAddressPicker: async ({ citySlug, addressId = 0, source }) => {
        const nextAddressId = String(addressId ?? 0);
        set({
          open: true,
          loading: true,
          errorText: '',
          successText: '',
          source,
          mode: nextAddressId === '0' ? 'create' : 'edit',
          citySlug,
          addressId: nextAddressId,
          suggestions: [],
          resolvedCandidates: [],
          mapResolving: false,
        });

        const loaded = await loadAddressModalData(citySlug, nextAddressId);

        set({
          loading: false,
          citySlug: loaded.nextCitySlug,
          cityOptions: loaded.cityOptions,
          activeCityId: loaded.activeCityId,
          activeCityLabel: loaded.activeCityLabel,
          zones: loaded.zones,
          mapCenter: loaded.mapCenter,
          mapPoint: loaded.mapPoint,
          mapZoom: resolveAddressPickerMapZoom(),
          selectedAddress: loaded.selectedAddress,
          draft: loaded.draft,
          query: loaded.query,
        });
      },

      closeAddressPicker: () => {
        set({
          open: false,
          loading: false,
          submitting: false,
          mapResolving: false,
          errorText: '',
          successText: '',
          suggestions: [],
          resolvedCandidates: [],
          zones: [],
          mapCenter: null,
          mapPoint: null,
        });
      },

      setDraftField: (field, value) => {
        set((state) => ({
          draft: {
            ...state.draft,
            [field]: value,
          },
        }));
      },

      setQuery: (value) => {
        set({
          query: value,
          errorText: '',
        });
      },

      fetchSuggestions: async (value) => {
        const query = String(value ?? '').trim();
        set({ query });

        if (!query.length) {
          set({
            suggestions: [],
            selectedAddress: null,
            resolvedCandidates: [],
          });
          return;
        }

        const cityName = get().activeCityLabel;
        if (!cityName.length) {
          return;
        }

        const response = await apiAddress(cityName, query);
        const results = Array.isArray(response?.results)
          ? (response.results as Array<{
              title?: { text?: string };
              subtitle?: { text?: string };
              address?: {
                component?: Array<{
                  kind?: string[];
                  name?: string;
                }>;
              };
              [key: string]: unknown;
            }>)
          : [];

        set({
          suggestions: results.map((item) => ({
            name: String(item?.title?.text ?? ''),
            title: String(item?.subtitle?.text ?? ''),
            full: item,
          })),
        });
      },

      selectSuggestion: async (item) => {
        const parts = parseSuggestionParts(item);

        if (!parts.home.length) {
          set({
            errorText:
              'Нужно выбрать адрес с номером дома, например: 40 лет Победы, 55.',
          });
          return;
        }

        set({
          loading: true,
          errorText: '',
          query: [parts.district, parts.street, parts.home]
            .filter(Boolean)
            .join(', '),
          suggestions: [],
        });

        const resolved = await resolveStreetSelection({
          activeCityId: get().activeCityId,
          street: parts.street,
          home: parts.home,
          district: parts.district,
        });

        set({
          loading: false,
          resolvedCandidates: resolved.resolvedCandidates,
          selectedAddress: resolved.selectedAddress,
          errorText: resolved.errorText,
          query: resolved.query,
          mapCenter: resolved.mapCenter,
          mapPoint: resolved.mapPoint,
          mapZoom: resolved.mapZoom,
        });
      },

      selectResolvedAddress: (item) => {
        set({
          selectedAddress: item,
          resolvedCandidates: [],
          query: buildAddressSummary(item),
          errorText: '',
          mapCenter: item.xy,
          mapPoint: item.xy,
          mapZoom: resolveAddressPickerMapZoom(),
        });
      },

      pickAddressFromMap: async (coords) => {
        set({
          loading: true,
          mapResolving: true,
          errorText: '',
          suggestions: [],
          resolvedCandidates: [],
          mapCenter: coords,
          mapPoint: coords,
        });

        try {
          const parts = await geocodeHouseAtCoords(coords);

          if (!parts) {
            set({
              loading: false,
              mapResolving: false,
              errorText:
                'Карта временно недоступна. Попробуйте выбрать адрес строкой.',
            });
            return;
          }

          if (!parts.street.length || !parts.home.length) {
            set({
              loading: false,
              mapResolving: false,
              errorText:
                'На этой точке не удалось определить дом. Выберите дом точнее или воспользуйтесь строкой поиска.',
            });
            return;
          }

          const resolved = await resolveStreetSelection({
            activeCityId: get().activeCityId,
            street: parts.street,
            home: parts.home,
            district: parts.district,
            mapPoint: coords,
          });

          set({
            loading: false,
            mapResolving: false,
            resolvedCandidates: resolved.resolvedCandidates,
            selectedAddress: resolved.selectedAddress,
            errorText: resolved.errorText,
            query: resolved.query,
            mapCenter: resolved.mapCenter,
            mapPoint: resolved.mapPoint,
            mapZoom: resolved.mapZoom,
          });
        } catch {
          set({
            loading: false,
            mapResolving: false,
            errorText:
              'Не удалось определить адрес по точке на карте. Попробуйте еще раз.',
          });
        }
      },

      changeCity: async (cityId) => {
        const citySlug = resolveCitySlug(
          get().citySlug,
          cityId,
          get().cityOptions
        );

        set({
          loading: true,
          errorText: '',
          successText: '',
          activeCityId: cityId,
          query: '',
          suggestions: [],
          selectedAddress: null,
          resolvedCandidates: [],
          mapResolving: false,
        });

        const loaded = await loadAddressModalData(citySlug, '0');

        set((state) => ({
          loading: false,
          citySlug: loaded.nextCitySlug,
          cityOptions: loaded.cityOptions,
          activeCityId: loaded.activeCityId || cityId,
          activeCityLabel: loaded.activeCityLabel,
          zones: loaded.zones,
          mapCenter: loaded.mapCenter,
          mapPoint: null,
          selectedAddress: null,
          query: '',
          draft: {
            ...state.draft,
            pd: '',
            et: '',
            kv: '',
            comment: '',
          },
        }));
      },

      submit: async (token) => {
        if (!token.length) {
          set({ errorText: 'Нужна авторизация.' });
          return false;
        }

        if (!get().selectedAddress?.id.length) {
          set({ errorText: 'Сначала выберите улицу и номер дома.' });
          return false;
        }

        set({
          submitting: true,
          errorText: '',
          successText: '',
        });

        const draft = get().draft;
        const request =
          get().mode === 'edit'
            ? {
                type: 'update_addr',
                token,
                city_id: get().activeCityId,
                street: JSON.stringify({
                  street_id: get().selectedAddress?.id,
                }),
                pd: draft.pd,
                domophome: draft.domophome ? 1 : 0,
                et: draft.et,
                kv: draft.kv,
                id: get().addressId,
                comment: draft.comment,
                is_main: draft.isMain ? 1 : 0,
                nameAddr: draft.name,
              }
            : {
                type: 'save_new_addr',
                token,
                city_id: get().activeCityId,
                street: JSON.stringify({
                  id: get().selectedAddress?.id,
                }),
                pd: draft.pd,
                domophome: draft.domophome ? 1 : 0,
                et: draft.et,
                kv: draft.kv,
                comment: draft.comment,
                is_main: draft.isMain ? 1 : 0,
                nameAddr: draft.name,
              };

        const response = await api('profile', request);
        const success = response?.st === true;

        if (!success) {
          set({
            submitting: false,
            errorText: String(
              response?.text ??
                'Не удалось сохранить адрес. Попробуйте еще раз.'
            ),
          });
          return false;
        }

        await useProfileStore
          .getState()
          .getUserInfo('profile', get().citySlug, token);

        set({
          submitting: false,
          successText: 'Адрес сохранен.',
          open: false,
        });

        return true;
      },

      clearFeedback: () => {
        set({
          errorText: '',
          successText: '',
        });
      },
    }),
    shallow
  )
);
