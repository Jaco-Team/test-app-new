function getNavigatorConnection() {
  if (typeof navigator === "undefined") {
    return null;
  }

  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

function getErrorText(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Error) {
    return `${value.name || "Error"}: ${value.message || ""}`;
  }

  if (typeof value === "object") {
    if (typeof value.message === "string") {
      return value.message;
    }

    if (typeof value.reason === "string") {
      return value.reason;
    }
  }

  return String(value);
}

function normalizeResourceUrl(resourceUrl) {
  if (!resourceUrl) {
    return "";
  }

  try {
    const normalized = new URL(resourceUrl, window.location.origin);
    normalized.search = "";
    normalized.hash = "";
    return normalized.toString();
  } catch {
    return String(resourceUrl).split("?")[0];
  }
}

function isInvalidResourceUrl(resourceUrl) {
  const normalized = String(resourceUrl || "").toLowerCase();

  if (!normalized) {
    return true;
  }

  return /\/(undefined|null)(?:_|\/|\.|$)/i.test(normalized);
}

export const INTERNET_ISSUE_EVENT_NAME = "jaco:internet-issue";
const INTERNET_ISSUE_DEDUP_WINDOW_MS = 15000;

function normalizeIssueValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.slice(0, 300);
  }

  return getErrorText(value).slice(0, 300);
}

function getIssueSignature(payload) {
  return [
    payload?.type || "unknown_type",
    payload?.source || "unknown_source",
    payload?.module || "",
    payload?.status || "",
    payload?.code || "",
    payload?.resourceUrl || "",
    payload?.tagName || "",
  ].join("|");
}

export function getClientNetworkContext() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {};
  }

  const connection = getNavigatorConnection();

  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || "unknown",
    downlinkMbps: typeof connection?.downlink === "number" ? connection.downlink : null,
    rttMs: typeof connection?.rtt === "number" ? connection.rtt : null,
    saveData: Boolean(connection?.saveData),
  };
}

export function emitInternetIssue(payload = {}) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const safePayload = {
      type: normalizeIssueValue(payload.type) || "internet_issue",
      source: normalizeIssueValue(payload.source) || "unknown",
      module: normalizeIssueValue(payload.module),
      requestType: normalizeIssueValue(payload.requestType),
      status: normalizeIssueValue(payload.status),
      code: normalizeIssueValue(payload.code),
      resourceUrl: normalizeIssueValue(payload.resourceUrl),
      tagName: normalizeIssueValue(payload.tagName),
      retryable: typeof payload.retryable === "boolean" ? payload.retryable : null,
      attempt: normalizeIssueValue(payload.attempt),
      pageUrl: typeof window !== "undefined" ? window.location.href : null,
      network: payload.network || getClientNetworkContext(),
      ts: Date.now(),
    };

    const signature = getIssueSignature(safePayload);
    const previousTs = window.__JACO_INTERNET_ISSUE_CACHE?.[signature] || 0;

    if (Date.now() - previousTs < INTERNET_ISSUE_DEDUP_WINDOW_MS) {
      return false;
    }

    window.__JACO_INTERNET_ISSUE_CACHE = {
      ...(window.__JACO_INTERNET_ISSUE_CACHE || {}),
      [signature]: Date.now(),
    };

    window.dispatchEvent(
      new CustomEvent(INTERNET_ISSUE_EVENT_NAME, {
        detail: safePayload,
      }),
    );

    return true;
  } catch {
    return false;
  }
}

export function isChunkLoadError(value) {
  const errorText = getErrorText(value).toLowerCase();

  return (
    errorText.includes("chunkloaderror") ||
    errorText.includes("loading chunk") ||
    errorText.includes("failed to load chunk") ||
    errorText.includes("failed to fetch dynamically imported module") ||
    errorText.includes("importing a module script failed") ||
    errorText.includes("/_next/static/")
  );
}

export function maybeReloadAfterChunkError(context = {}) {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return false;
  }

  const storageKey = `jaco:chunk-reload:${window.location.pathname}`;

  if (sessionStorage.getItem(storageKey)) {
    return false;
  }

  try {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        ts: Date.now(),
        ...context,
      }),
    );
  } catch {
    // Ignore storage failures and still try to recover with reload.
  }

  window.location.reload();
  return true;
}

