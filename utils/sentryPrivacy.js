export const SENTRY_DATA_COLLECTION = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
};

export function cleanMonitoringUrl(value) {
  if (typeof value !== 'string') return value;
  return value.split(/[?#]/, 1)[0];
}

// URL встречаются и внутри сообщений Next.js, а не только в request.url.
export function cleanMonitoringText(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/(?:https?:\/\/|\/)[^\s"'<>`]+/g, cleanMonitoringUrl);
}

const PRIVATE_DIAGNOSTIC_KEY = /^(?:password|passwd|token|access_token|refresh_token|authorization|cookie|cookies|headers|body|data|request_body|response_body|phone|number|email|sms_code|code_sms|query_string|query)$/i;
const URL_DIAGNOSTIC_KEY = /(?:url|uri|referrer|referer|failedRoute|http\.target|http\.route|path|pathname|from|to)$/i;

function cleanDiagnosticData(value, key = '', depth = 0, ancestors = new Set()) {
  if (typeof value === 'string') {
    return URL_DIAGNOSTIC_KEY.test(key) ? cleanMonitoringUrl(value) : cleanMonitoringText(value);
  }
  if (value === null || typeof value !== 'object') return value;
  if (depth >= 8 || ancestors.has(value)) return '[omitted]';
  const nextAncestors = new Set(ancestors).add(value);
  if (Array.isArray(value)) return value.map(item => cleanDiagnosticData(item, key, depth + 1, nextAncestors));
  const result = {};
  for (const [childKey, child] of Object.entries(value)) {
    if (!PRIVATE_DIAGNOSTIC_KEY.test(childKey)) result[childKey] = cleanDiagnosticData(child, childKey, depth + 1, nextAncestors);
  }
  return result;
}

// SDK 11 вызывает этот callback и для корневого streamed span.
export function sanitizeSentrySpan(span) {
  for (const key of ['name', 'description']) {
    if (key in span) span[key] = cleanMonitoringText(span[key]);
  }
  if (span.attributes) span.attributes = cleanDiagnosticData(span.attributes);
  if (span.data) span.data = cleanDiagnosticData(span.data);
  for (const link of span.links || []) {
    if (link.attributes) link.attributes = cleanDiagnosticData(link.attributes);
  }
  return span;
}

export function sanitizeSentryBreadcrumb(breadcrumb) {
  if (breadcrumb.category === 'console') return null;
  if (breadcrumb.message) breadcrumb.message = cleanMonitoringText(breadcrumb.message);
  if (breadcrumb.data) breadcrumb.data = cleanDiagnosticData(breadcrumb.data);
  return breadcrumb;
}

export function sanitizeSentryEvent(event) {
  delete event.user;
  if (event.request) {
    event.request = { ...event.request, url: cleanMonitoringUrl(event.request.url) };
    for (const key of ['data', 'cookies', 'headers', 'query_string', 'env']) delete event.request[key];
  }
  if (event.message) event.message = cleanMonitoringText(event.message);
  for (const exception of event.exception?.values || []) {
    exception.value = cleanMonitoringText(exception.value);
    for (const trace of [exception.stacktrace, exception.raw_stacktrace]) {
      for (const frame of trace?.frames || []) {
        for (const key of ['filename', 'abs_path']) {
          if (frame[key]) frame[key] = cleanMonitoringUrl(frame[key]);
        }
      }
    }
  }
  if (event.fingerprint) event.fingerprint = event.fingerprint.map(cleanMonitoringText);
  if (event.breadcrumbs) event.breadcrumbs = event.breadcrumbs.map(sanitizeSentryBreadcrumb).filter(Boolean);
  if (event.contexts) event.contexts = cleanDiagnosticData(event.contexts);
  if (event.extra) event.extra = cleanDiagnosticData(event.extra);
  for (const span of event.spans || []) sanitizeSentrySpan(span);
  return event;
}
