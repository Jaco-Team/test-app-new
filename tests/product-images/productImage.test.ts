import { describe, expect, it } from 'vitest';

import {
  buildImageSrcSet,
  selectImageCandidateWidth,
} from '@stories/shared/lib/image/responsiveImage';
import {
  createProductImageSources,
  parseProductImageLocation,
  PRODUCT_IMAGE_PROFILES,
} from '@stories/entities/product/model/productImage';

describe('responsive image source contract', () => {
  it('uses the actual file width in every srcset descriptor', () => {
    const srcSet = buildImageSrcSet({
      baseUrl: 'https://mainimg.jacofood.ru',
      imageId: 'Vodopad_set',
      format: 'webp',
      widths: [732, 366, 466, 466],
    });

    expect(srcSet.split(', ')).toEqual([
      'https://mainimg.jacofood.ru/Vodopad_set_366x366.webp 366w',
      'https://mainimg.jacofood.ru/Vodopad_set_466x466.webp 466w',
      'https://mainimg.jacofood.ru/Vodopad_set_732x732.webp 732w',
    ]);
  });

  it('selects the smallest candidate covering the rendered pixel width', () => {
    const widths = PRODUCT_IMAGE_PROFILES.card.widths;

    expect(selectImageCandidateWidth(widths, 214, 2)).toBe(466);
    expect(selectImageCandidateWidth(widths, 303, 2)).toBe(732);
    expect(selectImageCandidateWidth(widths, 416, 2)).toBe(875);
  });

  it('uses the largest candidate only when no candidate covers the slot', () => {
    expect(selectImageCandidateWidth([366, 466], 300, 2)).toBe(466);
    expect(selectImageCandidateWidth([], 300, 2)).toBeNull();
  });

  it('recovers the image id and host from an existing variant URL', () => {
    expect(
      parseProductImageLocation(
        'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg'
      )
    ).toEqual({
      baseUrl: 'https://mainimg.jacofood.ru',
      imageId: 'Filadelfiia_Lait',
    });
  });

  it('keeps a non-variant source as a single fallback resource', () => {
    expect(createProductImageSources('/images/product.jpg', 'hero')).toEqual({
      src: '/images/product.jpg',
      sources: [],
    });
  });

  it.each(Object.entries(PRODUCT_IMAGE_PROFILES))(
    'builds ordered WebP and JPEG sources for the %s profile',
    (role, profile) => {
      const result = createProductImageSources(
        'Vodopad_set',
        role as keyof typeof PRODUCT_IMAGE_PROFILES
      );

      expect(result.sizes).toBe(profile.sizes);
      expect(result.sources.map(({ type }) => type)).toEqual([
        'image/webp',
        'image/jpeg',
      ]);

      result.sources.forEach(({ srcSet }) => {
        const descriptors = srcSet
          .split(', ')
          .map((candidate) => Number(candidate.match(/ (\d+)w$/)?.[1]));

        expect(descriptors).toEqual(profile.widths);
      });
    }
  );
});
