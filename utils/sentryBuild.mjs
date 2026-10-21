import { isSiteSentryDsn, SENTRY_ORG, SENTRY_PROJECT, SENTRY_URL } from './sentryEndpoint.mjs';

export function createSentryBuildOptions(env = {}) {
  const upload = env.SENTRY_UPLOAD_SOURCEMAPS === 'true';
  const release = env.SENTRY_RELEASE;
  if (upload) {
    if (!isSiteSentryDsn(env.NEXT_PUBLIC_SENTRY_DSN)) throw new Error('SENTRY_SITE_DSN_REQUIRED');
    if (!env.SENTRY_AUTH_TOKEN) throw new Error('SENTRY_UPLOAD_TOKEN_REQUIRED');
    if (!/^jacofood-web@[a-f0-9]{40}$/.test(release || '')) throw new Error('SENTRY_COMMIT_RELEASE_REQUIRED');
  }
  return {
    sentryUrl: SENTRY_URL,
    org: SENTRY_ORG,
    project: SENTRY_PROJECT,
    ...(upload ? { authToken: env.SENTRY_AUTH_TOKEN } : {}),
    ...(upload ? { errorHandler(error) { throw error; } } : {}),
    telemetry: false,
    silent: !env.CI,
    widenClientFileUpload: true,
    sourcemaps: { disable: !upload, deleteSourcemapsAfterUpload: true },
    release: {
      ...(release ? { name: release } : {}),
      create: upload,
      finalize: upload,
      setCommits: false,
    },
    webpack: {
      treeshake: { removeDebugLogging: true },
    },
  };
}
