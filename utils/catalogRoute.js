import { normalizeCity } from './normalizeCity.js';

// Города действующего клиентского каталога. Технические пути не являются городами.
const CATALOG_CITIES = new Set(['samara', 'togliatti']);

export function catalogRoute(cityValue, categoryValue) {
  if (typeof cityValue !== 'string' || typeof categoryValue !== 'string') return null;
  const city = normalizeCity(cityValue);
  const category = categoryValue.trim().toLowerCase();
  if (!CATALOG_CITIES.has(city) || !/^[a-z0-9][a-z0-9_-]{0,190}$/.test(category)) {
    return null;
  }
  return { city, category };
}
