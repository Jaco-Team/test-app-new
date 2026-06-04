/** Parallel App Router mount; legacy core stays on `/{city}`. */
export const APP_ROUTE_PREFIX = '/preview';

export function legacyCityBase(citySlug: string): string {
  const slug = String(citySlug ?? '').trim();
  return `/${slug}`;
}

export function cityBase(citySlug: string): string {
  const slug = String(citySlug ?? '').trim();
  return `${APP_ROUTE_PREFIX}/${slug}`;
}

export function legacyCityPath(citySlug: string, segment = ''): string {
  const base = legacyCityBase(citySlug);
  const path = String(segment ?? '')
    .trim()
    .replace(/^\//, '');
  return path ? `${base}/${path}` : base;
}

export function cityPath(citySlug: string, segment = ''): string {
  const base = cityBase(citySlug);
  const path = String(segment ?? '')
    .trim()
    .replace(/^\//, '');
  return path ? `${base}/${path}` : base;
}

export function categoryHref(citySlug: string, categoryLink = ''): string {
  const base = cityBase(citySlug);
  const link = String(categoryLink ?? '').trim();

  if (link.length > 0) {
    return `${base}?category=${encodeURIComponent(link)}`;
  }

  return base;
}
