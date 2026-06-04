const DEFAULT_YANDEX_STORAGE = 'https://topimg.jacofood.ru/';
const DEFAULT_YANDEX_IMG = 'https://mainimg.jacofood.ru/';

function normalizeBase(url: string | undefined, fallback: string): string {
  const raw = String(url ?? fallback).trim();
  return raw.endsWith('/') ? raw : `${raw}/`;
}

export function getYandexStorageBase(): string {
  return normalizeBase(
    process.env.NEXT_PUBLIC_YANDEX_STORAGE,
    DEFAULT_YANDEX_STORAGE
  );
}

export function getYandexImgBase(): string {
  return normalizeBase(process.env.NEXT_PUBLIC_YANDEX_IMG, DEFAULT_YANDEX_IMG);
}

export type BannerImageSize = 'compact' | 'expanded';

/** Home/promo banners from the public media CDN. */
export function resolveBannerImageUrl(
  mediaKey: string,
  size: BannerImageSize = 'compact'
): string {
  const suffix = size === 'expanded' ? '_3700x1000.jpg' : '_1000x500.jpg';
  return `${getYandexStorageBase()}${mediaKey}${suffix}`;
}

/** Product card images from product media keys. */
export function resolveProductImageUrl(
  imgApp: string,
  size = '_292x292.jpg'
): string {
  return `${getYandexImgBase()}${imgApp}${size}`;
}

export function isValidMediaKey(value: unknown): value is string {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return false;
  }
  const normalized = raw.toLowerCase();
  return normalized !== 'undefined' && normalized !== 'null';
}

const PRODUCT_MODAL_IMAGE_CANDIDATES = [
  ['292x292', 138],
  ['366x366', 146],
  ['466x466', 183],
  ['585x585', 233],
  ['732x732', 292],
  ['1168x1168', 366],
  ['1420x1420', 584],
  ['2000x2000', 760],
  ['2000x2000', 1875],
] as const;

export const PRODUCT_MODAL_IMAGE_SIZES =
  '(max-width: 1439px) 233px, (max-width: 1279px) 218px, 292px';

export function resolveProductImageSrcSet(
  imgApp: string,
  extension: 'jpg' | 'webp' = 'jpg'
): string {
  return PRODUCT_MODAL_IMAGE_CANDIDATES.map(
    ([size, width]) =>
      `${getYandexImgBase()}${imgApp}_${size}.${extension} ${width}w`
  ).join(', ');
}
