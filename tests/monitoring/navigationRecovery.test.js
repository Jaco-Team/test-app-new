import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  installGlobalSentryHandlers,
  isChunkLoadError,
  isRecoverableNavigationError,
  isStaleNavigationError,
  maybeReloadAfterChunkError,
  shouldRecoverResource,
  shouldSkipIgnoredResourceLoadSentry,
  waitForYMapsReady,
} from '../../utils/clientMonitoring';

function browser() {
  const target = new EventTarget();
  const values = new Map();
  const current = {
    location: { origin: 'https://jacofood.ru', href: 'https://jacofood.ru/samara', pathname: '/samara', reload: vi.fn() },
    sessionStorage: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) },
    addEventListener: target.addEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    setTimeout, clearTimeout,
  };
  vi.stubGlobal('window', current);
  vi.stubGlobal('navigator', { onLine: true });
  vi.stubGlobal('document', { visibilityState: 'visible' });
  return current;
}

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe('восстановление навигации после выпуска', () => {
  it('распознаёт invariant старой вкладки, но не обычные исключения', () => {
    expect(isStaleNavigationError(new Error('Invariant: attempted to hard navigate to the same URL /samara'))).toBe(true);
    expect(isRecoverableNavigationError(new Error('Invariant: attempted to hard navigate to the same URL /samara'))).toBe(true);
    expect(isRecoverableNavigationError(new TypeError('Undefined is not an object'))).toBe(false);
    expect(isChunkLoadError(new Error('Cannot read x in /_next/static/chunks/app.js'))).toBe(false);
    expect(isChunkLoadError(new Error('Failed to load Next.js asset: /_next/static/chunks/app.js'))).toBe(true);
  });
  it('восстанавливает только исполняемый ресурс своей сборки', () => {
    browser();
    expect(shouldRecoverResource({ tagName: 'SCRIPT' }, '/_next/static/a.js')).toBe(true);
    expect(shouldRecoverResource({ tagName: 'LINK', rel: 'stylesheet' }, '/_next/static/a.css')).toBe(true);
    for (const rel of ['prefetch', 'preload', 'modulepreload']) {
      expect(shouldRecoverResource({ tagName: 'LINK', rel }, '/_next/static/a.js')).toBe(false);
    }
    expect(shouldRecoverResource({ tagName: 'SCRIPT' }, 'https://outside.test/_next/static/a.js')).toBe(false);
    expect(shouldRecoverResource({ tagName: 'IMG' }, '/_next/static/a.png')).toBe(false);
  });
  it('не перезагружает offline или скрытую вкладку и не расходует попытку', () => {
    const current = browser();
    navigator.onLine = false;
    expect(maybeReloadAfterChunkError()).toBe(false);
    navigator.onLine = true;
    document.visibilityState = 'hidden';
    expect(maybeReloadAfterChunkError()).toBe(false);
    document.visibilityState = 'visible';
    expect(maybeReloadAfterChunkError()).toBe(true);
    expect(maybeReloadAfterChunkError()).toBe(false);
    expect(current.location.reload).toHaveBeenCalledOnce();
  });
  it('ошибка prefetch фиксируется, но не сбрасывает текущую корзину', () => {
    const current = browser();
    const sentry = { captureException: vi.fn(), addBreadcrumb: vi.fn() };
    installGlobalSentryHandlers(sentry);
    const event = new Event('error');
    Object.defineProperty(event, 'target', { value: { tagName: 'LINK', rel: 'prefetch', href: '/_next/static/future.js' } });
    current.dispatchEvent(event);
    expect(sentry.captureException).toHaveBeenCalledOnce();
    expect(current.location.reload).not.toHaveBeenCalled();
    expect(current.sessionStorage.getItem('jaco:chunk-reload:/samara')).toBeUndefined();
  });
  it('обрабатывает invariant из unhandled rejection старой вкладки', () => {
    const current = browser();
    installGlobalSentryHandlers({ captureException: vi.fn(), addBreadcrumb: vi.fn() });
    const event = new Event('unhandledrejection');
    Object.defineProperty(event, 'reason', { value: new Error('Invariant: attempted to hard navigate to the same URL /samara') });
    current.dispatchEvent(event);
    expect(current.location.reload).toHaveBeenCalledOnce();
  });
  it('отказ своего script вызывает одну перезагрузку, не удаляя корзину', () => {
    const current = browser();
    current.sessionStorage.setItem('cart', 'existing cart');
    const sentry = { captureException: vi.fn(), addBreadcrumb: vi.fn() };
    installGlobalSentryHandlers(sentry);
    for (let i = 0; i < 2; i++) {
      const event = new Event('error');
      Object.defineProperty(event, 'target', { value: { tagName: 'SCRIPT', src: '/_next/static/page.js' } });
      current.dispatchEvent(event);
    }
    expect(current.location.reload).toHaveBeenCalledOnce();
    expect(current.sessionStorage.getItem('cart')).toBe('existing cart');
  });
});

describe('аналитические ресурсы', () => {
  it.each([
    'https://top-fwz1.mail.ru/js/code.js',
    'https://top-fwz1.mail.ru/js/dyn-goal-config.js',
    'https://privacy-cs.mail.ru/static/sync-loader.js',
    'https://vk.com/js/api/openapi.js?162',
    'https://mc.yandex.by/watch/47085879',
  ])('не создаёт error для счётчика %s', url => {
    expect(shouldSkipIgnoredResourceLoadSentry(new URL(url).host, url)).toBe(true);
  });
  it.each([
    'https://yookassa.ru/checkout-widget/v1/checkout-widget.js',
    'https://api-maps.yandex.ru/2.1/',
    'https://yastatic.net/s3/front-maps-static/full.js',
    'https://vk.com/js/api/important-login.js',
    'https://top-fwz1.mail.ru.evil.test/js/code.js',
  ])('сохраняет ошибку функционального или неизвестного ресурса %s', url => {
    expect(shouldSkipIgnoredResourceLoadSentry(new URL(url).host, url)).toBe(false);
  });
});

describe('общий срок ожидания Яндекс Карт', () => {
  beforeEach(() => { vi.useFakeTimers(); browser(); });
  it('ограничивает ожидание ready, даже если ymaps уже существует', async () => {
    window.ymaps = { ready: vi.fn() };
    const result = waitForYMapsReady({ timeoutMs: 1000 });
    await vi.advanceTimersByTimeAsync(1000);
    await expect(result).resolves.toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('появление API не начинает новый timeout', async () => {
    const result = waitForYMapsReady({ timeoutMs: 1000, pollIntervalMs: 100 });
    await vi.advanceTimersByTimeAsync(800);
    window.ymaps = { ready: vi.fn() };
    await vi.advanceTimersByTimeAsync(200);
    await expect(result).resolves.toBe(false);
    expect(window.ymaps.ready).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('завершает ожидание и очищает таймер после успешного ready', async () => {
    window.ymaps = { ready: callback => callback() };
    await expect(waitForYMapsReady()).resolves.toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('завершает ожидание при отказе самого API без unhandled rejection', async () => {
    window.ymaps = { ready: (_ready, failed) => failed() };
    await expect(waitForYMapsReady()).resolves.toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('поздний callback не меняет уже полученный отказ', async () => {
    let callback;
    window.ymaps = { ready: value => { callback = value; } };
    const result = waitForYMapsReady({ timeoutMs: 1000 });
    await vi.advanceTimersByTimeAsync(1000);
    callback();
    await expect(result).resolves.toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
