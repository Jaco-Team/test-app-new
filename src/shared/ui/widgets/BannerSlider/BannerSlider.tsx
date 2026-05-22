import type { HTMLAttributes } from 'react';
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
}

export function BannerSlider({
  slides = [],
  className,
  ...props
}: BannerSliderProps) {
  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('ui-banner-slider', className)}
      aria-label="Баннеры"
      {...props}
    >
      <div className="ui-banner-slider__track">
        {slides.map((slide) => (
          <article key={slide.id} className="ui-banner-slider__slide">
            <picture>
              {slide.imageWide ? (
                <source
                  media="(min-width: 991px)"
                  srcSet={slide.imageWide}
                  type="image/jpeg"
                />
              ) : null}
              <img src={slide.image} alt={slide.alt ?? ''} loading="lazy" />
            </picture>
          </article>
        ))}
      </div>
    </section>
  );
}
