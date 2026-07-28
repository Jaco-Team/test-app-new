const DEFAULT_API_URL =
  'https://api2.jacochef.ru/site/public/index.php/cafe_review';
const BROWSER_ID_STORAGE_KEY = 'cafe-feedback.browser-id.v1';
const BROWSER_ID_COOKIE_KEY = 'cafe-feedback.browser-id.v1';
const BROWSER_ID_PATTERN = /^[a-f0-9]{32}$/;
const BROWSER_ID_MAX_AGE = 31536000;
const SEMANTIC_COOLDOWN_CODE = 'review_already_submitted';

let memoryBrowserId = '';

export class CafeFeedbackApiError extends Error {
  constructor(
    message,
    {
      kind = 'network',
      status = 0,
      fields = null,
      retryAfter = 0,
      code = '',
    } = {}
  ) {
    super(message);
    this.name = 'CafeFeedbackApiError';
    this.kind = kind;
    this.status = status;
    this.fields = fields;
    this.retryAfter = normalizeRetryAfter(retryAfter);
    this.code = typeof code === 'string' ? code : '';
  }
}

function apiUrl() {
  return process.env.NEXT_PUBLIC_CAFE_REVIEW_API_URL || DEFAULT_API_URL;
}

function errorKind(status, payload, retryAfter) {
  if (
    status === 429 &&
    payload?.code === SEMANTIC_COOLDOWN_CODE &&
    retryAfter > 0
  ) {
    return 'submitted';
  }

  const marker = [
    payload?.code,
    payload?.error,
    payload?.status,
    payload?.text,
    payload?.message,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (
    marker.includes('кафе не найден') ||
    marker.includes('cafe not found') ||
    marker.includes('inactive') ||
    marker.includes('неактив')
  ) {
    return 'inactive';
  }
  if (status === 401 || status === 404) return 'invalid';
  if (status === 409) return 'replay';
  if (status === 422) return 'field';
  if (status === 429) return 'rate';
  return 'network';
}

function defaultMessage(kind) {
  const messages = {
    inactive: 'Эта точка сейчас не принимает отзывы.',
    invalid: 'Ссылка недействительна или срок её действия истёк.',
    replay: 'Отзыв по этой ссылке уже отправлен.',
    submitted: 'Отзыв уже сохранён.',
    field: 'Проверьте заполненные поля и попробуйте ещё раз.',
    rate: 'Слишком много попыток. Подождите немного и попробуйте снова.',
    network: 'Не удалось связаться с сервером. Проверьте интернет.',
  };

  return messages[kind] || messages.network;
}

function normalizeRetryAfter(value) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
    ? value
    : 0;
}

