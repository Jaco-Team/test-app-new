import * as Sentry from "@sentry/nextjs";

// Custom error class for Sentry testing
class SentryExampleAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}
// A faulty API route to test Sentry's error monitoring
export default function handler(_req, res) {
  Sentry.logger.info("Sentry example API called");
  const error = new SentryExampleAPIError(
    "This error is raised on the backend called by the example page.",
  );

  Sentry.captureException(error);
  res.status(500).json({
    ok: false,
    message: error.message,
  });
}
