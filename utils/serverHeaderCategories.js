import { api } from '@/components/api.js';

const CACHE_MS = 60_000;
const cache = new Map();

export async function loadHeaderCategories(city, fallback = []) {
  if (!city) return fallback;

  const cached = cache.get(city);
  if (cached && cached.expiresAt > Date.now()) {
    return (await cached.promise) || fallback;
  }

  const promise = api('home', {
    type: 'get_items_cat',
    city_id: city,
  })
    .then((response) =>
      Array.isArray(response?.main_cat) && response.main_cat.length > 0
        ? response.main_cat
        : null
    )
    .catch(() => null);

  cache.set(city, { promise, expiresAt: Date.now() + CACHE_MS });
  const categories = await promise;

  if (!categories) cache.delete(city);
  return categories || fallback;
}
