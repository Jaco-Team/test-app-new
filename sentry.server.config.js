import * as Sentry from '@sentry/nextjs';
import { isSiteSentryDsn } from './utils/sentryEndpoint.mjs';
import { SENTRY_DATA_COLLECTION, sanitizeSentryBreadcrumb, sanitizeSentryEvent } from './utils/sentryPrivacy';

const dsn = isSiteSentryDsn(process.env.SENTRY_DSN)
  ? process.env.SENTRY_DSN
  : process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: isSiteSentryDsn(dsn) && process.env.NODE_ENV !== 'test' && process.env.SENTRY_ENABLED !== 'false',
  environment: process.env.NODE_ENV,
  sampleRate: 1,
  tracesSampleRate: 0.1,
  dataCollection: SENTRY_DATA_COLLECTION,
  initialScope: { tags: { app: 'jacofood-web', runtime: 'nodejs' } },
  beforeBreadcrumb: sanitizeSentryBreadcrumb,
  beforeSend: sanitizeSentryEvent,
  beforeSendTransaction: sanitizeSentryEvent,
  beforeSendLog: () => null,
});
