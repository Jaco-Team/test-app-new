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
