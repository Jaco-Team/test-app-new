import { useState } from 'react';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper';
import 'swiper/css';

import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const arrayImage = [
  {
    img: '/about/анастасия.jpg',
    comment:
      'Касса и кухня кафе на Ленинградской 47 (Тольятти), за кассой — Анастасия',
  },
  {
    img: '/about/ленинградская.jpg',
    comment: 'Интерьер кафе на Ленинградской 47 (Тольятти)',
  },
  {
    img: '/about/уборная.jpg',
    comment: 'Уборная на Ленинградской 47 (Тольятти)',
  },
  {
    img: '/about/куйбышева.jpg',
    comment: 'Интерьер кафе на Куйбышева 113 (Самара)',
  },
  {
    img: '/about/цветной.jpg',
    comment: 'Интерьер кафе на Цветном 1 (Тольятти)',
  },
];

export default function CafeLooks({ handleChangeExpanded }) {

  const [expanded, setExpanded] = useState(false);

  const changeExpanded = () => {
    setExpanded(!expanded);
    handleChangeExpanded();
  };

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
      <Accordion expanded={expanded} style={{ width: '100%', height: 'auto' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={changeExpanded}>
          <Typography variant="h2">Как выглядит кафе</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid item xs={12}>
            <p>
              У нас можно отдохнуть с друзьями или семьёй, провести деловую
              встречу или собеседование. Особенностью наших кафе является
              большая открытая кухня: вы можете наблюдать, в каких условиях
              готовятся блюда. На наших кухнях всегда чисто, и мы честно
              проходим все проверки Роспотребнадзора.
            </p>
          </Grid>
          <Grid item xs={12}>
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
                    <Grid item xs={12} display="flex" justifyContent="center">
                      <p style={{ whiteSpace: 'normal', textAlign: 'center' }}>
                        {item.comment}
                      </p>
                    </Grid>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
