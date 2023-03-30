import { useState } from 'react';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper';
import 'swiper/css';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

const arrayImage = [
  {
    img: '/about/slide1.png',
    comment: 'Интерьер кафе на Ленинградской 47 (Тольятти)',
  },
  {
    img: '/about/slide2.png',
    comment: 'Интерьер кафе на Куйбышева 113 (Самара)',
  },
  {
    img: '/about/slide3.png',
    comment: 'Интерьер кафе на Цветном 1 (Тольятти)',
  },
  {
    img: '/about/slide5.jpg',
    comment: 'Касса и кухня кафе на Ленинградской 47 (Тольятти), за кассой — Анастасия',
  },
  {
    img: '/about/slide4.png',
    comment: 'Уборная на Ленинградской 47 (Тольятти)',
  },
];

export default function CafeLooks({ handleChangeExpanded }) {

  const [expanded, setExpanded] = useState(false);

  const changeExpanded = () => {
    setExpanded(!expanded);
    handleChangeExpanded();
  };

  return (
    <Grid item xs={12} id={'tag3'}>
      <Typography variant="h2">Как выглядит кафе</Typography>
      <p>
        У нас можно отдохнуть с друзьями или семьёй, провести деловую
        встречу или собеседование. Особенностью наших кафе является
        большая открытая кухня: вы можете наблюдать, в каких условиях
        готовятся блюда. На наших кухнях всегда чисто, и мы честно
        проходим все проверки Роспотребнадзора.
      </p>
      
      <Swiper
        modules={[Autoplay, Scrollbar]}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{delay: 4000, disableOnInteraction: false}}
        scrollbar={{ draggable: true }}
        style={{ width: '100%', height: 'auto' }}
      >
        {arrayImage.map((item, key) => (
          <SwiperSlide key={key}>
            <Image
              alt=""
              src={item.img}
              width={1280}
              height={720}
              priority={true}
              style={{ width: '100%', height: 'auto' }}
            />
            <p style={{ whiteSpace: 'normal', textAlign: 'center', fontWeight: 300 }}>{item.comment}</p>
          </SwiperSlide>
        ))}
      </Swiper>
        
    </Grid>
  );

  return (
    <Accordion className={'MyAccordion'}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={changeExpanded}>
        <Typography variant="h2">Как выглядит кафе</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          У нас можно отдохнуть с друзьями или семьёй, провести деловую
          встречу или собеседование. Особенностью наших кафе является
          большая открытая кухня: вы можете наблюдать, в каких условиях
          готовятся блюда. На наших кухнях всегда чисто, и мы честно
          проходим все проверки Роспотребнадзора.
        </p>
        
        {expanded && (
          <Swiper
            modules={[Autoplay, Scrollbar]}
            spaceBetween={50}
            slidesPerView={1}
            loop={true}
            autoplay={{delay: 4000, disableOnInteraction: false}}
            scrollbar={{ draggable: true }}
            style={{ width: '100%', height: 'auto' }}
          >
            {arrayImage.map((item, key) => (
              <SwiperSlide key={key}>
                <Image
                  alt=""
                  src={item.img}
                  width={3700}
                  height={1000}
                  priority={true}
                  style={{ width: '100%', height: 'auto' }}
                />
                <p style={{ whiteSpace: 'normal', textAlign: 'center', fontWeight: 300 }}>{item.comment}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
