import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 

import useMediaQuery from '@mui/material/useMediaQuery';

import { useHomeStore } from '../../components/store.js';
import { shallow } from 'zustand/shallow'

export default React.memo(function Banners(){

  const matches = useMediaQuery('screen and (min-width: 40em)', { noSsr: false });

  const [ banners, setBanners ] = useState([]);
  const [ bannerList ] = useHomeStore( state => [ state.bannerList ], shallow );

  const [ bannerW, setBannerW ] = useState(0);
  const [ bannerH, setBannerH ] = useState(0);

  useEffect( () => {
    if( banners.length == 0 ){
      let windowOuterWidth = window.outerWidth;

      setBannerW(windowOuterWidth)
      setBannerH( matches ? Math.round(windowOuterWidth / 3.7) : Math.round(windowOuterWidth / 2) )

      setBanners(bannerList);
    }
  }, [bannerList] )

  return (
    <Swiper
      spaceBetween={ !matches ? 0 : 50 }
      slidesPerView={1}
      loop={true}
      //onSlideChange={() => console.log('slide change')}
      //onSwiper={(swiper) => console.log(swiper)}
      style={{ width: '100%', marginTop: !matches ? 60 : 100 }}
    >
      {banners.map( (item, key) =>
        <SwiperSlide key={key}>
          <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-home-img/"+item.img_new+ (!matches ? "1000х500.jpg" : "3700х1000.jpg")} width={bannerW} height={bannerH} priority={true} style={{ width: '100%', height: 'auto' }} />
        </SwiperSlide>
      )}
    
    </Swiper>
  )
})
