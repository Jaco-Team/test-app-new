import { afterEach, describe, expect, it, vi } from 'vitest';

import { maybeReloadAfterChunkError } from '../../utils/clientMonitoring.js';

function createStorage() {
  const values = new Map();

  return {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, String(value))),
  };
}

function createWindow(storage = createStorage(), pathname = '/samara') {
  const browser = {
    sessionStorage: storage,
    location: { pathname, reload: vi.fn() },
  };
  vi.stubGlobal('window', browser);
  vi.stubGlobal('sessionStorage', storage);
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    get: () => window.sessionStorage,
  });

  return browser;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('восстановление после ошибки загрузки скрипта', () => {
  it('на сервере не пытается перезагрузить страницу', () => {
    vi.stubGlobal('window', undefined);

    expect(maybeReloadAfterChunkError()).toBe(false);
  });

  it('сохраняет причину ошибки до перезагрузки страницы', () => {
    const storage = createStorage();
    const browser = createWindow(storage);
    const context = {
      source: 'resource_error',
      resourceUrl: '/_next/static/a.js',
    };
    vi.spyOn(Date, 'now').mockReturnValue(123456);
    browser.location.reload.mockImplementation(() => {
      expect(JSON.parse(storage.getItem('jaco:chunk-reload:/samara'))).toEqual({
        ts: 123456,
        ...context,
      });
    });

    expect(maybeReloadAfterChunkError(context)).toBe(true);
    expect(browser.location.reload).toHaveBeenCalledOnce();
  });

  it('перезагружает каждый путь только один раз за сессию, включая новый документ', () => {
    const storage = createStorage();
    const firstDocument = createWindow(storage);

    expect(maybeReloadAfterChunkError()).toBe(true);
    expect(maybeReloadAfterChunkError()).toBe(false);
    expect(firstDocument.location.reload).toHaveBeenCalledOnce();

    const nextDocument = createWindow(storage);
    expect(maybeReloadAfterChunkError()).toBe(false);
    expect(nextDocument.location.reload).not.toHaveBeenCalled();

    nextDocument.location.pathname = '/togliatti';
    expect(maybeReloadAfterChunkError()).toBe(true);
    expect(maybeReloadAfterChunkError()).toBe(false);
    expect(nextDocument.location.reload).toHaveBeenCalledOnce();
  });

  it('сохраняет существующую отметку перезагрузки', () => {
    const storage = createStorage();
    storage.setItem('jaco:chunk-reload:/samara', 'previous-attempt');
    storage.setItem.mockClear();
    const browser = createWindow(storage);

    expect(maybeReloadAfterChunkError()).toBe(false);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(browser.location.reload).not.toHaveBeenCalled();
  });

  it.each([undefined, null])(
    'не перезагружает при отсутствии хранилища: %s',
    (storage) => {
      const browser = createWindow();
      browser.sessionStorage = storage;

      expect(maybeReloadAfterChunkError()).toBe(false);
      expect(browser.location.reload).not.toHaveBeenCalled();
    }
  );

  it('не выбрасывает ошибку, если браузер запрещает доступ к sessionStorage', () => {
    const browser = createWindow();
    Object.defineProperty(browser, 'sessionStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });

    expect(maybeReloadAfterChunkError()).toBe(false);
    expect(browser.location.reload).not.toHaveBeenCalled();
  });

  it.each([
    ['getItem', 'SecurityError'],
    ['setItem', 'QuotaExceededError'],
  ])('не перезагружает повторно при ошибке %s (%s)', (method, name) => {
    const storage = createStorage();
    storage[method].mockImplementation(() => {
      throw new DOMException('Storage unavailable', name);
    });
    const browser = createWindow(storage);

    expect(maybeReloadAfterChunkError()).toBe(false);
    expect(maybeReloadAfterChunkError()).toBe(false);
    expect(browser.location.reload).not.toHaveBeenCalled();
  });

  it('не перезагружает без отметки, если причина ошибки не сериализуется', () => {
    const browser = createWindow();
    const context = {};
    context.self = context;

    expect(maybeReloadAfterChunkError(context)).toBe(false);
    expect(browser.location.reload).not.toHaveBeenCalled();
  });
});
