import { ITEM_IMAGE_WIDTHS_BY_ROLE } from './itemImageWidths';

const INVALID_ITEM_IMAGE_NAMES = new Set(['', 'undefined', 'null', 'nan']);

export const DEFAULT_ITEM_IMAGE_SRC = '/jaco-logo.png';

export function normalizeItemImageName(imageName) {
  if (imageName === null || imageName === undefined) {
    return '';
  }

  const normalized = String(imageName).trim();

  if (!normalized) {
    return '';
  }

  return INVALID_ITEM_IMAGE_NAMES.has(normalized.toLowerCase())
    ? ''
    : normalized;
}

export function hasItemImage(imageName) {
  return Boolean(normalizeItemImageName(imageName));
}

export function getItemImageUrl(imageName, size = '366x366', format = 'jpg') {
  const normalized = normalizeItemImageName(imageName);

  if (!normalized) {
    return DEFAULT_ITEM_IMAGE_SRC;
  }

  return `${process.env.NEXT_PUBLIC_YANDEX_IMG || ''}${normalized}_${size}.${format}`;
}

export function getItemImageSrcSet(
  imageName,
  format = 'webp',
  role = 'card',
  baseUrl = process.env.NEXT_PUBLIC_YANDEX_IMG || ''
) {
  const normalized = normalizeItemImageName(imageName);
  const widths = ITEM_IMAGE_WIDTHS_BY_ROLE[role];

  if (!normalized || !widths || !['jpg', 'webp'].includes(format)) {
    return undefined;
  }

  const prefix = baseUrl.endsWith('/') || !baseUrl ? baseUrl : `${baseUrl}/`;

  return widths
    .map(
      (width) => `${prefix}${normalized}_${width}x${width}.${format} ${width}w`
    )
    .join(', ');
}
