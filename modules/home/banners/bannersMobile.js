import React, { useEffect, useState, useRef } from 'react';

import Box from '@mui/material/Box';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useHomeStore } from '../../../components/store.js';
import { shallow } from 'zustand/shallow';

export default React.memo(function BannersMobile() {
  console.log('BannersMobile render');

  const [banners, setBanners] = useState([]);
  const [bannerList, setActiveBanner] = useHomeStore((state) => [state.bannerList, state.setActiveBanner], shallow);

  const swiperRef = useRef(null);

  useEffect(() => {
    if (banners.length == 0) {
      const filterList = bannerList.filter((banner) => banner.id === '84' || banner.id === '80' || banner.id === '48');

      setBanners(filterList);
    }
  }, [bannerList]);

  if (banners.length == 0) return null;

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
        {banners.map((item, key) => (
          <SwiperSlide key={key} dataswiperautoplay="2000" 
          //onClick={() => setActiveBanner(true, item, swiperRef.current.swiper)}
          >
            <div className="Item" style={{ backgroundColor: item.id === '84' ? '#3faad8' : item.id === '80' ? '#B570DF' : item.id === '48' ? '#F45773' : null}}></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
});
