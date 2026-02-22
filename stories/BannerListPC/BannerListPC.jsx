import PropTypes from 'prop-types';
import './BannerListPC.scss';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ArrowIcon, NextIcon } from '../Icons';

import { BannerPCImg } from '../BannerPCImg/BannerPCImg';

export const BannerListPC = ({ bannerList }) => {

  /*const swiperRef = useRef(null);

  useEffect(() => {
    if( bannerList.length > 0 ){
      const swiper = document.querySelector('.swiper').swiper;
      swiper.activeIndex = 0;
    }
  }, [bannerList]);*/

  //setActiveBanner(true, item, swiperRef.current.swiper)

  return (
    <div className="HomeImgPC">
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
      >
        {bannerList.map((item, key) => (
          <SwiperSlide key={key} dataswiperautoplay="2000" onClick={() => {} }>
            <BannerPCImg 
              img={"https://storage.yandexcloud.net/site-home-img/"+item.img+"_3700x1000.jpg"} 
              type='banner'
            />
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev"><ArrowIcon /></div>
        <div className="swiper-button-next"><NextIcon /></div>
      </Swiper>
    </div>
  );
};

BannerListPC.propTypes = {
  bannerList: PropTypes.array.isRequired,
};
