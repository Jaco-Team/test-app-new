'use client';

import type { HTMLAttributes } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../foundation/classNames';
import './BannerSlider.scss';

export interface BannerSliderSlide {
  id: string;
  image: string;
  imageWide?: string;
  alt?: string;
}

export interface BannerSliderProps extends HTMLAttributes<HTMLElement> {
  slides?: BannerSliderSlide[];
  intervalMs?: number;
  onSlideClick?: (slide: BannerSliderSlide, index: number) => void;
}

export function BannerSlider({
  slides = [],
  intervalMs = 5200,
  onSlideClick,
  className,
  ...props
}: BannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, intervalMs, slides.length]);

  useEffect(() => {
    if (activeIndex > slides.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  const offset = useMemo(
    () => `translateX(-${activeIndex * 100}%)`,
    [activeIndex]
  );

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('ui-banner-slider', className)}
      aria-label="Баннеры"
      {...props}
    >
      <div className="ui-banner-slider__viewport">
        <div className="ui-banner-slider__track" style={{ transform: offset }}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className="ui-banner-slider__slide"
              type="button"
              aria-label={slide.alt ?? `Баннер ${index + 1}`}
              onClick={() => onSlideClick?.(slide, index)}
            >
              <picture>
                {slide.imageWide ? (
                  <source
                    media="(min-width: 991px)"
                    srcSet={slide.imageWide}
                    type="image/jpeg"
                  />
                ) : null}
                <img
                  src={slide.image}
                  alt={slide.alt ?? ''}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </picture>
            </button>
          ))}
        </div>
      </div>

      {hasMultipleSlides ? (
        <div className="ui-banner-slider__dots" aria-label="Навигация баннеров">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={cn(
                'ui-banner-slider__dot',
                index === activeIndex && 'ui-banner-slider__dot--active'
              )}
              type="button"
              aria-label={`Показать баннер ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
