import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function CafeLooks({ handleChangeExpanded }) {
  console.log('render CafeLooks');

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
      <Accordion onClick={handleChangeExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              loop={false}
              // onSlideChange={() => console.log('slide change')}
              // onSwiper={(swiper) => console.log(swiper)}
              style={{ width: '100%', height: 'auto' }}
            >
              <SwiperSlide>
                <Image
                  alt=''
                  src="/about/photo_5395851810528411797_y (1).jpg"
                  width={3700}
                  height={1000}
                  priority={true}
                  style={{ width: '100%', height: 'auto' }}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  alt=''
                  src="/about/Ленинградская вид на кассу.jpg"
                  width={3700}
                  height={1000}
                  priority={true}
                  style={{ width: '100%', height: 'auto' }}
                />
              </SwiperSlide>
              
              <SwiperSlide>
                <Image
                  alt=''
                  src="/about/Уборная на Ленинградской.jpg"
                  width={3700}
                  height={1000}
                  priority={true}
                  style={{ width: '100%', height: 'auto' }}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  alt=''
                  src="/about/Куйбышева вид на кассу.jpg"
                  width={3700}
                  height={1000}
                  priority={true}
                  style={{ width: '100%', height: 'auto' }}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  alt=''
                  src="/about/кафе на Цветном.jpg"
                  width={3700}
                  height={1000}
                  priority={true}
                  style={{ width: '100%', height: 'auto' }}
                />
              </SwiperSlide>
            </Swiper>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
