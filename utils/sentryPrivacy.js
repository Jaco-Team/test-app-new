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

export function sanitizeSentryBreadcrumb(breadcrumb) {
  if (breadcrumb.category === 'console') return null;
  if (breadcrumb.data) {
    breadcrumb.data = { ...breadcrumb.data };
    for (const key of ['url', 'from', 'to']) {
      if (key in breadcrumb.data) breadcrumb.data[key] = cleanMonitoringUrl(breadcrumb.data[key]);
    }
    for (const key of ['body', 'request_body', 'response_body', 'headers', 'cookies']) delete breadcrumb.data[key];
  }
  return breadcrumb;
}

export function sanitizeSentryEvent(event) {
  delete event.user;
  if (event.request) {
    event.request = { ...event.request, url: cleanMonitoringUrl(event.request.url) };
    for (const key of ['data', 'cookies', 'headers', 'query_string', 'env']) delete event.request[key];
  }
  if (event.breadcrumbs) event.breadcrumbs = event.breadcrumbs.map(sanitizeSentryBreadcrumb).filter(Boolean);
  if (event.contexts?.page) {
    event.contexts.page = { ...event.contexts.page };
    for (const key of ['url', 'referrer']) event.contexts.page[key] = cleanMonitoringUrl(event.contexts.page[key]);
  }
  if (event.extra) {
    event.extra = { ...event.extra };
    for (const key of ['pageUrl', 'requestUrl', 'resourceUrl', 'rawResourceUrl', 'documentReferrer', 'elementBaseURI']) {
      if (key in event.extra) event.extra[key] = cleanMonitoringUrl(event.extra[key]);
    }
  }
  for (const span of event.spans || []) {
    if (!span.data) continue;
    for (const key of ['http.url', 'url.full', 'http.target']) {
      if (key in span.data) span.data[key] = cleanMonitoringUrl(span.data[key]);
    }
  }
  return event;
}
