// Self-hosted Umami (support-сервисы Chef). Трекер отдаётся с домена сайта
// (nginx /_e/ → stats.jacochef.ru) и подключается в pages/_document.js, когда
// в runtime задан UMAMI_WEBSITE_ID. Distinct id сессии — vid из proxy.js: по нему
// Chef (End_analytics, «Маркетинг») склеивает визиты Umami, visits и заказы.

export const UMAMI_PATH = '/_e';
export const UMAMI_BEFORE_SEND = '__jacoUmamiBeforeSend';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Поля событий, которые не уходят в аналитику ни под каким именем.
const PRIVATE_FIELDS = new Set([
  'phone',
  'number',
  'name',
  'email',
  'address',
  'street',
  'home',
  'kv',
  'token',
  'user_id',
  'comment',
  'text',
]);
const MAX_FIELDS = 20;
const MAX_STRING = 200;

// Выполняется до загрузки трекера и React; не должен иметь зависимостей.
function installUmamiBeforeSend(name) {
  var SENSITIVE = ['token', 'code', 'phone', 'number', 'email', 'sig'];
  var UUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  function strip(raw) {
    if (!raw) return raw;
    try {
      var url = new URL(raw, window.location.origin);
      for (var i = 0; i < SENSITIVE.length; i++) {
        url.searchParams.delete(SENSITIVE[i]);
      }
      // В feedback URL сегмент после типа формы — capability, а не аналитический путь.
      var feedback = url.pathname.match(/^\/feedback\/(stars|emoji)(?:\/|$)/i);
      if (feedback) {
        url.pathname = '/feedback/' + feedback[1].toLowerCase();
        url.search = '';
      }
      url.hash = '';
      return raw.charAt(0) === '/'
        ? url.pathname + url.search
        : url.toString();
    } catch {
      return '';
    }
  }

  function visitorId() {
    var value = '';
    try {
      var cookie = typeof document.cookie === 'string' ? document.cookie : '';
      var match = cookie.match(/(?:^|;\s*)vid=([^;]+)/);
      value = match ? decodeURIComponent(match[1]) : '';
    } catch {
      return '';
    }
    return UUID.test(value) ? value.toLowerCase() : '';
  }

  window[name] = function (type, payload) {
    var next = {};
    for (var key in payload) next[key] = payload[key];
    next.url = strip(payload.url);
    next.referrer = strip(payload.referrer);
    var vid = visitorId();
    if (vid) next.id = vid;
    return next;
  };
}

export const umamiBeforeSendScript = `(${installUmamiBeforeSend.toString()})(${JSON.stringify(UMAMI_BEFORE_SEND)});`;

function readCookie(name) {
  if (typeof document === 'undefined') return '';
  try {
    const cookie = typeof document.cookie === 'string' ? document.cookie : '';
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : '';
  } catch {
    return '';
  }
}

/** vid/sid визита для заказа: laravel-api-site пишет их в site_order_visits. */
export function getVisitIds() {
  const ids = {};
  for (const key of ['vid', 'sid']) {
    const value = readCookie(key);
    if (UUID_RE.test(value)) ids[key] = value.toLowerCase();
  }
  return ids;
}

export function umamiEventData(params) {
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return undefined;
  }
  const data = {};
  for (const [key, value] of Object.entries(params)) {
    if (Object.keys(data).length >= MAX_FIELDS) break;
    if (PRIVATE_FIELDS.has(key.toLowerCase())) continue;
    if (typeof value === 'number' && Number.isFinite(value)) data[key] = value;
    else if (typeof value === 'boolean') data[key] = value;
    else if (typeof value === 'string' && value !== '') {
      data[key] = value.slice(0, MAX_STRING);
    }
  }
  return Object.keys(data).length ? data : undefined;
}

/** Событие Umami; без трекера (не задан id, блокировщик) — ничего не делает. */
export function trackUmami(name, params) {
  if (typeof window === 'undefined' || !name) return;
  try {
    window.umami?.track(String(name).slice(0, 50), umamiEventData(params));
  } catch {
    // аналитика не должна ломать интерфейс
  }
}
