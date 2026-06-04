export function normalizeActionData(value: unknown): string {
  if (value === null || typeof value === 'undefined') {
    return '';
  }

  let rawValue = '';

  if (typeof value === 'string') {
    rawValue = value;
  } else {
    try {
      rawValue = JSON.stringify(value);
    } catch {
      rawValue = String(value);
    }
  }

  const normalized = rawValue.replace(/\s+/g, ' ').trim();

  if (normalized.length === 0) {
    return '';
  }

  if (/[<>"'{}\[\]\n\r\t]/.test(normalized)) {
    return `enc:${encodeURIComponent(normalized).slice(0, 472)}`;
  }

  return normalized.slice(0, 480);
}
