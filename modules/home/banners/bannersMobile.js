import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { useHomeStore, useCitiesStore } from '../../../components/store.js';

import Box from '@mui/material/Box';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// export default React.memo(function BannersMobile() {
//   const [bannerList, setActiveBanner, activeSlider, getBanners] = useHomeStore((state) => [state.bannerList, state.setActiveBanner, state.activeSlider, state.getBanners]);
//   const [thisCity, thisCityRu] = useCitiesStore((state) => [ state.thisCity, state.thisCityRu ]);

//   const swiperRef = useRef(null);

//   useEffect(() => {

//     if((!bannerList || !bannerList.length) && thisCity) {
//       getBanners('home', thisCity);
//     }

//   }, [bannerList, thisCity, getBanners]);

//   useEffect(() => {
//     const swiper = swiperRef.current?.swiper;

//     if (bannerList && bannerList.length > 0 && swiper) {

//       swiper.update();
//       swiper.slideTo(0);

//       setTimeout(() => {
//         if (activeSlider && swiper.autoplay) {
//           swiper.autoplay.start();
//         }
//       }, 50);

//     }
  
//   }, [bannerList, activeSlider]);

//   const homeBanners = bannerList?.filter(item => parseInt(item.is_active_home) === 1);

  // const openBanner = (item) => {
  //   setActiveBanner(true, item, swiperRef.current.swiper)

  //   ymDataLayer.push({
  //     "ecommerce": {
  //       "promoClick": {
  //         "promotions": [
  //           {
  //             "id": item?.id,          
  //             "name": item?.title,
  //             "creative": item?.name,
  //             "position": 1
  //           }
  //         ]
  //       }
  //     }
  //   });

  //   if( thisCityRu == 'Самара' ){
  //     ym(100325084, 'reachGoal', 'open_banner', {akcia_name: item?.title});
  //   }

  //   if( thisCityRu == 'Тольятти' ){
  //     ym(100601350, 'reachGoal', 'open_banner', {akcia_name: item?.title});
  //   }

  //   try{
  //     // roistat.event.send('open_banner', {
  //     //   name: item?.title
  //     // });
  //   } catch(e){ console.log(e) }
  // }

//   return (
//     <Box component="div" className="BannerMobile">
//       <Swiper
//         key={bannerList.length}
//         modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
//         spaceBetween={0}
//         slidesPerView={1}
//         loop={true}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         speed={2500}
//         pagination={{ clickable: true }}
//         scrollbar={{ draggable: true }}
//         ref={swiperRef}
//       >
//         {homeBanners?.map((item, key) => (
//           <SwiperSlide key={key} onClick={() => openBanner(item, swiperRef.current.swiper)}>
//             {/* <Image
//               alt={item.title}
//               src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + item.img + '_1000x500.jpg'}
//               width={1000}
//               height={500}
//               priority={false}
//               quality={75}
//               loading={'lazy'}
//               className="item_banner_image"
//             /> */}


//             {/*<picture>
//               <source 
//                 type="image/webp" 
//                 srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img + '_1000x500.jpg'} 
//                 sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
//               <source 
//                 type="image/jpeg" 
//                 srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img + '_1000x500.jpg'} 
//                 sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

//               <img 
//                 alt={item?.title} 
//                 title={item?.title} 
//                 src={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img + '_1000x500.jpg'} 
//                 loading="lazy"
//                 className="item_banner_image"
//               />
//             </picture>*/}


//             <video
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="auto"
//               className="item_banner_image"
//               style={{
//                 objectFit: 'cover',
//                 pointerEvents: 'none', // чтобы свайпер не ломался
//               }}
//             >
//               <source
//                 src="https://storage.yandexcloud.net/site-home-img/Testovyi_videoprianik_video_1080x1920.mp4"
//                 type="video/mp4"
//               />
//               <source
//                 src="https://storage.yandexcloud.net/site-home-img/Testovyi_videoprianik_video_1080x1920.webm"
//                 type="video/webm"
//               />
//             </video>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </Box>
//   );
// });

