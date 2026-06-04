'use client';

import type { HTMLAttributes } from 'react';
import { useRef } from 'react';
import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ArrowIcon, NextIcon } from '@ui/icons/Icons';
import { cn } from '../../foundation/classNames';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
  intervalMs = 5000,
  onSlideClick,
  className,
  ...props
}: BannerSliderProps) {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const hasMultipleSlides = slides.length > 1;

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('ui-banner-slider', className)}
      aria-label="Баннеры"
      {...props}
    >
      <Swiper
        key={slides.length}
        className="ui-banner-slider__swiper"
        modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
        slidesPerView={1}
        spaceBetween={12}
        breakpoints={{
          668: {
            spaceBetween: 12,
          },
          991: {
            spaceBetween: 0,
          },
        }}
        loop={hasMultipleSlides}
        grabCursor={hasMultipleSlides}
        speed={2500}
        autoplay={
          hasMultipleSlides
            ? { delay: intervalMs, disableOnInteraction: false }
            : false
        }
        pagination={{
          el: paginationRef.current,
          clickable: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation === 'object') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
          if (typeof swiper.params.pagination === 'object') {
            swiper.params.pagination.el = paginationRef.current;
          }
        }}
        onInit={(swiper) => {
          swiper.navigation.init();
          swiper.navigation.update();
          swiper.pagination.init();
          swiper.pagination.render();
          swiper.pagination.update();
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <button
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
                  draggable={false}
                />
              </picture>
            </button>
          </SwiperSlide>
        ))}

        {hasMultipleSlides ? (
          <>
            <div
              ref={prevRef}
              className="ui-banner-slider__nav ui-banner-slider__nav--prev swiper-button-prev"
              aria-hidden
            >
              <ArrowIcon />
            </div>
            <div
              ref={nextRef}
              className="ui-banner-slider__nav ui-banner-slider__nav--next swiper-button-next"
              aria-hidden
            >
              <NextIcon />
            </div>
            <div
              ref={paginationRef}
              className="ui-banner-slider__pagination swiper-pagination"
            />
          </>
        ) : null}
      </Swiper>
    </section>
  );
}
