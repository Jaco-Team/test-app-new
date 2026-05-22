import { captureMapStateIssue } from '../monitoring/sentryAccount';

export function withYMapsReady(
  callback: () => void,
  extra: Record<string, unknown> = {}
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const ymapsApi = (
    window as typeof window & {
      ymaps?: { ready?: (cb: () => void) => void };
    }
  ).ymaps;

  if (!ymapsApi || typeof ymapsApi.ready !== 'function') {
    captureMapStateIssue('Yandex Maps API is unavailable', extra);
    return false;
  }

  ymapsApi.ready(callback);
  return true;
}

export function waitForYMapsReady(
  maxAttempts = 15,
  delayMs = 150
): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    let attempt = 0;

    const tryReady = () => {
      const ok = withYMapsReady(() => resolve(true), { attempt });
      if (ok) {
        return;
      }

      attempt += 1;
      if (attempt >= maxAttempts) {
        resolve(false);
        return;
      }

      window.setTimeout(tryReady, delayMs);
    };

    tryReady();
  });
}
