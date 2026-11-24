import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { commands, page } from 'vitest/browser';
import { chooseCdnRoute, confirmCdnDirect } from '../../utils/cdnImageRoute';
import CdnPicture, { CdnImage } from '../../components/CdnPicture';

const catalog = 'https://mainimg.jacofood.ru';
const banners = 'https://topimg.jacofood.ru';
const storage = 'https://storage.yandexcloud.net';
const catalogStorage = storage + '/site-img';
const bannerStorage = storage + '/site-home-img';
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
  const requests = await commands.catalogImageRequests();
  await commands.stopImageInterception();
  vi.restoreAllMocks();
  expect(requests.filter(url => new URL(url).pathname === '/_next/image')).toEqual([]);
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

async function expectLoaded(name, url) {
  await expect.poll(() => loadedSource(name)?.href).toBe(url);
}

async function storageRequests() {
  const urls = await commands.catalogImageRequests();
  return urls.filter(url => url.startsWith(storage + '/'));
}

it.each([390, 768, 1440])('на ширине %i px исправный CDN отдаёт выбранный источник без резерва', async width => {
  await page.viewport(width, 820);
  await render(picture('healthy'));
  await expectLoaded('healthy', catalog + '/healthy.webp');
  expect(await storageRequests()).toEqual([]);
  expect(container.querySelector('picture.catalog-picture > img').alt).toBe('healthy');
});

it('ошибка выбранного source переключает видимое фото один раз, сохраняя уже загруженное', async () => {
  const onLoad = vi.fn();
  const onError = vi.fn();
  await render(picture('neighbor'));
  await expectLoaded('neighbor', catalog + '/neighbor.webp');

  await render([picture('neighbor'), picture('offline-card', catalog, { onLoad, onError })]);
  await expectLoaded('offline-card', catalogStorage + '/offline-card.webp');
  expect(loadedSource('neighbor').href).toBe(catalog + '/neighbor.webp');
  expect(onLoad).toHaveBeenCalledOnce();
  expect(onError).not.toHaveBeenCalled();
  await render(picture('next-healthy'));
  await expectLoaded('next-healthy', catalog + '/next-healthy.webp');
  expect(await storageRequests()).toEqual([catalogStorage + '/offline-card.webp']);
});

it('зависший запрос переключается ровно через 3 секунды видимости', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  try {
    await render(picture('slow-card'));
    // Даём браузеру сообщить о видимости через настоящий IntersectionObserver.
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    flushSync(() => vi.advanceTimersByTime(2999));
    expect(await commands.catalogImageRequests()).toEqual([catalog + '/slow-card.webp']);
    flushSync(() => vi.advanceTimersByTime(1));
  } finally {
    vi.useRealTimers();
  }
  await expectLoaded('slow-card', catalogStorage + '/slow-card.webp');
  expect(await storageRequests()).toEqual([catalogStorage + '/slow-card.webp']);
});

it.each([
  [390, 366, '1000x500.jpg'],
  [768, 585, '3700x1000.webp'],
  [1440, 1168, '3700x1000.webp'],
])('на ширине %i px резерв сохраняет размер фото и вариант баннера', async (width, pixels, bannerVariant) => {
  await page.viewport(width, 820);
  const name = 'offline-responsive';
  const sizes = '(max-width: 667px) 40vw, 70vw';
  const variants = [366, 585, 1168].map(size => `${catalog}/${name}_${size}x${size}.webp ${size}w`).join(', ');
  await render(
    <div style={{ transform: 'scale(0.8)' }}>
      <CdnPicture>
        <source type="image/webp" srcSet={variants} sizes={sizes} />
        <img src={`${catalog}/${name}_585x585.jpg`} alt="Блюдо" width={160} height={100} />
      </CdnPicture>
      <CdnPicture>
        <source media="(max-width: 667px)" type="image/jpeg" srcSet={`${banners}/${name}_1000x500.jpg`} />
        <source type="image/webp" srcSet={`${banners}/${name}_3700x1000.webp`} />
        <img src={`${banners}/${name}_3700x1000.jpg`} alt="Баннер" width={240} height={100} />
      </CdnPicture>
    </div>
  );
  const cardKey = `/${name}_${pixels}x${pixels}.webp`;
  const bannerKey = `/${name}_${bannerVariant}`;
  await expectLoaded('Блюдо', catalogStorage + cardKey);
  await expectLoaded('Баннер', bannerStorage + bannerKey);
  expect((await commands.catalogImageRequests()).sort()).toEqual([
    catalog + cardKey, catalogStorage + cardKey, banners + bannerKey, bannerStorage + bannerKey,
  ].sort());
});

