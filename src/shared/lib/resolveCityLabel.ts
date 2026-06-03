import type { CityRecord } from '@src/entities/city';

export function resolveCityLabel(
  citySlug: string,
  cities: readonly unknown[]
): string {
  const found = cities.find(
    (item) =>
      item &&
      typeof item === 'object' &&
      String((item as CityRecord).link ?? '') === citySlug
  ) as CityRecord | undefined;

  return found?.name ? String(found.name) : citySlug;
}
