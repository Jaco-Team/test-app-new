import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ArrowIcon, NextIcon } from '@/ui/Icons.js';

import useMediaQuery from '@mui/material/useMediaQuery';

import { useHomeStore } from '../../components/store.js';
import { shallow } from 'zustand/shallow'

export default React.memo(function Banners(){

  const matches = useMediaQuery('screen and (min-width: 40em)', { noSsr: false });

  const [ banners, setBanners ] = useState([]);
  const [ bannerList, setActiveBanner ] = useHomeStore( state => [ state.bannerList, state.setActiveBanner ], shallow );

  useEffect( () => {
    if( banners.length == 0 ){
      setBanners(bannerList);
    }
  }, [bannerList] )

  if( banners.length == 0 ){
    return null
  }

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
      spaceBetween={ 0 }
      slidesPerView={1}
      loop={true}

      autoplay={{
        //delay: 2500,
        disableOnInteraction: false,
      }}

      speed={2500}
      
      pagination={true}
      navigation={{
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
      }}
      scrollbar={{ draggable: true }}
      style={{ width: !matches ? '100%' : '90%', marginTop: !matches ? 60 : '9vw', borderRadius: '2.4vw' }}
    >
      {banners.map( (item, key) =>
        <SwiperSlide key={key} dataswiperautoplay="2000" onClick={() => setActiveBanner(true, item)} style={{ cursor: 'pointer'}}>
          <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-home-img/"+item.img_new+ (!matches ? "1000х500.jpg" : "3700х1000.jpg")} width={ !matches ? 1000 : 3700 } height={ !matches ? 500 : 1000 } priority={true} style={{ width: '100%', height: 'auto', borderRadius: '2.4vw' }} />
        </SwiperSlide>
      )}
    
      <div className="swiper-button-prev"><ArrowIcon width={45} height={45} /></div>
      <div className="swiper-button-next"><NextIcon width={45} height={45} /></div>
    </Swiper>
  )
})
