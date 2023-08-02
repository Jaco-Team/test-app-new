import React, { useEffect, useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ArrowIcon, NextIcon } from '@/ui/Icons.js';

import { useHomeStore } from '../../../components/store.js';

export default React.memo(function BannersPC() {
  //console.log('BannersPC render')
  
  const [banners, setBanners] = useState([]);
  const [bannerList, setActiveBanner] = useHomeStore((state) => [state.bannerList, state.setActiveBanner]);

  const swiperRef = useRef(null);

  useEffect(() => {
    if (banners.length == 0) {
      const filterList = bannerList.filter((banner) => banner.id === '84' || banner.id === '80' || banner.id === '48');
      setBanners(filterList);
    }
  }, [bannerList]);
  
  if (banners.length == 0) return null;

  return (
    <Box component="div" className="BannerPC BannerFontPC">
      <Grid className="ImgItem">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ disableOnInteraction: false }}
          speed={2500}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          scrollbar={{ draggable: true }}
          // style={{width: !matches ? '100%' : '90.975vw', marginTop: !matches ? 60 : '8.66425vw', borderRadius: '2.8881vw'}}
          style={{width: '90.975vw', marginTop: '8.66425vw', borderRadius: '2.8881vw'}}
          ref={swiperRef}
        >

          {banners.map((item, key) => (
            <SwiperSlide key={key} dataswiperautoplay="2000" onClick={() => setActiveBanner(true, item, (swiperRef.current).swiper)}>
              {/* <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-home-img/"+item.img_new+ (!matches ? "1000х500.jpg" : "3700х1000.jpg")} width={ !matches ? 1000 : 3700 } height={ !matches ? 500 : 1000 } priority={true} style={{ width: '100%', height: 'auto', borderRadius: '2.4vw' }} /> */}
              <div className="Item" style={{ backgroundColor: item.id === '84' ? '#3faad8' : item.id === '80' ? '#B570DF' : item.id === '48' ? '#F45773' : null}}>
                <div className="Group">
                  {item.id === '84' ? (
                    <Button variant="contained" className="ItemOther"><span>1 330</span>1 125 ₽</Button>
                  ) : item.id === '80' ? (
                    <Button variant="contained" className="ItemOther">В корзину</Button>
                  ) : null}
                  <Typography className="ItemOther" variant="h5" component="span">Условия акции<KeyboardArrowDownIcon /></Typography>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev"><ArrowIcon width='2.166065vw' height='2.166065vw' /></div>
          <div className="swiper-button-next"><NextIcon width='2.166065vw' height='2.166065vw' /></div>
        </Swiper>
      </Grid>
    </Box>
  );
});
