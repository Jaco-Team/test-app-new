const SCRIPT_URL = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
export const CHECKOUT_WIDGET_SCRIPT_CONTEXT = Object.freeze({
  script_host: 'yookassa.ru',
  script_path: '/checkout-widget/v1/checkout-widget.js',
});
const WIDGET_ERROR_CODES = new Set([
  'customization_of_payment_methods_not_allowed',
  'internal_service_error',
  'invalid_combination_of_payment_methods',
  'invalid_payment_methods',
  'invalid_return_url',
  'invalid_token',
  'no_payment_methods_to_display',
  'token_expired',
  'token_required',
]);
let pendingLoad = null;

export function getPaymentWidgetErrorCode(error) {
  try {
    const code = typeof error === 'string' ? error : error?.error?.code || error?.code;
    return typeof code === 'string' && WIDGET_ERROR_CODES.has(code.toLowerCase())
      ? code.toLowerCase()
      : 'unknown';
  } catch { return 'unknown'; }
}

// Один запрос для всех форм; неудачная загрузка не блокирует следующую попытку.
export function ensureYooMoneyCheckoutWidget(timeoutMs = 12000, onFailure) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(null);
  }
  if (typeof window.YooMoneyCheckoutWidget === 'function') {
    return Promise.resolve(window.YooMoneyCheckoutWidget);
  }
  if (pendingLoad) {
    if (typeof onFailure === 'function') pendingLoad.failureCallbacks.push(onFailure);
    return pendingLoad.promise;
  }

  const load = { promise: null, failureCallbacks: typeof onFailure === 'function' ? [onFailure] : [], failureReported: false };
  const reportFailure = (reason) => {
    if (load.failureReported) return;
    load.failureReported = true;
    for (const callback of [...load.failureCallbacks]) {
      try { callback(reason); } catch {}
    }
  };
  pendingLoad = load;
  load.promise = new Promise((resolve) => {
    let script = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    const created = !script;
    if (!script) {
      script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
    }
    let finished = false;
    const finish = (result, reason) => {
      if (finished) return;
      finished = true;
      clearTimeout(deadline);
      clearInterval(poll);
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      if (!result) {
        try { script.remove(); } catch {}
        reportFailure(reason);
      }
      resolve(result);
    };
    const onLoad = () => {
      if (typeof window.YooMoneyCheckoutWidget === 'function') {
        finish(window.YooMoneyCheckoutWidget);
      }
    };
    const onError = () => finish(null, 'script_load_error');
    const deadline = setTimeout(() => finish(null, 'script_timeout'), timeoutMs);
    const poll = setInterval(onLoad, 100);
    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    try {
      if (created) document.head.appendChild(script);
    } catch { finish(null, 'script_dom_error'); }
  }).catch(() => {
    reportFailure('script_dom_error');
    return null;
  }).finally(() => {
    if (pendingLoad === load) pendingLoad = null;
  });
  return load.promise;
}
