import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { commands, page } from 'vitest/browser';
import { chooseCdnRoute, confirmCdnDirect } from '../../utils/cdnImageRoute';
import CdnPicture, { CdnImage } from '../../components/CdnPicture';

const catalog = 'https://mainimg.jacofood.ru';
const banners = 'https://topimg.jacofood.ru';
let container;
let root;

beforeEach(async () => {
  sessionStorage.clear();
  // Vitest Browser сохраняет ES-модули между кейсами. Начинаем каждый с двух
  // восстановившихся доменов, используя тот же путь, что после истечения 5 минут.
  const future = vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 600_000);
  for (const origin of [catalog, banners]) {
    const host = new URL(origin).hostname;
    const probe = origin + '/before-test.jpg';
    confirmCdnDirect(host, probe, chooseCdnRoute(host, probe));
  }
  future.mockRestore();
  await commands.interceptCatalogImages();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(async () => {
  root?.unmount();
  root = undefined;
  container?.remove();
  await commands.stopImageInterception();
  vi.restoreAllMocks();
});

function picture(name, host = catalog, props = {}) {
  return (
    <CdnPicture key={name} className="catalog-picture">
      <source type="image/webp" srcSet={`${host}/${name}.webp`} />
      <img src={`${host}/${name}.jpg`} alt={name} width={160} height={100} {...props} />
    </CdnPicture>
  );
}

async function render(element) {
  root ??= createRoot(container);
  flushSync(() => root.render(element));
}

function loadedSource(name) {
  const img = container.querySelector(`img[alt="${name}"]`);
  return img?.complete && img.naturalWidth > 0 ? new URL(img.currentSrc) : null;
}

async function expectLoaded(name, path) {
  await expect.poll(() => loadedSource(name)?.pathname).toBe(path);
}

async function optimizedRequests() {
  const urls = await commands.catalogImageRequests();
  return urls.map(url => new URL(url)).filter(url => url.pathname === '/_next/image');
}

it.each([390, 768, 1440])('на ширине %i px исправный CDN отдаёт выбранный источник без резерва', async width => {
  await page.viewport(width, 820);
  await render(picture('healthy'));
  await expectLoaded('healthy', '/healthy.webp');
  expect(await optimizedRequests()).toHaveLength(0);
  expect(container.querySelector('picture.catalog-picture > img').alt).toBe('healthy');
});

it('ошибка выбранного source переключает видимое фото один раз, сохраняя уже загруженное', async () => {
  const onLoad = vi.fn();
  const onError = vi.fn();
  await render(picture('neighbor'));
  await expectLoaded('neighbor', '/neighbor.webp');

  await render([picture('neighbor'), picture('offline-card', catalog, { onLoad, onError })]);
  await expectLoaded('offline-card', '/_next/image');
  expect(loadedSource('neighbor').pathname).toBe('/neighbor.webp');
  expect(onLoad).toHaveBeenCalledOnce();
  expect(onError).not.toHaveBeenCalled();
  await render(picture('next-healthy'));
  await expectLoaded('next-healthy', '/next-healthy.webp');
  const requests = await optimizedRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].searchParams.get('url')).toMatch(/^https:\/\/mainimg\.jacofood\.ru\/offline-card\./);
});

it('зависший прямой запрос переключается по тайм-ауту без события error', async () => {
  await render(picture('slow-card'));
  await expect.poll(() => loadedSource('slow-card')?.pathname, { timeout: 6500 }).toBe('/_next/image');
  expect(await optimizedRequests()).toHaveLength(1);
}, 8000);

it('выбирает ширину резерва по размеру карточки до применения анимации scale', async () => {
  await render(<div style={{ transform: 'scale(0.25)' }}>{picture('offline-animated')}</div>);
  await expectLoaded('offline-animated', '/_next/image');
  const [request] = await optimizedRequests();
  expect(Number(request.searchParams.get('w'))).toBeGreaterThanOrEqual(160);
});

