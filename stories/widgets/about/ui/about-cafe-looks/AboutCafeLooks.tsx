import Image from 'next/image';
import Typography from '@mui/material/Typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper';
import 'swiper/css';

import { ABOUT_CAFE_GALLERY_SLIDES } from '@stories/widgets/about/model/cafe-gallery';

export const AboutCafeLooks = () => (
  <section className="about-page__section" id="tag3">
    <Typography variant="h2" component="h2">
      Как выглядит кафе
    </Typography>
    <p>
      У нас можно отдохнуть с друзьями или семьёй, провести деловую встречу или
      собеседование. Особенностью наших кафе является большая открытая кухня: вы
      можете наблюдать, в каких условиях готовятся блюда. На наших кухнях всегда
      чисто, и мы честно проходим все проверки Роспотребнадзора.
    </p>

    <Swiper
      modules={[Autoplay, Scrollbar]}
      spaceBetween={50}
      slidesPerView={1}
      loop
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      scrollbar={{ draggable: true }}
      style={{ width: '100%', height: 'auto' }}
    >
      {ABOUT_CAFE_GALLERY_SLIDES.map((item) => (
        <SwiperSlide key={item.img}>
          <Image
            alt={item.comment}
            src={item.img}
            width={1280}
            height={720}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
          <p className="about-page__swiper-caption">{item.comment}</p>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);
