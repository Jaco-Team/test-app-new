import { useCityStore } from '@src/entities/city';

type YmFn = (counterId: number, method: string, ...args: unknown[]) => void;

function getYm(): YmFn | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const ym = (window as typeof window & { ym?: YmFn }).ym;
  return typeof ym === 'function' ? ym : undefined;
}

const MAIN_COUNTER_ID = 47085879;
const YM_READY_RETRY_DELAY_MS = 250;
const YM_READY_MAX_RETRIES = 40;

export function getCityCounterId(city?: string | null): number | null {
  if (!city) {
    return null;
  }

  const slug = String(city).toLowerCase();
  if (slug === 'samara') {
    return 100325084;
  }
  if (slug === 'togliatti') {
    return 100601350;
  }

  return null;
}

export function getActiveCounterIds(cityOverride?: string | null): number[] {
  const city = cityOverride ?? useCityStore.getState().slug;
  const ids = [MAIN_COUNTER_ID];
  const cityCounterId = getCityCounterId(city);

  if (cityCounterId && !ids.includes(cityCounterId)) {
    ids.push(cityCounterId);
  }

  return ids;
}

function runWhenYmReady(callback: () => void, attempt = 0): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  if (getYm()) {
    callback();
    return true;
  }

  if (attempt >= YM_READY_MAX_RETRIES) {
    return false;
  }

  window.setTimeout(() => {
    runWhenYmReady(callback, attempt + 1);
  }, YM_READY_RETRY_DELAY_MS);

  return false;
}

function normalizeUrl(url: string): string {
  if (typeof window === 'undefined') {
    return String(url || '/');
  }

  try {
    return new URL(
      url || window.location.href,
      window.location.origin
    ).toString();
  } catch {
    return window.location.href;
  }
}

export function hitAll(
  url: string,
  options: {
    title?: string;
    referer?: string;
    params?: Record<string, unknown>;
    city?: string;
  } = {}
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const hitUrl = normalizeUrl(url);
  const hitOptions: Record<string, unknown> = {
    title: options.title || document.title,
  };

  if (options.referer) {
    hitOptions.referer = options.referer;
  }

  if (options.params && typeof options.params === 'object') {
    hitOptions.params = options.params;
  }

  return runWhenYmReady(() => {
    const ym = getYm();
    if (!ym) {
      return;
    }

    getActiveCounterIds(options.city).forEach((counterId) => {
      ym(counterId, 'hit', hitUrl, hitOptions);
    });
  });
}

export function reachGoal(
  goal: string,
  params?: Record<string, unknown>,
  city?: string
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    runWhenYmReady(() => {
      const ym = getYm();
      if (!ym) {
        return;
      }

      getActiveCounterIds(city).forEach((counterId) => {
        ym(counterId, 'reachGoal', goal, params);
      });
    });
  } catch (error) {
    console.warn('YM reachGoal error:', error);
  }
}

export function trackHeaderClick(page: string, city?: string): void {
  reachGoal(`Клик в шапке ${page}`, undefined, city);
}

export function trackCategoryClick(categoryName: string, city?: string): void {
  reachGoal(`Категория ${categoryName}`, undefined, city);
}
