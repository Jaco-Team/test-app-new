import {
  buildImageSrcSet,
  buildImageVariantUrl,
  ImageVariantLocation,
} from '@stories/shared/lib/image/responsiveImage';

export type ProductImageRole = 'card' | 'hero' | 'thumbnail';

export interface ProductImageProfile {
  widths: readonly number[];
  sizes: string;
  fallbackWidth: number;
}

export interface ProductImageSources {
  src: string;
  sizes?: string;
  sources: Array<{ type: string; srcSet: string }>;
}

export const PRODUCT_IMAGE_CDN = 'https://mainimg.jacofood.ru';

export const PRODUCT_IMAGE_PROFILES: Record<
  ProductImageRole,
  ProductImageProfile
> = {
  card: {
    widths: [366, 466, 585, 732, 1168],
    sizes: '(max-width: 800px) 25vw, (max-width: 1000px) 44vw, 22vw',
    fallbackWidth: 585,
  },
  hero: {
    widths: [585, 732, 1168, 1420],
    sizes:
      '(max-width: 768px) 100vw, (max-width: 959px) 90vw, (max-width: 1444px) 50vw, 715px',
    fallbackWidth: 732,
  },
  thumbnail: {
    widths: [366, 466],
    sizes: '(max-width: 600px) 200px, (max-width: 960px) 100px, 140px',
    fallbackWidth: 366,
  },
};

const VARIANT_URL_PATTERN = /^(.*)\/([^/]+)_\d+x\d+\.(?:jpe?g|webp)$/i;

export const parseProductImageLocation = (
  source: string
): ImageVariantLocation | null => {
  const match = source.match(VARIANT_URL_PATTERN);

  if (match) {
    return { baseUrl: match[1], imageId: match[2] };
  }

  if (/^[a-zA-Z0-9_-]+$/.test(source)) {
    return { baseUrl: PRODUCT_IMAGE_CDN, imageId: source };
  }

  return null;
};

export const createProductImageSources = (
  source: string,
  role: ProductImageRole
): ProductImageSources => {
  const location = parseProductImageLocation(source);

  if (!location) {
    return { src: source, sources: [] };
  }

  const profile = PRODUCT_IMAGE_PROFILES[role];

  return {
    src: buildImageVariantUrl({
      ...location,
      width: profile.fallbackWidth,
      format: 'jpg',
    }),
    sizes: profile.sizes,
    sources: [
      {
        type: 'image/webp',
        srcSet: buildImageSrcSet({
          ...location,
          widths: profile.widths,
          format: 'webp',
        }),
      },
      {
        type: 'image/jpeg',
        srcSet: buildImageSrcSet({
          ...location,
          widths: profile.widths,
          format: 'jpg',
        }),
      },
    ],
  };
};
