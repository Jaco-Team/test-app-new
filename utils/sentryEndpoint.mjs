export const SENTRY_URL = 'https://sentry.jacochef.ru/';
export const SENTRY_ORG = 'sentry';
export const SENTRY_PROJECT = 'jacofood-web';
export const SENTRY_PROJECT_ID = '4';

export function isSiteSentryDsn(value) {
  if (typeof value !== 'string' || !value || value !== value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'sentry.jacochef.ru' &&
      !url.port && /^[a-f0-9]{32}$/.test(url.username) && !url.password &&
      url.pathname === `/${SENTRY_PROJECT_ID}` && !url.search && !url.hash;
  } catch {
    return false;
  }
}
