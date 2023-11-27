import React, { useEffect, useRef } from 'react';

import Image from 'next/image';

import Box from '@mui/material/Box';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useHomeStore } from '../../../components/store.js';

export default React.memo(function BannersMobile() {
  const [bannerList, setActiveBanner] = useHomeStore((state) => [state.bannerList, state.setActiveBanner]);

  const swiperRef = useRef(null);

  useEffect(() => {
    swiperRef.current.swiper.autoplay.start();
  }, []);

  return (
    <Box component="div" className="BannerMobile">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ disableOnInteraction: false }}
        speed={2500}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        ref={swiperRef}
      >
        {bannerList.map((item, key) => (
          <SwiperSlide key={key} dataswiperautoplay="2000" onClick={() => setActiveBanner(true, item, swiperRef.current.swiper)}>
            <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-home-img/"+item.img_new+"1000х500.jpg"} width={ 1000 } height={ 500 } priority={true} className="Item" />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
});