export default function BannersMobile() {
  const swiperRef = useRef(null);

  // Храни refs только для видео: { [slideKey]: HTMLVideoElement }
  const videoRefs = useRef({});
  const [bannerList, setActiveBanner, activeSlider, getBanners] = useHomeStore((state) => [state.bannerList, state.setActiveBanner, state.activeSlider, state.getBanners]);
  const [thisCity, thisCityRu] = useCitiesStore((state) => [ state.thisCity, state.thisCityRu ]);

  const homeBanners = bannerList?.filter(item => parseInt(item.is_active_home) === 1);

  const loadingTimers = useRef({}); // { [slideKey]: timeoutId }

  const handleVideoCanPlay = async (slideKey) => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    const active = slides[swiper.realIndex];
    if (!active || active.key !== slideKey) return;

    const video = videoRefs.current[slideKey];
    if (!video) return;

    try {
      video.muted = true;
      await video.play();
      disarmVideoFailover(slideKey);
    } catch {}
  };

  const stopAllFailovers = useCallback(() => {
    Object.values(loadingTimers.current).forEach((t) => clearTimeout(t));
    loadingTimers.current = {};
  }, []);

  const disarmVideoFailover = useCallback((slideKey) => {
    clearTimeout(loadingTimers.current[slideKey]);
    delete loadingTimers.current[slideKey];
  }, []);

  

  const pauseAllVideos = useCallback(() => {
    stopAllFailovers();
    Object.values(videoRefs.current).forEach((v) => {
      if (!v) return;
      try { v.pause(); v.currentTime = 0; } catch {}
    });
  }, [stopAllFailovers]);

  // Сделай единый список слайдов с типом
  const slides = useMemo(() => {
    // return (homeBanners ?? []).map((item) => ({
    //   key: item.id, // важно: стабильный ключ
    //   type: item.is_video ? "video" : "image", // как у тебя определяется видео
    //   item,
    // }));

    // картинки как есть
    const imageSlides = homeBanners.map((item) => ({
      key: `img-${item.id}`,
      type: "image",
      item,
    }));

    return [...imageSlides];

    // видео — клоны, но с типом video и src
    const videoSlides = homeBanners.map((item) => ({
      key: `video-${item.id}`,
      type: "video",
      item: {
        ...item,
        img: 'Testovyi_videoprianik',
        type_illustration: 'video'
      },
    }));

    return [...imageSlides, ...videoSlides];
  }, [homeBanners]);

  const handleVideoEnded = useCallback((slideKey) => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    const active = slides[swiper.realIndex];
    if (!active || active.key !== slideKey) return;

    disarmVideoFailover(slideKey);
    if(activeSlider)
      swiper.slideNext();
  }, [slides, disarmVideoFailover]);

  const armVideoFailover = useCallback((slideKey, ms = 3500) => {
    disarmVideoFailover(slideKey);

    loadingTimers.current[slideKey] = setTimeout(() => {
      const swiper = swiperRef.current?.swiper;
      if (!swiper) return;

      const active = slides[swiper.realIndex];
      if (!active || active.key !== slideKey) return;

      if(activeSlider)
        swiper.slideNext();
    }, ms);
  }, [slides, disarmVideoFailover]);

  const playIfVideoActive = useCallback(async (swiper) => {
    if (!swiper) return;

    const i = swiper.realIndex;
    const slide = slides[i];

    if (activeSlider && (!slide || slide.type !== "video")) {
      pauseAllVideos();
      swiper.autoplay?.start?.();
      return;
    }

    // ВАЖНО: сразу стопаем, чтобы не перелистнуло пока грузится
    swiper.autoplay?.stop?.();
    pauseAllVideos();

    const video = videoRefs.current[slide.key];
    if (!video) return;

    armVideoFailover(slide.key);

    // если уже достаточно данных — играем сразу
    // HAVE_CURRENT_DATA(2) / HAVE_FUTURE_DATA(3) / HAVE_ENOUGH_DATA(4)
    if (video.readyState >= 2) {
      try { video.muted = true; await video.play(); } catch {}
    }
  }, [slides, pauseAllVideos]);

  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    const handler = () => playIfVideoActive(swiper);

    swiper.on("init", handler);
    swiper.on("slideChange", handler);

    // на всякий случай сразу синхронизируем
    handler();

    return () => {
      swiper.off("init", handler);
      swiper.off("slideChange", handler);
    };
  }, [playIfVideoActive]);

  const openBanner = (item) => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    swiper.autoplay?.stop?.();

    setActiveBanner(true, item, swiper)

    ymDataLayer.push({
      "ecommerce": {
        "promoClick": {
          "promotions": [
            {
              "id": item?.id,          
              "name": item?.title,
              "creative": item?.name,
              "position": 1
            }
          ]
        }
      }
    });

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'open_banner', {akcia_name: item?.title});
    }

    if( thisCityRu == 'Тольятти' ){
      ym(100601350, 'reachGoal', 'open_banner', {akcia_name: item?.title});
    }

    try{
      // roistat.event.send('open_banner', {
      //   name: item?.title
      // });
    } catch(e){ console.log(e) }
  }

  return (
    <Box component="div" className="BannerMobile">
    <Swiper
      ref={swiperRef}
      modules={[Autoplay, Navigation, Pagination, A11y]}
      loop
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      slidesPerView={1}
    >
      {slides.map((s) => (
        <SwiperSlide key={s.key} onClick={() => openBanner(s.item, swiperRef.current.swiper)}>
          {s.item.type_illustration === "video" ? (
            <video
              ref={(el) => { if (el) videoRefs.current[s.key] = el; }}
              muted
              playsInline
              // loop
              preload="auto"
              className="item_banner_image"
              style={{
                objectFit: "cover",
                pointerEvents: "none",
              }}
              onEnded={() => handleVideoEnded(s.key)}
              onCanPlay={() => handleVideoCanPlay(s.key)}
            >
              <source src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + s.item.img + '_video_1080x1920.mp4'} type="video/mp4" />
              <source src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + s.item.img + '_video_1080x1920.webm'} type="video/webm" />
            </video>
          ) : (
            <picture>
               <source 
                 type="image/webp" 
                 srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img + '_1000x500.jpg'} 
                 sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
               <source 
                 type="image/jpeg" 
                 srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img + '_1000x500.jpg'} 
                 sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

               <img 
                 alt={s?.title} 
                 title={s?.title} 
                 src={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img + '_1000x500.jpg'} 
                 loading="lazy"
                 className="item_banner_image"
               />
             </picture>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
    </Box>
  );
}