it('для невидимой карточки резерв начинается только после прокрутки', async () => {
  const onScrollImage = picture('offline-lazy', catalog, { loading: 'lazy' });
  await render(<div style={{ paddingTop: '200vh' }}>{onScrollImage}</div>);
  // Chromium может заранее запросить lazy-изображение ниже видимой области.
  // Обработчик должен дождаться видимости даже при уже полученном error.
  await expect.poll(async () => (await commands.catalogImageRequests())
    .some(url => url.includes('/offline-lazy.webp'))).toBe(true);
  await new Promise(requestAnimationFrame);
  expect(await storageRequests()).toHaveLength(0);
  container.querySelector('img').scrollIntoView();
  await expectLoaded('offline-lazy', catalogStorage + '/offline-lazy.webp');
});

it('во вкладке в фоне откладывает резерв до её открытия', async () => {
  const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
  await render(picture('offline-background'));
  await expect.poll(() => container.querySelector('img')?.complete).toBe(true);
  expect(await storageRequests()).toHaveLength(0);
  hidden.mockRestore();
  visibility.mockRestore();
  document.dispatchEvent(new Event('visibilitychange'));
  await expectLoaded('offline-background', catalogStorage + '/offline-background.webp');
});

it('переводит srcset обычного img в резерв с сохранением плотности и параметров URL', async () => {
  const name = 'offline-cart';
  const srcSet = `${catalog}/${name}.jpg?v=3 1x, ${catalog}/${name}@2x.jpg?v=3 2x`;
  await render(<CdnImage src={`${catalog}/${name}.jpg`} srcSet={srcSet} alt="Корзина" width={160} height={100} />);
  const key = `/${name}.jpg?v=3`;
  await expectLoaded('Корзина', catalogStorage + key);
  expect(await commands.catalogImageRequests()).toEqual([catalog + key, catalogStorage + key]);
});

it('при отказе CDN и резерва показывает заглушку, а новый src загружается штатно', async () => {
  const onError = vi.fn();
  await render(<CdnImage src={`${catalog}/missing-cart.jpg`} alt="Корзина" width={160} height={100} onError={onError} />);
  await expectLoaded('Корзина', location.origin + '/jaco-logo.png');
  expect(onError).toHaveBeenCalledOnce();
  expect(container.firstElementChild.tagName).toBe('IMG');
  await render(<CdnImage src={`${catalog}/other-cart.jpg`} alt="Корзина" width={160} height={100} />);
  await expectLoaded('Корзина', catalog + '/other-cart.jpg');
  expect(await storageRequests()).toEqual([catalogStorage + '/missing-cart.jpg']);
});

it('восстанавливает SSR-картинку, которая успела сломаться до гидратации', async () => {
  container.innerHTML = `<picture class="catalog-picture"><source type="image/webp" srcset="${catalog}/offline-ssr.webp"><img src="${catalog}/offline-ssr.jpg" alt="offline-ssr" width="160" height="100"></picture>`;
  const original = container.querySelector('img');
  await expect.poll(() => original.complete && original.currentSrc.endsWith('/offline-ssr.webp')).toBe(true);
  expect(original.naturalWidth).toBe(0);
  root = hydrateRoot(container, picture('offline-ssr'));
  await expectLoaded('offline-ssr', catalogStorage + '/offline-ssr.webp');
  expect(await storageRequests()).toEqual([catalogStorage + '/offline-ssr.webp']);
});

it('после двух подтверждений выбирает резерв только для этого домена и затем возвращается к CDN', async () => {
  await page.viewport(1024, 820);
  await render(picture('offline-first'));
  await expectLoaded('offline-first', catalogStorage + '/offline-first.webp');
  await render(picture('offline-second'));
  await expectLoaded('offline-second', catalogStorage + '/offline-second.webp');
  await render([picture('next-card'), picture('banner', banners)]);
  await expectLoaded('next-card', catalogStorage + '/next-card.webp');
  await expectLoaded('banner', banners + '/banner.webp');
  expect((await commands.catalogImageRequests()).some(url => url === `${catalog}/next-card.webp`)).toBe(false);

  await render(
    <CdnPicture>
      <source type="image/webp" srcSet={`${catalog}/small.webp 366w, ${catalog}/large.webp 1168w`} />
      <img src={`${catalog}/default-585.jpg`} alt="Крупное фото" width={740} height={400} />
    </CdnPicture>
  );
  await expectLoaded('Крупное фото', catalogStorage + '/large.webp');

  const later = Date.now() + 5 * 60_000 + 1000;
  vi.spyOn(Date, 'now').mockReturnValue(later);
  await render(picture('recovered'));
  await expectLoaded('recovered', catalog + '/recovered.webp');
  await render(picture('after-recovery'));
  await expectLoaded('after-recovery', catalog + '/after-recovery.webp');
  expect(await storageRequests()).toHaveLength(4);
});
