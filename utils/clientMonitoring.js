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

        return;
      }

      if (isChunkLoadError(event?.error || event?.message || event?.filename)) {
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
