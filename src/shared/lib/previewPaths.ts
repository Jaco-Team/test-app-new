export const PREVIEW_ROUTE_PREFIX = '/preview';

export function previewCityBase(citySlug: string): string {
  const slug = String(citySlug ?? '').trim();
  return `${PREVIEW_ROUTE_PREFIX}/${slug}`;
}

export function previewCityPath(citySlug: string, segment = ''): string {
  const base = previewCityBase(citySlug);
  const path = String(segment ?? '')
    .trim()
    .replace(/^\//, '');
  return path ? `${base}/${path}` : base;
}

/** Same contract as legacy `buildCategoryHref`, under `/preview/{city}`. */
export function previewCategoryHref(
  citySlug: string,
  categoryLink = ''
): string {
  const base = previewCityBase(citySlug);
  const link = String(categoryLink ?? '').trim();

  if (link.length > 0) {
    return `${base}?category=${encodeURIComponent(link)}`;
  }

  return base;
}
