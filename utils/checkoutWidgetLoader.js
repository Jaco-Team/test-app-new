const SCRIPT_URL = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
let pendingLoad = null;

// Один запрос для всех форм; неудачная загрузка не блокирует следующую попытку.
export function ensureYooMoneyCheckoutWidget(timeoutMs = 12000) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(null);
  }
  if (typeof window.YooMoneyCheckoutWidget === 'function') {
    return Promise.resolve(window.YooMoneyCheckoutWidget);
  }
  if (pendingLoad) return pendingLoad;

  pendingLoad = new Promise((resolve) => {
    let script = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    const created = !script;
    if (!script) {
      script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
    }
    let finished = false;
    const finish = (result) => {
      if (finished) return;
      finished = true;
      clearTimeout(deadline);
      clearInterval(poll);
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      if (!result) {
        try { script.remove(); } catch {}
      }
      resolve(result);
    };
    const onLoad = () => {
      if (typeof window.YooMoneyCheckoutWidget === 'function') {
        finish(window.YooMoneyCheckoutWidget);
      }
    };
    const onError = () => finish(null);
    const deadline = setTimeout(onError, timeoutMs);
    const poll = setInterval(onLoad, 100);
    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    try {
      if (created) document.head.appendChild(script);
    } catch { onError(); }
  }).catch(() => null).finally(() => {
    pendingLoad = null;
  });
  return pendingLoad;
}
