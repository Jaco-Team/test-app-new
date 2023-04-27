import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';
import { useSwiper } from 'swiper/react';

//SwiperCore.use([Autoplay]);

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { IconRuble } from '@/ui/Icons.js';

import useMediaQuery from '@mui/material/useMediaQuery';

import { useHomeStore } from '../../components/store.js';
import { shallow } from 'zustand/shallow'

export default React.memo(function Banners(){

  const matches = useMediaQuery('screen and (min-width: 40em)', { noSsr: false });



  //console.log( 'swiper', swiper )

  const [ banners, setBanners ] = useState([]);
  const [ bannerList ] = useHomeStore( state => [ state.bannerList ], shallow );

  const [ bannerW, setBannerW ] = useState(0);
  const [ bannerH, setBannerH ] = useState(0);

  const [my_swiper, set_my_swiper] = useState({});

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
      modules={[Autoplay, Navigation, Pagination, A11y]}
      spaceBetween={ 0 }
      slidesPerView={1}
      loop={true}

      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}

      //initialSlide={0}
      //speed={2000}
      onInit={(ev) => {
        set_my_swiper(ev)
        console.log( 'slider start', ev )

        //ev.slideNext();
      }}

      //navigation={true}
      
      pagination={true}
      navigation={{
        nextEl: '.swiper-button-next',
      }}
      scrollbar={{ draggable: true }}

      //nextEl={ () => <SlideNextButton /> }

      //onSlideChange={() => console.log('slide change')}
      //onSwiper={(swiper) => console.log(swiper)}
      style={{ width: !matches ? '100%' : '90%', marginTop: !matches ? 60 : '9vw', borderRadius: '2.4vw' }}
    >
      {banners.map( (item, key) =>
        <SwiperSlide key={key}>
          <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-home-img/"+item.img_new+ (!matches ? "1000х500.jpg" : "3700х1000.jpg")} width={ !matches ? 1000 : 3700 } height={ !matches ? 500 : 1000 } priority={true} style={{ width: '100%', height: 'auto', borderRadius: '2.4vw' }} />
        </SwiperSlide>
      )}
    
      <div className="swiper-button-prev"><button onClick={() => my_swiper.slidePrev()}>Slide to the next slide</button></div>
      <div className="swiper-button-next"><span>Slide to the next slide</span></div>
    </Swiper>
  )
})
