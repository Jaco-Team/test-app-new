import React, { useEffect, useRef } from 'react';
import { useHomeStore, useCitiesStore } from '../../../components/store.js';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ArrowIcon, NextIcon } from '@/ui/Icons.js';

export default (function BannersPC() {
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
    if(bannerList?.length > 0){
      const swiper = document.querySelector('.swiper').swiper;
      swiper.activeIndex = 0;
    }
      
    if((!bannerList || bannerList?.length == 0) && thisCity) {
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

    if( thisCityRu == 'Тольятти' ){
      ym(100601350, 'reachGoal', 'open_banner', {akcia_name: item?.title});
    }
  }

  return (
    <Box component="div" className="BannerPC BannerFontPC">

      <Grid className="ImgItem">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={false}
          speed={2500}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          scrollbar={{ draggable: true }}
          // style={{width: !matches ? '100%' : '90.975vw', marginTop: !matches ? 60 : '8.66425vw', borderRadius: '2.8881vw'}}
          style={{width: '90.975vw', marginTop: '8.66425vw'}}
          ref={swiperRef}
        >
          {bannerList?.map((item, key) => (
            <SwiperSlide key={key} dataswiperautoplay="2000" onClick={() => openBanner(item, swiperRef.current.swiper)}>
              {/* <Image alt={item.title} src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}`+item.img+"_3700x1000.jpg"} width={ 3700 } height={ 1000 } priority={true} style={{ width: '100%', height: 'auto', borderRadius: '1.1552346570397vw' }} /> */}
              <picture>
                <source 
                  type="image/webp" 
                  srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img+"_3700x1000.jpg"} 
                  sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                <source 
                  type="image/jpeg" 
                  srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img+"_3700x1000.jpg"} 
                  sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                <img 
                  alt={item?.name} 
                  title={item?.name} 
                  src={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img+"_3700x1000.jpg"} 
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', borderRadius: '1.1552346570397vw' }}
                />
              </picture>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev"><ArrowIcon /></div>
          <div className="swiper-button-next"><NextIcon /></div>
        </Swiper>
      </Grid>


    </Box>
  );
});