export function installGlobalSentryHandlers(Sentry) {
  if (typeof window === "undefined") {
    return;
  }

  if (window.__JACO_SENTRY_HANDLERS_INSTALLED) {
    return;
  }

  window.__JACO_SENTRY_HANDLERS_INSTALLED = true;

  window.addEventListener("offline", () => {
    Sentry.addBreadcrumb({
      category: "network",
      message: "Browser went offline",
      level: "warning",
      data: getClientNetworkContext(),
    });

    emitInternetIssue({
      type: "browser_offline",
      source: "window_event",
      network: getClientNetworkContext(),
    });
  });

  window.addEventListener("online", () => {
    Sentry.addBreadcrumb({
      category: "network",
      message: "Browser went online",
      level: "info",
      data: getClientNetworkContext(),
    });
  });

  window.addEventListener(
    "error",
    (event) => {
      const target = event?.target;

      if (target && target !== window) {
        const resourceUrl = target.currentSrc || target.src || target.href;

        if (!resourceUrl) {
          return;
        }

        const tagName = String(target.tagName || "resource").toLowerCase();
        const normalizedResourceUrl = normalizeResourceUrl(resourceUrl);
        const extra = {
          tagName,
          resourceUrl: normalizedResourceUrl,
          pageUrl: window.location.href,
          ...getClientNetworkContext(),
        };

        if (normalizedResourceUrl.includes("/_next/static/")) {
          const chunkError = new Error(`Failed to load Next.js asset: ${normalizedResourceUrl}`);
          chunkError.name = "ChunkLoadError";

          Sentry.captureException(chunkError, {
            tags: {
              kind: "chunk_load_error",
              source: "resource_error",
              resource_tag: tagName,
            },
            extra,
            fingerprint: ["chunk-load-error", normalizedResourceUrl],
          });

          maybeReloadAfterChunkError({
            source: "resource_error",
            resourceUrl: normalizedResourceUrl,
          });

          emitInternetIssue({
            type: "chunk_asset_failed",
            source: "resource_error",
            resourceUrl: normalizedResourceUrl,
            tagName,
            network: getClientNetworkContext(),
          });

          return;
        }

        if (isInvalidResourceUrl(normalizedResourceUrl)) {
          Sentry.captureMessage(`Resource has invalid URL: ${tagName}`, {
            level: "warning",
            tags: {
              kind: "resource_invalid_url",
              resource_tag: tagName,
            },
            extra,
            fingerprint: ["resource-invalid-url", tagName, normalizedResourceUrl],
          });

          emitInternetIssue({
            type: "resource_invalid_url",
            source: "resource_data_error",
            module: "resource_loader",
            code: "invalid_resource_url",
            resourceUrl: normalizedResourceUrl,
            tagName,
            retryable: false,
            network: getClientNetworkContext(),
          });

          return;
        }

        Sentry.captureMessage(`Resource failed to load: ${tagName}`, {
          level: "error",
          tags: {
            kind: "resource_load_error",
            resource_tag: tagName,
          },
          extra,
          fingerprint: ["resource-load-error", tagName, normalizedResourceUrl],
        });

        emitInternetIssue({
          type: "resource_load_failed",
          source: "resource_error",
          resourceUrl: normalizedResourceUrl,
          tagName,
          network: getClientNetworkContext(),
        });

        return;
      }

      if (isChunkLoadError(event?.error || event?.message || event?.filename)) {
        emitInternetIssue({
          type: "chunk_runtime_error",
          source: "window_error",
          code: event?.message || null,
          resourceUrl: event?.filename || null,
          network: getClientNetworkContext(),
        });

        maybeReloadAfterChunkError({
          source: "window_error",
          filename: event?.filename || null,
        });
      }
    },
    true,
  );

  window.addEventListener("unhandledrejection", (event) => {
    if (!isChunkLoadError(event?.reason)) {
      return;
    }

    emitInternetIssue({
      type: "chunk_unhandled_rejection",
      source: "unhandledrejection",
      code: getErrorText(event?.reason),
      network: getClientNetworkContext(),
    });

    maybeReloadAfterChunkError({
      source: "unhandledrejection",
    });
  });
}

export function waitForYMapsReady({ timeoutMs = 12000, pollIntervalMs = 250 } = {}) {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  const hasReadyApi = () => Boolean(window.ymaps && typeof window.ymaps.ready === "function");

  const waitForReadyCallback = () =>
    new Promise((resolve) => {
      try {
        window.ymaps.ready(() => resolve(true));
      } catch {
        resolve(false);
      }
    });

  if (hasReadyApi()) {
    return waitForReadyCallback();
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();
    let timerId = null;

    const finish = (result) => {
      if (timerId) {
        window.clearTimeout(timerId);
      }

      resolve(result);
    };

    const tick = () => {
      if (window.__JACO_YMAPS_FAILED) {
        finish(false);
        return;
      }

      if (hasReadyApi()) {
        waitForReadyCallback().then(finish);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        finish(false);
        return;
      }

      timerId = window.setTimeout(tick, pollIntervalMs);
    };

    tick();
  });
}