function pluralizeRussian(value, forms) {
  const mod100 = value % 100;
  const mod10 = value % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

function rateLimitMessage(retryAfter) {
  const secondsTotal = normalizeRetryAfter(retryAfter);
  if (!secondsTotal) return defaultMessage('rate');

  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;
  const parts = [];
  if (minutes) {
    parts.push(
      `${minutes} ${pluralizeRussian(minutes, ['минуту', 'минуты', 'минут'])}`
    );
  }
  if (seconds) {
    parts.push(
      `${seconds} ${pluralizeRussian(seconds, [
        'секунду',
        'секунды',
        'секунд',
      ])}`
    );
  }

  return `Повторить отправку можно через ${parts.join(' ')}.`;
}

function createBrowserId() {
  const secureCrypto = globalThis.crypto;
  if (!secureCrypto || typeof secureCrypto.getRandomValues !== 'function') {
    throw new CafeFeedbackApiError(
      'Браузер не поддерживает безопасное создание идентификатора. Обновите браузер и попробуйте снова.'
    );
  }

  const bytes = new Uint8Array(16);
  secureCrypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

function readStoredBrowserId() {
  try {
    const value =
      globalThis.localStorage?.getItem(BROWSER_ID_STORAGE_KEY) || '';
    return BROWSER_ID_PATTERN.test(value) ? value : '';
  } catch {
    return '';
  }
}

function readCookieBrowserId() {
  try {
    const cookies = String(globalThis.document?.cookie || '').split(';');
    for (const cookie of cookies) {
      const separator = cookie.indexOf('=');
      if (separator < 0) continue;
      const name = cookie.slice(0, separator).trim();
      if (name !== BROWSER_ID_COOKIE_KEY) continue;
      const value = decodeURIComponent(cookie.slice(separator + 1).trim());
      return BROWSER_ID_PATTERN.test(value) ? value : '';
    }
  } catch {
    return '';
  }
  return '';
}

function writeStoredBrowserId(value) {
  try {
    globalThis.localStorage?.setItem(BROWSER_ID_STORAGE_KEY, value);
  } catch {
    // В закрытом режиме браузера остаются cookie или память вкладки.
  }
}

function writeCookieBrowserId(value) {
  try {
    if (!globalThis.document) return;
    const secure = globalThis.location?.protocol === 'https:' ? '; Secure' : '';
    globalThis.document.cookie =
      `${BROWSER_ID_COOKIE_KEY}=${encodeURIComponent(value)}` +
      `; Path=/feedback; Max-Age=${BROWSER_ID_MAX_AGE}; SameSite=Lax${secure}`;
  } catch {
    // Если cookie заблокированы, localStorage и память работают независимо.
  }
}

function browserId() {
  const stored = readStoredBrowserId();
  const cookie = readCookieBrowserId();
  memoryBrowserId =
    stored ||
    cookie ||
    (BROWSER_ID_PATTERN.test(memoryBrowserId)
      ? memoryBrowserId
      : createBrowserId());

  writeStoredBrowserId(memoryBrowserId);
  writeCookieBrowserId(memoryBrowserId);
  return memoryBrowserId;
}

export function isSemanticCafeFeedbackCooldown(error) {
  return (
    error instanceof CafeFeedbackApiError &&
    error.status === 429 &&
    error.code === SEMANTIC_COOLDOWN_CODE &&
    error.retryAfter > 0
  );
}

async function parseResponse(response) {
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || !payload || payload.st !== true) {
    const retryAfter = normalizeRetryAfter(payload?.retry_after);
    const code = typeof payload?.code === 'string' ? payload.code : '';
    const kind = errorKind(response.status, payload, retryAfter);
    throw new CafeFeedbackApiError(
      kind === 'submitted'
        ? defaultMessage('submitted')
        : kind === 'rate' && retryAfter
          ? rateLimitMessage(retryAfter)
          : payload?.text || payload?.message || defaultMessage(kind),
      {
        kind,
        status: response.status,
        fields: payload?.errors || null,
        retryAfter,
        code,
      }
    );
  }

  return payload;
}

async function postFormData(entries) {
  const body = new FormData();
  const requestEntries = {
    ...entries,
    browser_id: browserId(),
  };

  Object.entries(requestEntries).forEach(([key, value]) => {
    if (key === 'photos' && Array.isArray(value)) {
      value.forEach((photo) => body.append('photos[]', photo));
      return;
    }

    if (value !== undefined && value !== null) {
      body.append(key, String(value));
    }
  });

  let response;
  try {
    response = await fetch(apiUrl(), {
      method: 'POST',
      body,
      credentials: 'omit',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch {
    throw new CafeFeedbackApiError(defaultMessage('network'));
  }

  return parseResponse(response);
}

export function getCafeFeedbackForm(token) {
  return postFormData({
    type: 'get_form',
    token,
  });
}

export function startCafeReview({
  token,
  formToken,
  uiVariant,
  rating,
  idempotencyKey,
  honeypot,
  timeOnPageMs,
}) {
  return postFormData({
    type: 'start_review',
    token,
    form_token: formToken,
    ui_variant: uiVariant,
    rating,
    idempotency_key: idempotencyKey,
    honeypot,
    time_on_page_ms: timeOnPageMs,
  });
}

export function completeCafeReview({
  token,
  formToken,
  reviewToken,
  idempotencyKey,
  rating,
  uiVariant,
  issues,
  issueOther,
  comment,
  photos,
}) {
  return postFormData({
    type: 'complete_review',
    token,
    form_token: formToken,
    review_token: reviewToken,
    idempotency_key: idempotencyKey,
    rating,
    ui_variant: uiVariant,
    issues: JSON.stringify(issues),
    issue_other: issueOther,
    comment,
    photos,
  });
}
