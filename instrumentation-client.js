// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://7ce2cfe591e41713764963222cf849f4@sentry.jacochef.ru/5",

//   // Add optional integrations for additional features
//   integrations: [
//     Sentry.replayIntegration(),
//   ],

//   // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//   tracesSampleRate: 1,

//   // Define how likely Replay events are sampled.
//   // This sets the sample rate to be 10%. You may want this to be 100% while
//   // in development and sample at a lower rate in production
//   replaysSessionSampleRate: 0.1,

//   // Define how likely Replay events are sampled when an error occurs.
//   replaysOnErrorSampleRate: 1.0,

//   // Setting this option to true will print useful information to the console while you're setting up Sentry.
//   debug: false,
// });
import * as Sentry from "@sentry/nextjs";
import {
  getClientNetworkContext,
  installGlobalSentryHandlers,
  isChunkLoadError,
} from "./utils/clientMonitoring";

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

function getEnvBoolean(name, fallback) {
  const rawValue = process.env[name];

  if (rawValue == null || rawValue === "") {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(String(rawValue).toLowerCase());
}

const hasSentryDsn = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
const sentryEnabled =
  hasSentryDsn &&
  getEnvBoolean("NEXT_PUBLIC_SENTRY_ENABLED", process.env.NODE_ENV !== "test");
const tracesSampleRate = getEnvNumber("NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE", 0.5, { min: 0, max: 1 });
const profilesSampleRate = getEnvNumber("NEXT_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE", 0, { min: 0, max: 1 });
const replaysSessionSampleRate = getEnvNumber("NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE", 0.1, { min: 0, max: 1 });
const replaysOnErrorSampleRate = getEnvNumber("NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE", 1, { min: 0, max: 1 });

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: sentryEnabled,
  sampleRate: getEnvNumber("NEXT_PUBLIC_SENTRY_ERROR_SAMPLE_RATE", 1, { min: 0, max: 1 }),
  tracesSampleRate,
  enableLogs: true,
  debug: process.env.NODE_ENV === "development",
  attachStacktrace: true,
  maxBreadcrumbs: 200,
  maxValueLength: 1000,
  normalizeDepth: 6,
  normalizeMaxBreadth: 1200,
  initialScope(scope) {
    scope.setTags({
      app: "jacofood-web",
      runtime: "browser",
    });

    return scope;
  },
  integrations: [
    Sentry.replayIntegration({
      // Keep form values masked, but make the page itself readable in Replay.
      maskAllInputs: true,
      maskAllText: false,
      blockAllMedia: false,
      mask: [
        "[data-sentry-mask]",
        ".sentry-mask",
        "[data-sensitive='true']",
      ],
      block: [
        "[data-sentry-block]",
        ".sentry-block",
      ],
    }),
  ],
  ...(profilesSampleRate > 0 ? { profilesSampleRate } : {}),
  replaysSessionSampleRate,
  replaysOnErrorSampleRate,
  beforeSend(event, hint) {
    const network = getClientNetworkContext();
    const originalException = hint?.originalException;
    const route = typeof window !== "undefined" ? window.location.pathname : "unknown";
    const pageUrl = typeof window !== "undefined" ? window.location.href : null;
    const documentVisibility = typeof document !== "undefined" ? document.visibilityState : "unknown";

    event.tags = {
      ...event.tags,
      route,
      online_status: network.online === false ? "offline" : "online",
      save_data_mode: network.saveData ? "enabled" : "disabled",
    };

    if (network.effectiveType && network.effectiveType !== "unknown") {
      event.tags.connection_type = network.effectiveType;
    }

    event.contexts = {
      ...event.contexts,
      connectivity: network,
      page: {
        url: pageUrl,
        path: route,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
        visibilityState: documentVisibility,
        viewport:
          typeof window !== "undefined"
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

    if (isChunkLoadError(originalException || event?.message || event?.exception?.values?.[0]?.value)) {
      event.tags.kind = "chunk_load_error";
      event.fingerprint = event.fingerprint || ["chunk-load-error", window.location.pathname];
    }

    const frames = event?.exception?.values?.flatMap((value) => value?.stacktrace?.frames || []) || [];

    if (
      frames.some((frame) =>
        typeof frame?.filename === "string" &&
        /^(chrome|moz)-extension:\/\//.test(frame.filename),
      )
    ) {
      event.tags.error_source = "browser_extension";
    }

    return event;
  },
});

installGlobalSentryHandlers(Sentry);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
