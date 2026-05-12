import './BannerList.scss';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ArrowIcon, NextIcon } from '@stories/shared/Icons.js';
import { bannerListProps } from '@stories/widgets/home/ui/banner-list/model/types';
import { BannerImg } from '@stories/entities/promotion/ui/promotion-image/BannerImg';
import { JSX } from 'react';

export const BannerList: ({
  bannerList,
}: {
  bannerList: any;
}) => JSX.Element = ({ bannerList }) => {
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
          <SwiperSlide key={key} data-swiper-autoplay="2000" onClick={() => {}}>
            <BannerImg
              img={
                item.type_illustration === 'video'
                  ? `https://storage.yandexcloud.net/site-home-img/${item.img}_video_1920x1080.mp4`
                  : `https://storage.yandexcloud.net/site-home-img/${item.img}_3700x1000.jpg`
              }
              title={item.title}
              type="banner"
            />
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev">
          <ArrowIcon />
        </div>
        <div className="swiper-button-next">
          <NextIcon />
        </div>
      </Swiper>
    </div>
  );
};
