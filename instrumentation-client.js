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

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0.5,
  debug: process.env.NODE_ENV === "development",
  integrations: [
    Sentry.replayIntegration(),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event, hint) {
    const network = getClientNetworkContext();
    const originalException = hint?.originalException;

    event.tags = {
      ...event.tags,
      online_status: network.online === false ? "offline" : "online",
    };

    if (network.effectiveType && network.effectiveType !== "unknown") {
      event.tags.connection_type = network.effectiveType;
    }

    event.contexts = {
      ...event.contexts,
      connectivity: network,
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
