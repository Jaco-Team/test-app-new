import React, { useEffect, useRef } from 'react';
import { useHomeStore, useCitiesStore } from '../../../components/store.js';
// import Image from 'next/image';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
//import Tooltip from '@mui/material/Tooltip';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ArrowIcon, NextIcon } from '@/ui/Icons.js';

export default (function BannersPC() {
  const [bannerList, setActiveBanner, activeSlider, getBanners] = useHomeStore((state) => [state.bannerList, state.setActiveBanner, state.activeSlider, state.getBanners]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  //const [setActiveModalAlert] = useHeaderStore((state) => [state.setActiveModalAlert]);

  const swiperRef = useRef(null);

  // const [openTooltip, setOpenTooltip] = useState(false);

  useEffect(() => {
    const swiper = document.querySelector('.swiper').swiper;

    const timer = setInterval(() => {
      if(activeSlider){
        console.log('useEffect swiper.slideNext()')
        swiper.slideNext();
      }
    }, 5000);
    
    return () => clearInterval(timer);
  }, [activeSlider]);

  useEffect(() => {
    if(bannerList?.length > 0){
      const swiper = document.querySelector('.swiper').swiper;
      swiper.activeIndex = 0;
    }
      
    if((!bannerList || !bannerList?.length) && thisCity) {
      getBanners('home', thisCity);
    }

  }, [bannerList]);

  // const handleOpen = () => {
  //   setOpenTooltip(true);
  // };
 
  // const handleClose = () => {
  //   setOpenTooltip(false);
  // };

  // const handleCopy = (text) => {
  //   setOpenTooltip(false);
  //   setActiveModalAlert(true, 'Ссылка успешно скопирована', true);
  //   //window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  //   navigator.clipboard.writeText(text)
  // }

  /*
    <div className="Item" style={{ backgroundColor: item.id === '84' ? '#3faad8' : item.id === '80' ? '#B570DF' : item.id === '48' ? '#F45773' : null}}>
                <div className="Group">
                  {item.id === '84' ? (
                    <Button variant="contained" className="ItemOther"><span>1 330</span>1 125 ₽</Button>
                  ) : item.id === '80' ? (
                    <Button variant="contained" className="ItemOther">В корзину</Button>
                  ) : null}
                  <Typography className="ItemOther spanButton" variant="h5" component="span">Условия акции<KeyboardArrowDownIcon /></Typography>
                </div>
              </div>
  */

  /*
                    <Tooltip
                  open={openTooltip}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  title={<span className='spanTitle'>Рекламодатель:<br /> {item?.org}<br /> ИНН {item?.inn}<br /> erid: {item?.erid}<br /> <span style={{ color: '#cc0033', textDecoration: 'underline', cursor: 'pointer' }} onClick={ () => handleCopy(item.erid) }><span>Копировать ссылку</span></span> </span>} 
                  arrow placement="top" 
                  className='eridBannerPC'
                    componentsProps={{
                      tooltip: {
                        sx: { 
                          bgcolor: '#fff', 
                          color: 'rgba(0, 0, 0, 0.80)',
                          width: '10.830324909747vw',
                          borderRadius: '1.0830324909747vw',
                          p: '1.0830324909747vw',
                          '& .MuiTooltip-arrow': {
                            color: '#fff',
                            '&::before': {
                              backgroundColor: 'white',
                            },
                          },
                        },
                      },
                    }}
                >
                  <span className='titleDots'>
                    <span className="ItemDesk text">Реклама</span>
                    <span className='spanContainer'>
                      <span>•</span>
                      <span>•</span>
                      <span>•</span>
                    </span>
                  </span>
                </Tooltip>
  */

                    //

  return (
    <Box component="div" className="BannerPC BannerFontPC">

      <Grid className="ImgItem">
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
          // style={{width: !matches ? '100%' : '90.975vw', marginTop: !matches ? 60 : '8.66425vw', borderRadius: '2.8881vw'}}
          style={{width: '90.975vw', marginTop: '8.66425vw'}}
          ref={swiperRef}
        >
          {bannerList?.map((item, key) => (
            <SwiperSlide key={key} dataswiperautoplay="2000" onClick={() => setActiveBanner(true, item, swiperRef.current.swiper)}>
              {/* <Image alt={item.title} src={"https://storage.yandexcloud.net/site-home-img/"+item.img+"_3700x1000.jpg"} width={ 3700 } height={ 1000 } priority={true} style={{ width: '100%', height: 'auto', borderRadius: '1.1552346570397vw' }} /> */}
              <picture>
                <source 
                  type="image/webp" 
                  srcSet={"https://storage.yandexcloud.net/site-home-img/"+item.img+"_3700x1000.jpg"} 
                  sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                <source 
                  type="image/jpeg" 
                  srcSet={"https://storage.yandexcloud.net/site-home-img/"+item.img+"_3700x1000.jpg"} 
                  sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                <img 
                  alt={item?.name} 
                  title={item?.name} 
                  src={"https://storage.yandexcloud.net/site-home-img/"+item.img+"_3700x1000.jpg"} 
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', borderRadius: '1.1552346570397vw' }}
                />
              </picture>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev"><ArrowIcon /></div>
          <div className="swiper-button-next"><NextIcon /></div>
        </Swiper>
      </Grid>


    </Box>
  );
});
