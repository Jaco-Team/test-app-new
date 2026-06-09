import { waitForYMapsReady } from './yandexMaps';

export type GeocodedAddressParts = {
  street: string;
  home: string;
  district: string;
};

export function parseGeocodeComponents(
  components: Array<Record<string, unknown>> | undefined
): GeocodedAddressParts {
  const result: GeocodedAddressParts = {
    street: '',
    home: '',
    district: '',
  };

  components?.forEach((component) => {
    const kind = String(component.kind ?? '');
    const name = String(component.name ?? '').trim();

    if (!name.length) {
      return;
    }

    if (kind === 'house' || kind === 'premise') {
      result.home = name;
      return;
    }

    if (kind === 'street' || kind === 'thoroughfare') {
      result.street = name;
      return;
    }

    if (kind === 'district' || kind === 'area') {
      result.district = name;
      return;
    }

    if (!result.street.length && kind === 'locality') {
      result.street = name;
    }
  });

  return result;
}

export async function geocodeHouseAtCoords(
  coords: [number, number]
): Promise<GeocodedAddressParts | null> {
  const ready = await waitForYMapsReady(30, 200);
  if (!ready || typeof window === 'undefined') {
    return null;
  }

  const ymapsApi = (
    window as typeof window & {
      ymaps?: {
        geocode?: (
          request: [number, number],
          options?: Record<string, unknown>
        ) => Promise<{
          geoObjects: { get: (index: number) => unknown };
        }>;
      };
    }
  ).ymaps;

  if (!ymapsApi?.geocode) {
    return null;
  }

  const result = await ymapsApi.geocode(coords, {
    kind: 'house',
    results: 1,
  });
  const first = result.geoObjects.get(0) as
    | {
        properties?: {
          get?: (name: string, defaultValue?: unknown) => unknown;
        };
      }
    | undefined;
  const components = first?.properties?.get?.(
    'metaDataProperty.GeocoderMetaData.Address.Components'
  ) as Array<Record<string, unknown>> | undefined;

  return parseGeocodeComponents(components);
}
