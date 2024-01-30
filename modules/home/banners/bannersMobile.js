import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Box from '@mui/material/Box';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useHomeStore, useHeaderStore } from '../../../components/store.js';
import { VerticalVector } from '@/ui/Icons.js';

export default React.memo(function BannersMobile() {
  const [bannerList, setActiveBanner, activeSlider] = useHomeStore((state) => [state.bannerList, state.setActiveBanner, state.activeSlider]);
  const [setActiveModalAlert] = useHeaderStore((state) => [state.setActiveModalAlert]);

  const swiperRef = useRef(null);

  const [openTooltip, setOpenTooltip] = useState(false);
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    const swiper = document.querySelector('.swiper').swiper;

    const timer = setInterval(() => {
      if(activeSlider && !openTooltip){
        swiper.slideNext();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [openTooltip]);

  useEffect(() => {
    if (bannerList.length > 0) {
      const swiper = document.querySelector('.swiper').swiper;
      swiper.activeIndex = 0;
    }
  }, [bannerList]);

  const setActiveTooltip = (active) => {
    setOpenTooltip(active);
  };

  useEffect(() => {

    const checkClickOutside = e => {

      const list = e.target.classList.contains("erid_svg_mobile") || e.target.classList.contains("erid_text_mobile") || e.target.classList.contains("erid_banner_mobile")

      if (list) {
        setActiveTooltip(true);
        swiperRef.current.swiper.autoplay.stop();
      } else {

        const copy = e.target.classList.contains("tooltip_banner_mobile") || e.target.classList.contains("tooltip_text_mobile") || e.target.classList.contains("tooltip_copy_mobile")

        if(copy) {
          setActiveModalAlert(true, 'Ссылка успешно скопирована', true);
        }

        const item = e.target.classList.contains("item_banner_image");

        if(item && !openTooltip) {
          setActiveBanner(true, banner, swiperRef.current.swiper)
        }

        setActiveTooltip(false);
      }
    }

    document.addEventListener("click", checkClickOutside);
    return () => document.removeEventListener("click", checkClickOutside);

  }, [banner, openTooltip])

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
        {bannerList.map((item, key) => (
          <SwiperSlide key={key} onClick={() => setBanner(item)}>
            <Image
              alt={item.promo_title}
              src={'https://storage.yandexcloud.net/site-home-img/' + item.img_new + '1000х500.jpg'}
              width={1000}
              height={500}
              priority={true}
              className="item_banner_image"
            />

            {!openTooltip ? null :
              <div className='tooltip_banner_mobile'>
                <span className='tooltip_text_mobile'>{`Рекламодатель:\n\ООО "Мистер Жако"\n\ИНН 6321390811\n\erid: ${item.erid}`}</span>
                <span className='tooltip_copy_mobile'>Копировать ссылку</span>
              </div>
            }

            <div onClick={() => setActiveTooltip(true)} className="erid_banner_mobile">
              <span className="erid_text_mobile">Реклама</span>
              <VerticalVector className='erid_svg_mobile' />
            </div>

          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
});
