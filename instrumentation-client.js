import * as Sentry from '@sentry/nextjs';
import { isSiteSentryDsn } from './utils/sentryEndpoint.mjs';
import { SENTRY_DATA_COLLECTION, sanitizeSentryBreadcrumb, sanitizeSentryEvent } from './utils/sentryPrivacy';
import {
  getClientNetworkContext,
  installGlobalSentryHandlers,
  isChunkLoadError,
  isIgnoredBrowserInternalError,
  isIgnoredInjectedScriptError,
  isIgnoredResourceLoadError,
} from './utils/clientMonitoring';

const hasSentryDsn = isSiteSentryDsn(process.env.NEXT_PUBLIC_SENTRY_DSN);
const sentryEnabled =
  hasSentryDsn &&
  process.env.NODE_ENV !== 'test' &&
  process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'false';
const tracesSampleRate = 0.1;
const ignoredClientSpans = [
  {
    op: 'http.client',
    attributes: {
      'server.address': 'mc.yandex.ru',
    },
  },
];

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: sentryEnabled,
  sampleRate: 1,
  tracesSampleRate,
  debug: process.env.NODE_ENV === 'development',
  attachStacktrace: true,
  maxBreadcrumbs: 200,
  maxValueLength: 1000,
  normalizeDepth: 6,
  normalizeMaxBreadth: 1200,
  ignoreSpans: ignoredClientSpans,
  initialScope(scope) {
    scope.setTags({
      app: 'jacofood-web',
      runtime: 'browser',
    });

    return scope;
  },
  dataCollection: SENTRY_DATA_COLLECTION,
  beforeBreadcrumb: sanitizeSentryBreadcrumb,
  beforeSendTransaction: sanitizeSentryEvent,
  beforeSendLog: () => null,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  beforeSend(event, hint) {
    const network = getClientNetworkContext();
    const originalException = hint?.originalException;
    const route =
      typeof window !== 'undefined' ? window.location.pathname : 'unknown';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : null;
    const documentVisibility =
      typeof document !== 'undefined' ? document.visibilityState : 'unknown';

    event.tags = {
      ...event.tags,
      route,
      online_status: network.online === false ? 'offline' : 'online',
      save_data_mode: network.saveData ? 'enabled' : 'disabled',
    };

    if (network.effectiveType && network.effectiveType !== 'unknown') {
      event.tags.connection_type = network.effectiveType;
    }

    event.contexts = {
      ...event.contexts,
      connectivity: network,
      page: {
        url: pageUrl,
        path: route,
        referrer:
          typeof document !== 'undefined' ? document.referrer || null : null,
        visibilityState: documentVisibility,
        viewport:
          typeof window !== 'undefined'
            ? {
                width: window.innerWidth,
                height: window.innerHeight,
              }
            : null,
      },
    };

    event.extra = {
      ...event.extra,
      pageUrl,
      documentVisibility,
    };

    if (
      isChunkLoadError(
        originalException ||
          event?.message ||
          event?.exception?.values?.[0]?.value
      )
    ) {
      event.tags.kind = 'chunk_load_error';
      event.fingerprint = event.fingerprint || [
        'chunk-load-error',
        window.location.pathname,
      ];
    }

    if (isIgnoredResourceLoadError(event)) {
      return null;
    }

    const exceptionMessage =
      event?.exception?.values?.[0]?.value || event?.message || '';

    if (
      isIgnoredBrowserInternalError(originalException) ||
      isIgnoredBrowserInternalError(exceptionMessage)
    ) {
      return null;
    }

    if (isIgnoredInjectedScriptError(event, originalException)) {
      return null;
    }

    const frames =
      event?.exception?.values?.flatMap(
        (value) => value?.stacktrace?.frames || []
      ) || [];

    if (
      frames.some(
        (frame) =>
          typeof frame?.filename === 'string' &&
          /^(chrome|moz)-extension:\/\//.test(frame.filename)
      )
    ) {
      event.tags.error_source = 'browser_extension';
    }

    return sanitizeSentryEvent(event);
  },
});

installGlobalSentryHandlers(Sentry);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
