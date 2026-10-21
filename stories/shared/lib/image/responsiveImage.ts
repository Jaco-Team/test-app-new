export type ResponsiveImageFormat = 'webp' | 'jpg';

export interface ImageVariantLocation {
  baseUrl: string;
  imageId: string;
}

export interface ImageVariantSource extends ImageVariantLocation {
  format: ResponsiveImageFormat;
  widths: readonly number[];
}

export const normalizeImageWidths = (widths: readonly number[]) =>
  [...new Set(widths)]
    .filter((width) => Number.isInteger(width) && width > 0)
    .sort((left, right) => left - right);

export const buildImageVariantUrl = ({
  baseUrl,
  imageId,
  width,
  format,
}: ImageVariantLocation & {
  width: number;
  format: ResponsiveImageFormat;
}) => `${baseUrl.replace(/\/$/, '')}/${imageId}_${width}x${width}.${format}`;

export const buildImageSrcSet = ({
  baseUrl,
  imageId,
  format,
  widths,
}: ImageVariantSource) =>
  normalizeImageWidths(widths)
    .map(
      (width) =>
        `${buildImageVariantUrl({ baseUrl, imageId, width, format })} ${width}w`
    )
    .join(', ');

export const selectImageCandidateWidth = (
  widths: readonly number[],
  renderedWidth: number,
  devicePixelRatio = 1
) => {
  const normalizedWidths = normalizeImageWidths(widths);

  if (normalizedWidths.length === 0) {
    return null;
  }

  const requiredWidth = Math.max(1, renderedWidth * devicePixelRatio);

  return (
    normalizedWidths.find((width) => width >= requiredWidth) ??
    normalizedWidths[normalizedWidths.length - 1]
  );
};
