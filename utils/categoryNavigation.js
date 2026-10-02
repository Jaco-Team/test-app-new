export function categoryHref(city, link) {
  const citySlug = String(city ?? '').trim();
  const categorySlug = String(link ?? '').trim();

  if (!citySlug || !categorySlug) return '';

  return `/${encodeURIComponent(citySlug)}/menu/${encodeURIComponent(categorySlug)}`;
}

export function isCityHomePath(asPath, city) {
  try {
    const pathname = decodeURIComponent(
      String(asPath ?? '').split(/[?#]/, 1)[0]
    )
      .replace(/\/+$/, '')
      .toLowerCase();
    return (
      pathname ===
      `/${String(city ?? '')
        .trim()
        .toLowerCase()}`
    );
  } catch {
    return false;
  }
}

export function isPlainCategoryClick(event) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
