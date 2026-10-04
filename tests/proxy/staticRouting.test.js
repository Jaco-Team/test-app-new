import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { unstable_doesMiddlewareMatch as doesProxyMatch } from 'next/experimental/testing/server';
import { config, proxy } from '../../proxy.js';

const fetchMock = vi.fn();

function pageRequest(path) {
  return new NextRequest(`https://jacofood.ru${path}`, {
    headers: {
      host: 'jacofood.ru',
      'x-forwarded-proto': 'https',
      accept: 'text/html',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
    },
  });
}

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('статические файлы и служебные маршруты', () => {
  it.each([
    '/Favikon.png',
    '/Favicon_city.png',
    '/Jaco-Logo-PC.png',
    '/account-icon-240x240.png',
    '/icon-512.png',
    '/Jaco-Logo-120%201.svg',
    '/about/%D1%86%D0%B2%D0%B5%D1%82%D0%BD%D0%BE%D0%B9.jpg',
    '/cafe-feedback/jaco-wordmark.svg',
    '/cleaning/pdfjs/pdf.worker.min.mjs',
    '/manifest.webmanifest',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/_next/static/chunk.js',
    '/_next/image?url=%2FFavikon.png&w=640&q=75',
    '/api/health',
    '/api/cleaning/kuybysheva-113/guest-toilet',
  ])('не запускает Proxy для %s', (url) => {
    expect(doesProxyMatch({ config, nextConfig: {}, url })).toBe(false);
  });

  it.each([
    '/Favikon.png',
    '/cleaning/pdfjs/pdf.worker.min.mjs',
    '/manifest.webmanifest',
    '/api/health',
    '/api/cleaning/kuybysheva-113/guest-toilet',
  ])(
    'не перенаправляет внутренний запрос %s и не создаёт сессию',
    async (path) => {
      // Оптимизатор Next.js запрашивает локальную картинку без исходных HTTP-заголовков.
      // В Docker адрес сервера — 0.0.0.0; такой запрос не должен превращаться в HTTPS-редирект.
      const request = new NextRequest(`http://0.0.0.0:3000${path}`);
      const response = await proxy(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('x-middleware-next')).toBe('1');
      expect(response.headers.has('location')).toBe(false);
      expect(response.cookies.getAll()).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );
});

describe('страницы городов и уборки', () => {
  it.each([
    '/',
    '/samara',
    '/togliatti',
    '/samara/menu/firmennye-rolly',
    '/togliatti/menu/rolly',
    '/cleaning/kuybysheva-113/guest-toilet',
  ])('сохраняет обработку страницы %s и учёт визита', async (path) => {
    expect(doesProxyMatch({ config, nextConfig: {}, url: path })).toBe(true);

    const response = await proxy(pageRequest(path));

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.has('location')).toBe(false);
    expect(response.cookies.get('vid')?.value).toBeTruthy();
    expect(response.cookies.get('sid')?.value).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.landing_path).toBe(path);
  });

  it('оставляет старые category и UTM-параметры', async () => {
    const response = await proxy(
      pageRequest('/samara?category=firmennye-rolly&utm_source=vk')
    );

    expect(response.headers.has('location')).toBe(false);
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.landing_path).toBe(
      '/samara?category=firmennye-rolly&utm_source=vk'
    );
    expect(payload.source).toBe('vk');
  });

  it('продолжает очищать регистр и мусор в URL страницы', async () => {
    expect(
      doesProxyMatch({ config, nextConfig: {}, url: '/SAMARA/MENU/ROLLY...' })
    ).toBe(true);
    const response = await proxy(
      pageRequest(
        '/SAMARA/MENU/ROLLY...?text=trash&category=rolly&utm_source=vk'
      )
    );

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(
      'https://jacofood.ru/samara/menu/rolly?category=rolly&utm_source=vk'
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('по-прежнему перенаправляет HTTP-страницу на HTTPS', async () => {
    const request = new NextRequest('http://jacofood.ru/togliatti/menu/rolly', {
      headers: { host: 'jacofood.ru', 'x-forwarded-proto': 'http' },
    });
    const response = await proxy(request);

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(
      'https://jacofood.ru/togliatti/menu/rolly'
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
