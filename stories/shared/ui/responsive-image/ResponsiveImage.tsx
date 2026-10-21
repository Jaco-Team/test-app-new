import { CSSProperties, SyntheticEvent, useState } from 'react';

import './ResponsiveImage.scss';

export type ResponsiveImageState = 'loading' | 'loaded' | 'error' | 'missing';

export interface ResponsiveImageProps {
  src?: string;
  sources?: Array<{ type: string; srcSet: string }>;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  fallbackSrc: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  onStateChange?: (state: ResponsiveImageState) => void;
}

export const ResponsiveImage = ({
  src,
  sources = [],
  sizes,
  alt,
  width,
  height,
  fallbackSrc,
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
  onStateChange,
}: ResponsiveImageProps) => {
  const [imageState, setImageState] = useState<{
    source?: string;
    value: ResponsiveImageState;
  }>({ source: src, value: src ? 'loading' : 'missing' });

  const state =
    imageState.source === src ? imageState.value : src ? 'loading' : 'missing';
  const isFallback = state === 'error' || state === 'missing';
  const displayedSource = isFallback ? fallbackSrc : src;

  const updateState = (value: ResponsiveImageState) => {
    setImageState({ source: src, value });
    onStateChange?.(value);
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!isFallback) {
      updateState('loaded');
    }
  };

  const handleError = () => {
    if (!isFallback) {
      updateState('error');
    }
  };

  const style = {
    '--responsive-image-ratio': `${width} / ${height}`,
  } as CSSProperties;

  return (
    <span
      className={['ResponsiveImage', className].filter(Boolean).join(' ')}
      data-image-state={state}
      style={style}
    >
      {state === 'loading' && (
        <span className="ResponsiveImage-skeleton" aria-hidden="true" />
      )}

      <picture>
        {!isFallback &&
          sources.map((source) => (
            <source
              key={source.type}
              type={source.type}
              srcSet={source.srcSet}
              sizes={sizes}
            />
          ))}
        <img
          src={displayedSource}
          alt={alt}
          width={width}
          height={height}
          sizes={!isFallback ? sizes : undefined}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
    </span>
  );
};
