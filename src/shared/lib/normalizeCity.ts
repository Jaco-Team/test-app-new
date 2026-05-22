export function normalizeCity(
  value: string | string[] | undefined | null
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  const city = String(raw ?? '')
    .trim()
    .toLowerCase();

  if (!city || city === 'null' || city === 'undefined' || city === 'nan') {
    return '';
  }

  return city;
}