it('для невидимой карточки резерв начинается только после прокрутки', async () => {
  const onScrollImage = picture('offline-lazy', catalog, { loading: 'lazy' });
  await render(<div style={{ paddingTop: '200vh' }}>{onScrollImage}</div>);
  // Chromium может заранее запросить lazy-изображение ниже видимой области.
  // Обработчик должен дождаться видимости даже при уже полученном error.
  await expect.poll(async () => (await commands.catalogImageRequests())
    .some(url => url.includes('/offline-lazy.webp'))).toBe(true);
  await new Promise(requestAnimationFrame);
  expect(await optimizedRequests()).toHaveLength(0);
  container.querySelector('img').scrollIntoView();
  await expectLoaded('offline-lazy', '/_next/image');
});

it('во вкладке в фоне откладывает резерв до её открытия', async () => {
  const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
  await render(picture('offline-background'));
  await expect.poll(() => container.querySelector('img')?.complete).toBe(true);
  expect(await optimizedRequests()).toHaveLength(0);
  hidden.mockRestore();
  visibility.mockRestore();
  document.dispatchEvent(new Event('visibilitychange'));
  await expectLoaded('offline-background', '/_next/image');
});

it('при отказе CDN и резерва показывает заглушку, а новый src загружается штатно', async () => {
  const onError = vi.fn();
  await render(<CdnImage src={`${catalog}/missing-cart.jpg`} alt="Корзина" width={160} height={100} onError={onError} />);
  await expectLoaded('Корзина', '/jaco-logo.png');
  expect(onError).toHaveBeenCalledOnce();
  expect(container.firstElementChild.tagName).toBe('IMG');
  await render(<CdnImage src={`${catalog}/other-cart.jpg`} alt="Корзина" width={160} height={100} />);
  await expectLoaded('Корзина', '/other-cart.jpg');
  expect(await optimizedRequests()).toHaveLength(1);
});

it('восстанавливает SSR-картинку, которая успела сломаться до гидратации', async () => {
  container.innerHTML = `<picture class="catalog-picture"><source type="image/webp" srcset="${catalog}/offline-ssr.webp"><img src="${catalog}/offline-ssr.jpg" alt="offline-ssr" width="160" height="100"></picture>`;
  const original = container.querySelector('img');
  await expect.poll(() => original.complete && original.currentSrc.endsWith('/offline-ssr.webp')).toBe(true);
  expect(original.naturalWidth).toBe(0);
  root = hydrateRoot(container, picture('offline-ssr'));
  await expectLoaded('offline-ssr', '/_next/image');
  expect(await optimizedRequests()).toHaveLength(1);
});

it('после двух подтверждений выбирает резерв только для этого домена и затем возвращается к CDN', async () => {
  await page.viewport(1024, 820);
  await render(picture('offline-first'));
  await expectLoaded('offline-first', '/_next/image');
  await render(picture('offline-second'));
  await expectLoaded('offline-second', '/_next/image');
  await render([picture('next-card'), picture('banner', banners)]);
  await expectLoaded('next-card', '/_next/image');
  await expectLoaded('banner', '/banner.webp');
  expect((await commands.catalogImageRequests()).some(url => url === `${catalog}/next-card.webp`)).toBe(false);

  await render(
    <CdnPicture>
      <source type="image/webp" srcSet={`${catalog}/small.webp 366w, ${catalog}/large.webp 1168w`} />
      <img src={`${catalog}/default-585.jpg`} alt="Крупное фото" width={740} height={400} />
    </CdnPicture>
  );
  await expectLoaded('Крупное фото', '/_next/image');
  expect(loadedSource('Крупное фото').searchParams.get('url')).toBe(`${catalog}/large.webp`);

  const later = Date.now() + 5 * 60_000 + 1000;
  vi.spyOn(Date, 'now').mockReturnValue(later);
  await render(picture('recovered'));
  await expectLoaded('recovered', '/recovered.webp');
  await render(picture('after-recovery'));
  await expectLoaded('after-recovery', '/after-recovery.webp');
  expect(await optimizedRequests()).toHaveLength(4);
});
