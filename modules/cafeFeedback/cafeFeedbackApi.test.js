import { afterEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'cafe-feedback.browser-id.v1';
const SEMANTIC_CODE = 'review_already_submitted';

function jsonResponse(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(payload),
  };
}

function stubCrypto() {
  vi.stubGlobal('crypto', {
    getRandomValues(buffer) {
      buffer.forEach((value, index) => {
        buffer[index] = index;
      });
      return buffer;
    },
  });
}

function cookieDocument(initialCookie = '') {
  let cookie = initialCookie;
  const writes = [];
  const document = {};

  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get() {
      return cookie;
    },
    set(value) {
      writes.push(value);
      cookie = value.split(';')[0];
    },
  });

  return { document, writes };
}

async function loadApi() {
  vi.resetModules();
  return import('./cafeFeedbackApi.js');
}

async function capturedError(callback) {
  try {
    await callback();
  } catch (error) {
    return error;
  }
  throw new Error('Ожидалась ошибка API');
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('cafeFeedbackApi semantic cooldown', () => {
  it('распознаёт только точный семантический HTTP 429', async () => {
    stubCrypto();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(429, {
          st: false,
          code: SEMANTIC_CODE,
          retry_after: 125,
        })
      )
    );
    const api = await loadApi();

    const error = await capturedError(() =>
      api.getCafeFeedbackForm('test-token')
    );

    expect(error).toBeInstanceOf(api.CafeFeedbackApiError);
    expect(error.status).toBe(429);
    expect(error.code).toBe(SEMANTIC_CODE);
    expect(error.retryAfter).toBe(125);
    expect(api.isSemanticCafeFeedbackCooldown(error)).toBe(true);
  });

  it.each([
    ['технический 429', { st: false, retry_after: 30 }, 30],
    [
      'другой code',
      { st: false, code: 'technical_rate_limit', retry_after: 30 },
      30,
    ],
    ['отсутствующий retry_after', { st: false, code: SEMANTIC_CODE }, 0],
    [
      'текстовый retry_after',
      { st: false, code: SEMANTIC_CODE, retry_after: 'later' },
      0,
    ],
    [
      'boolean retry_after',
      { st: false, code: SEMANTIC_CODE, retry_after: true },
      0,
    ],
    [
      'массив retry_after',
      { st: false, code: SEMANTIC_CODE, retry_after: [30] },
      0,
    ],
    [
      'дробный retry_after',
      { st: false, code: SEMANTIC_CODE, retry_after: 1.5 },
      0,
    ],
    [
      'цифровая строка retry_after',
      { st: false, code: SEMANTIC_CODE, retry_after: '30' },
      0,
    ],
    [
      'небезопасный retry_after',
      {
        st: false,
        code: SEMANTIC_CODE,
        retry_after: Number.MAX_SAFE_INTEGER + 1,
      },
      0,
    ],
  ])(
    'не считает семантическим cooldown: %s',
    async (label, payload, expectedRetryAfter) => {
      stubCrypto();
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(jsonResponse(429, payload))
      );
      const api = await loadApi();

      const error = await capturedError(() =>
        api.getCafeFeedbackForm('test-token')
      );

      expect(error).toBeInstanceOf(api.CafeFeedbackApiError);
      expect(error.retryAfter).toBe(expectedRetryAfter);
      expect(api.isSemanticCafeFeedbackCooldown(error)).toBe(false);
      if (expectedRetryAfter === 0) {
        expect(error.message).toBe(
          'Слишком много попыток. Подождите немного и попробуйте снова.'
        );
      }
    }
  );

  it('не считает сетевую ошибку семантическим cooldown', async () => {
    stubCrypto();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const api = await loadApi();

    const error = await capturedError(() =>
      api.getCafeFeedbackForm('test-token')
    );

    expect(error).toBeInstanceOf(api.CafeFeedbackApiError);
    expect(error.kind).toBe('network');
    expect(api.isSemanticCafeFeedbackCooldown(error)).toBe(false);
  });
});

describe('cafeFeedbackApi browser ID persistence', () => {
  it('предпочитает localStorage и синхронизирует cookie', async () => {
    const storedId = '11111111111111111111111111111111';
    const cookieId = '22222222222222222222222222222222';
    const storage = {
      getItem: vi.fn().mockReturnValue(storedId),
      setItem: vi.fn(),
    };
    const cookie = cookieDocument(`${STORAGE_KEY}=${cookieId}`);
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { st: true }));
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('document', cookie.document);
    vi.stubGlobal('location', { protocol: 'https:' });
    vi.stubGlobal('fetch', fetchMock);
    const api = await loadApi();

    await api.getCafeFeedbackForm('test-token');

    expect(fetchMock.mock.calls[0][1].body.get('browser_id')).toBe(storedId);
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, storedId);
    expect(cookie.writes).toEqual([
      `${STORAGE_KEY}=${storedId}; Path=/feedback; Max-Age=31536000; SameSite=Lax; Secure`,
    ]);
  });

  it('восстанавливает localStorage из cookie', async () => {
    const cookieId = '33333333333333333333333333333333';
    const storage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    };
    const cookie = cookieDocument(`${STORAGE_KEY}=${cookieId}`);
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { st: true }));
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('document', cookie.document);
    vi.stubGlobal('location', { protocol: 'http:' });
    vi.stubGlobal('fetch', fetchMock);
    const api = await loadApi();

    await api.getCafeFeedbackForm('test-token');

    expect(fetchMock.mock.calls[0][1].body.get('browser_id')).toBe(cookieId);
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, cookieId);
    expect(cookie.writes[0]).not.toContain('Secure');
  });

  it('использует стабильный memory fallback при блокировке хранилищ', async () => {
    const blockedStorage = {};
    Object.defineProperties(blockedStorage, {
      getItem: {
        value() {
          throw new Error('storage blocked');
        },
      },
      setItem: {
        value() {
          throw new Error('storage blocked');
        },
      },
    });
    const blockedDocument = {};
    Object.defineProperty(blockedDocument, 'cookie', {
      configurable: true,
      get() {
        throw new Error('cookie blocked');
      },
      set() {
        throw new Error('cookie blocked');
      },
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { st: true }));
    stubCrypto();
    vi.stubGlobal('localStorage', blockedStorage);
    vi.stubGlobal('document', blockedDocument);
    vi.stubGlobal('location', { protocol: 'https:' });
    vi.stubGlobal('fetch', fetchMock);
    const api = await loadApi();

    await api.getCafeFeedbackForm('first-token');
    await api.getCafeFeedbackForm('second-token');

    const firstId = fetchMock.mock.calls[0][1].body.get('browser_id');
    const secondId = fetchMock.mock.calls[1][1].body.get('browser_id');
    expect(firstId).toMatch(/^[a-f0-9]{32}$/);
    expect(secondId).toBe(firstId);
  });
});
