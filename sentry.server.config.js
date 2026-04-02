// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

function getEnvNumber(name, fallback, { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY } = {}) {
  const rawValue = process.env[name];

  if (rawValue == null || rawValue === "") {
    return fallback;
  }

  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: getEnvNumber("SENTRY_SERVER_TRACES_SAMPLE_RATE", 0, { min: 0, max: 1 }),
  enabled: process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  debug: process.env.NODE_ENV === "development",
  attachStacktrace: true,
  includeLocalVariables: true,
  maxBreadcrumbs: 200,
  maxValueLength: 1000,
  normalizeDepth: 6,
  normalizeMaxBreadth: 1200,
  initialScope: {
    tags: {
      app: "jacofood-web",
      runtime: "server",
    },
  },
});
