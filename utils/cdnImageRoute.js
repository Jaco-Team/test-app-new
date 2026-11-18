import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from './browserStorage';
import { trackUmami } from './umami';

const CDN_HOSTS = new Set(['mainimg.jacofood.ru', 'topimg.jacofood.ru']);
const COOLDOWN_MS = 5 * 60_000;
const routes = new Map();
const reportedReasons = new Set();

export function getCdnHostname(src) {
  try {
    const url = new URL(src);
    if (
      url.protocol === 'https:' && !url.port && !url.username && !url.password &&
      CDN_HOSTS.has(url.hostname)
    ) {
      return url.hostname;
    }
  } catch {
    // Локальные картинки и заглушки загружаются как обычно.
  }
  return null;
}

const storageKey = (host) => `jaco.image-cdn.until.${host}`;

function getRouteState(host) {
  let state = routes.get(host);
  if (!state) {
    const until = Number(getSessionStorageItem(storageKey(host)));
    state = {
      until: Number.isFinite(until) ? until : 0,
      probe: null,
      firstFailure: null,
    };
    routes.set(host, state);
  }
  return state;
}

function rememberFallback(host, state) {
  state.until = Date.now() + COOLDOWN_MS;
  state.probe = null;
  state.firstFailure = null;
  setSessionStorageItem(storageKey(host), String(state.until));
}

export function isCdnFallbackPreferred(host) {
  return CDN_HOSTS.has(host) && getRouteState(host).until > 0;
}

export function chooseCdnRoute(host, identity) {
  if (!isCdnFallbackPreferred(host)) return 'direct';
  const state = getRouteState(host);
  if (Date.now() < state.until || state.probe !== null) return 'fallback';
  // После истечения срока только одна видимая картинка проверяет CDN.
  state.probe = identity;
  return 'probe';
}

export function releaseCdnProbe(host, identity) {
  const state = routes.get(host);
  if (state && state.probe === identity) state.probe = null;
}

export function confirmCdnDirect(host, identity, route) {
  const state = routes.get(host);
  if (!state) return;
  if (route === 'probe' && state.probe === identity) {
    state.until = 0;
    state.probe = null;
    removeSessionStorageItem(storageKey(host));
  }
  if (!state.until) state.firstFailure = null;
}

export function confirmCdnFallback(host, identity, route) {
  if (!CDN_HOSTS.has(host) || (route !== 'direct' && route !== 'probe')) return;
  const state = getRouteState(host);
  if (route === 'probe' && state.probe === identity) {
    rememberFallback(host, state);
    return;
  }
  if (state.until) return;
  // Миниатюра, карточка и крупный вариант одного фото дают одно подтверждение.
  const photo = identity.split(/[?#]/, 1)[0].replace(/_\d+x\d+\.(?:jpe?g|webp|png)$/i, '');
  const previous = state.firstFailure;
  if (previous && previous.photo !== photo && Date.now() - previous.at < COOLDOWN_MS) {
    rememberFallback(host, state);
  } else {
    state.firstFailure = { photo, at: Date.now() };
  }
}

export function reportCdnFallback(host, reason) {
  // Доля затронутых визитов в Umami, без события на каждую карточку каталога.
  const key = `${host}/${reason}`;
  if (reportedReasons.has(key) || !window.umami?.track) return;
  reportedReasons.add(key);
  trackUmami('image_cdn_fallback', { host, reason });
}
