// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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
  tracesSampleRate: getEnvNumber("SENTRY_EDGE_TRACES_SAMPLE_RATE", 0, { min: 0, max: 1 }),
  enabled: process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  debug: process.env.NODE_ENV === "development",
  attachStacktrace: true,
  maxBreadcrumbs: 200,
  maxValueLength: 1000,
  normalizeDepth: 6,
  normalizeMaxBreadth: 1200,
  initialScope: {
    tags: {
      app: "jacofood-web",
      runtime: "edge",
    },
  },
});
