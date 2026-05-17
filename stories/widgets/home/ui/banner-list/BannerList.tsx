import './BannerList.scss';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ArrowIcon, NextIcon } from '@stories/shared/Icons.js';
import { BannerImg } from '@stories/entities/promotion/ui/promotion-image/BannerImg';
import { JSX } from 'react';
import { PromoModal } from '@stories/widgets/home/ui/banner-modal/PromoModal';
import { useState } from 'react';
import { Banner, bannerListProps } from './model/types';

export const BannerList: ({ bannerList }: bannerListProps) => JSX.Element = ({
  bannerList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState<Banner | null>(null);
  return (
    <div className="HomeImgPC">
      <PromoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Влюбиться по-новому"
        subtitle="Филадельфия опалённая с молодым шпинатом"
        badgeText="НОВИНКА"
        price={529}
        bannerImage={`https://storage.yandexcloud.net/site-home-img/${item?.img || ''}_3700x1000.jpg`}
        productImage="https://mainimg.jacofood.ru/Filadelfiia_opalionnaia_732x732.webp"
        productName="Филадельфия опалённая"
        productDescription="Опалённый лосось, сливочный творожный сыр..."
        marketingTitle={item?.title || ''}
        marketingDescription={item?.text || ''}
        endDate="31.05.2026"
      />
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
          <SwiperSlide
            key={key}
            data-swiper-autoplay="2000"
            onClick={() => {
              setItem(item);
              setIsModalOpen(true);
            }}
          >
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
