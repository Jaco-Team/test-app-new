import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const products = 'mainimg.jacofood.ru';
const banners = 'topimg.jacofood.ru';
const cooldownMs = 5 * 60_000;
let routing: typeof import('../../utils/cdnImageRoute');

beforeEach(async () => {
  vi.useFakeTimers();
  const values = new Map<string, string>();
  vi.stubGlobal('window', {
    sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
    umami: { track: vi.fn() },
  });
  vi.resetModules();
  routing = await import('../../utils/cdnImageRoute');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function confirmOutage() {
  routing.confirmCdnFallback(products, '/Madeira_366x366.jpg', 'direct');
  routing.confirmCdnFallback(products, '/Vulkan_366x366.jpg', 'direct');
}

describe('маршрут изображений каталога', () => {
  it('использует резерв только для двух HTTPS-доменов каталога', () => {
    expect(routing.getCdnHostname(`https://${products}/a.jpg`)).toBe(products);
    expect(routing.getCdnHostname(`https://${banners}/a.webp`)).toBe(banners);
    for (const src of ['/jaco-logo.png', '/_next/image', 'https://example.com/img',
      `https://${products}.example.com/a`, `https://${banners}@example.com/a`,
      `http://${products}/a`, `https://${products}:8000/a`, `https://user@${products}/a`]) {
      expect(routing.getCdnHostname(src)).toBeNull();
      expect(routing.getStorageImageUrl(src)).toBeNull();
    }
  });

  it('переводит фото и баннер в свои бакеты с исходным ключом, размером и версией', () => {
    expect(routing.getStorageImageUrl(`https://${products}/menu/a%20b_366x366.webp?v=2%2B1#photo`))
      .toBe('https://storage.yandexcloud.net/site-img/menu/a%20b_366x366.webp?v=2%2B1#photo');
    expect(routing.getStorageImageUrl(`https://${banners}/vkusno_tlt_3700x1000.jpg`))
      .toBe('https://storage.yandexcloud.net/site-home-img/vkusno_tlt_3700x1000.jpg');
  });

  it('считает разные размеры одного фото одним сбоем и разделяет хосты', () => {
    routing.confirmCdnFallback(products, '/Madeira_366x366.jpg', 'direct');
    routing.confirmCdnFallback(products, '/Madeira_732x732.webp', 'direct');
    expect(routing.chooseCdnRoute(products, 'next')).toBe('direct');
    routing.confirmCdnFallback(products, '/Vulkan_366x366.jpg', 'direct');
    expect(routing.chooseCdnRoute(products, 'next')).toBe('fallback');
    expect(routing.chooseCdnRoute(banners, 'next')).toBe('direct');
  });

  it('забывает единичную ошибку после успешной загрузки или пяти минут', () => {
    routing.confirmCdnFallback(products, 'one', 'direct');
    routing.confirmCdnDirect(products, 'healthy', 'direct');
    routing.confirmCdnFallback(products, 'two', 'direct');
    vi.advanceTimersByTime(cooldownMs);
    routing.confirmCdnFallback(products, 'three', 'direct');
    expect(routing.chooseCdnRoute(products, 'next')).toBe('direct');
  });

  it('помнит сбой после перезагрузки и возвращает прямой маршрут после одной успешной пробы', async () => {
    confirmOutage();
    vi.resetModules();
    routing = await import('../../utils/cdnImageRoute');
    expect(routing.chooseCdnRoute(products, 'before')).toBe('fallback');
    vi.advanceTimersByTime(cooldownMs);
    expect(routing.chooseCdnRoute(products, 'probe')).toBe('probe');
    expect(routing.chooseCdnRoute(products, 'also-visible')).toBe('fallback');
    routing.confirmCdnDirect(products, 'old-direct-request', 'direct');
    expect(routing.isCdnFallbackPreferred(products)).toBe(true);
    routing.confirmCdnDirect(products, 'probe', 'probe');
    expect(routing.isCdnFallbackPreferred(products)).toBe(false);
    expect(routing.chooseCdnRoute(products, 'next')).toBe('direct');
  });

  it('разрешает новую пробу после отмены и продлевает резерв при подтверждённом сбое', () => {
    confirmOutage();
    vi.advanceTimersByTime(cooldownMs);
    expect(routing.chooseCdnRoute(products, 'removed')).toBe('probe');
    routing.releaseCdnProbe(products, 'removed');
    expect(routing.chooseCdnRoute(products, 'replacement')).toBe('probe');
    routing.confirmCdnFallback(products, 'replacement', 'probe');
    vi.advanceTimersByTime(cooldownMs - 1);
    expect(routing.chooseCdnRoute(products, 'next')).toBe('fallback');
  });

  it('продолжает работу при запрете sessionStorage и объединяет одинаковые события аналитики', () => {
    Object.defineProperty(window, 'sessionStorage', { get() { throw Error(); } });
    confirmOutage();
    expect(routing.chooseCdnRoute(products, 'next')).toBe('fallback');
    routing.reportCdnFallback(products, 'timeout');
    routing.reportCdnFallback(products, 'timeout');
    expect((window as any).umami.track).toHaveBeenCalledTimes(1);
  });
});
