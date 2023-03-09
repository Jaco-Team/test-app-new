import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 

import { useHomeStore } from '../../components/store.js';
import { shallow } from 'zustand/shallow'

export default React.memo(function Banners(){

  const [ banners, setBanners ] = useState([]);
  const [ bannerList ] = useHomeStore( state => [ state.bannerList ], shallow );

  useEffect( () => {
    if( banners.length == 0 ){
      setBanners(bannerList);
    }
  }, [bannerList] )

  //console.log( 'load_banners load_bannersload_banners' )

  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      loop={true}
      //onSlideChange={() => console.log('slide change')}
      //onSwiper={(swiper) => console.log(swiper)}
      style={{ width: '100%', marginTop: 100 }}
    >
      {banners.map( (item, key) =>
        <SwiperSlide key={key}>
          <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-home-img/"+item.img_new+"3700х1000.jpg"} width={3700} height={1000} priority={true} style={{ width: '100%', height: 'auto' }} />
        </SwiperSlide>
      )}
    
    </Swiper>
  )
})