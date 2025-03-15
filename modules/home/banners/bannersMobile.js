import React, { useEffect, useRef } from 'react';
import { useHomeStore, useCitiesStore } from '../../../components/store.js';

import Box from '@mui/material/Box';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default React.memo(function BannersMobile() {
  const [bannerList, setActiveBanner, activeSlider, getBanners] = useHomeStore((state) => [state.bannerList, state.setActiveBanner, state.activeSlider, state.getBanners]);
  const [thisCity, thisCityRu] = useCitiesStore((state) => [ state.thisCity, state.thisCityRu ]);

  const swiperRef = useRef(null);


  useEffect(() => {
    const swiper = document.querySelector('.swiper').swiper;

    const timer = setInterval(() => {
      if(activeSlider){
        swiper.slideNext();
      }
    }, 5000);
    
    return () => clearInterval(timer);
  }, [activeSlider]);

  useEffect(() => {
    if (bannerList?.length > 0) {
      const swiper = document.querySelector('.swiper').swiper;
      swiper.activeIndex = 0;
    }

    if((!bannerList || !bannerList?.length) && thisCity) {
      getBanners('home', thisCity);
    }
    
  }, [bannerList]);

  const openBanner = (item) => {
    setActiveBanner(true, item, swiperRef.current.swiper)

    dataLayer.push({
      "ecommerce": {
        "promoClick": {
          "promotions": [
            {
              "id": item?.id,          
              "name": item?.title,
              "creative": item?.name,
              "position": 1
            }
          ]
        }
      }
    });

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'open_banner', {akcia_name: item?.title});
    }
  }

  return (
    <Box component="div" className="BannerMobile">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={false}
        speed={2500}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        ref={swiperRef}
      >
        {bannerList?.map((item, key) => (
          <SwiperSlide key={key} onClick={() => openBanner(item, swiperRef.current.swiper)}>
            {/* <Image
              alt={item.title}
              src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + item.img + '_1000x500.jpg'}
              width={1000}
              height={500}
              priority={false}
              quality={75}
              loading={'lazy'}
              className="item_banner_image"
            /> */}
            <picture>
              <source 
                type="image/webp" 
                srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img + '_1000x500.jpg'} 
                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
              <source 
                type="image/jpeg" 
                srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img + '_1000x500.jpg'} 
                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

              <img 
                alt={item?.title} 
                title={item?.title} 
                src={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img + '_1000x500.jpg'} 
                loading="lazy"
                className="item_banner_image"
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
});
