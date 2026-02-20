import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useHomeStore, useCitiesStore } from '../../../components/store.js';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { Navigation, Pagination, A11y, EffectCreative, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { reachGoal } from '@/utils/metrika';

import { ArrowIcon, NextIcon } from '@/ui/Icons.js';

// (function BannersPC_old() {
//   const [bannerList, setActiveBanner, activeSlider, getBanners] = useHomeStore((state) => [state.bannerList, state.setActiveBanner, state.activeSlider, state.getBanners]);
//   const [thisCity, thisCityRu] = useCitiesStore((state) => [ state.thisCity, state.thisCityRu ]);

//   const swiperRef = useRef(null);

//   useEffect(() => {
//     if ((!bannerList || bannerList.length === 0) && thisCity) {
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

//   const openBanner = (item) => {
//     setActiveBanner(true, item, swiperRef.current.swiper)

//     ymDataLayer.push({
//       "ecommerce": {
//         "promoClick": {
//           "promotions": [
//             {
//               "id": item?.id,          
//               "name": item?.title,
//               "creative": item?.name,
//               "position": 1
//             }
//           ]
//         }
//       }
//     });

//     if( thisCityRu == 'Самара' ){
//       ym(100325084, 'reachGoal', 'open_banner', {akcia_name: item?.title});
//     }

//     if( thisCityRu == 'Тольятти' ){
//       ym(100601350, 'reachGoal', 'open_banner', {akcia_name: item?.title});
//     }

//     try{
//       // roistat.event.send('open_banner', {
//       //   name: item?.title
//       // });
//     } catch(e){ console.log(e) }
//   }

//   return (
//     <Box component="div" className="BannerPC BannerFontPC">

//       <Grid className="ImgItem">
//         <Swiper
//           key={bannerList.length}
//           modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
//           spaceBetween={0}
//           slidesPerView={1}
//           loop={true}
//           //autoplay={false}
//           autoplay={{ delay: 5000, disableOnInteraction: false }}
//           speed={2500}
//           pagination={{ clickable: true }}
//           navigation={{
//             prevEl: '.swiper-button-prev',
//             nextEl: '.swiper-button-next',
//           }}
//           scrollbar={{ draggable: true }}
//           // style={{width: !matches ? '100%' : '90.975vw', marginTop: !matches ? 60 : '8.66425vw', borderRadius: '2.8881vw'}}
//           style={{width: '90.975vw', marginTop: '8.66425vw'}}
//           ref={swiperRef}
//         >
//           {homeBanners?.map((item, key) => (
//             <SwiperSlide key={key} dataswiperautoplay="2000" onClick={() => openBanner(item, swiperRef.current.swiper)}>
//               {/* <Image alt={item.title} src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}`+item.img+"_3700x1000.jpg"} width={ 3700 } height={ 1000 } priority={true} style={{ width: '100%', height: 'auto', borderRadius: '1.1552346570397vw' }} /> */}
//               <picture>
//                 <source 
//                   type="image/webp" 
//                   srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img+"_3700x1000.webp"} 
//                   sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
//                 <source 
//                   type="image/jpeg" 
//                   srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img+"_3700x1000.jpg"} 
//                   sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

//                 <img 
//                   alt={item?.name} 
//                   title={item?.name} 
//                   src={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + item.img+"_3700x1000.jpg"} 
//                   loading="lazy"
//                   style={{ width: '100%', height: 'auto', borderRadius: '1.1552346570397vw' }}
//                 />
//               </picture>
//             </SwiperSlide>
//           ))}
//           <div className="swiper-button-prev"><ArrowIcon /></div>
//           <div className="swiper-button-next"><NextIcon /></div>
//         </Swiper>
//       </Grid>


//     </Box>
//   );
// });

// function BannersPC_old_new() {
//   const [bannerList, setActiveBanner, activeSlider, getBanners] = useHomeStore((state) => [
//     state.bannerList,
//     state.setActiveBanner,
//     state.activeSlider,
//     state.getBanners,
//   ]);

//   const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);

//   const swiperRef = useRef(null);
//   const videoRefs = useRef({}); // { [slideKey]: HTMLVideoElement }
//   const loadingTimers = useRef({}); // { [slideKey]: timeoutId }
//   const autoplayStoppedRef = useRef(false); // чтобы стопать перелистывание при открытии баннера

//   const prevRef = useRef(null);
//   const nextRef = useRef(null);
//   const paginationRef = useRef(null);

//   useEffect(() => {
//     if ((!bannerList || bannerList.length === 0) && thisCity) {
//       getBanners("home", thisCity);
//     }
//   }, [bannerList, thisCity, getBanners]);

//   const homeBanners = useMemo(() => {
//     return bannerList?.filter((item) => parseInt(item.is_active_home) === 1) ?? [];
//   }, [bannerList]);

//   // ✅ единый список слайдов (картинки + видео)
//   const slides = useMemo(() => {
//     const imageSlides = homeBanners.map((item) => ({
//       key: `img-${item.id}`,
//       type: "image",
//       item,
//     }));

//     return [...imageSlides];

//     const videoSlides = homeBanners.map((item) => ({
//       key: `video-${item.id}`,
//       type: "video",
//       item: {
//         ...item,
//         img: 'Testovyi_videoprianik',
//         type_illustration: 'video'
//       },
//     }));

//     return [...imageSlides, ...videoSlides];
//   }, [homeBanners]);

//   useEffect(() => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     if (!slides.length) return;

//     // обязательно пересчитать
//     swiper.update();

//     // обязателен этот хак для loop
//     swiper.loopDestroy();
//     swiper.loopCreate();
//     swiper.updateSlides();

//     // обновить UI
//     swiper.pagination?.render?.();
//     swiper.pagination?.update?.();
//     swiper.navigation?.update?.();

//     // старт autoplay
//     if (activeSlider) swiper.autoplay?.start?.();
//   }, [slides.length, activeSlider]);

//   // ---------- timers ----------
//   const stopAllFailovers = useCallback(() => {
//     Object.values(loadingTimers.current).forEach((t) => clearTimeout(t));
//     loadingTimers.current = {};
//   }, []);

//   const disarmVideoFailover = useCallback((slideKey) => {
//     clearTimeout(loadingTimers.current[slideKey]);
//     delete loadingTimers.current[slideKey];
//   }, []);

//   const armVideoFailover = useCallback(
//     (slideKey, ms = 3500) => {
//       disarmVideoFailover(slideKey);

//       loadingTimers.current[slideKey] = setTimeout(() => {
//         const swiper = swiperRef.current?.swiper;
//         if (!swiper) return;

//         const active = slides[swiper.realIndex];
//         if (!active || active.key !== slideKey) return;

//         swiper.slideNext();
//       }, ms);
//     },
//     [slides, disarmVideoFailover]
//   );

//   // ---------- video control ----------
//   const pauseAllVideos = useCallback(() => {
//     stopAllFailovers();

//     Object.values(videoRefs.current).forEach((v) => {
//       if (!v) return;
//       try {
//         v.pause();
//         v.currentTime = 0;
//       } catch {}
//     });
//   }, [stopAllFailovers]);

//   const playIfVideoActive = useCallback(
//     async (swiper) => {
//       if (!swiper) return;

//       const i = swiper.realIndex;
//       const slide = slides[i];

//       // если автоплей был вручную остановлен (баннер открыт), то не запускаем обратно
//       // if (autoplayStoppedRef.current) {
//       //   swiper.autoplay?.stop?.();
//       // }

//       // картинка: стоп видео и (если не вручную стопнуто) старт автоплея
//       if (!slide || slide.type !== "video") {
//         pauseAllVideos();
//         if (activeSlider) swiper.autoplay?.start?.();
//         return;
//       }

//       // видео: стоп autoplay, стоп остальных видео, запускаем активное
//       swiper.autoplay?.stop?.();
//       pauseAllVideos();

//       const video = videoRefs.current[slide.key];
//       if (!video) return;

//       armVideoFailover(slide.key);

//       // если уже готовы данные — играем
//       if (video.readyState >= 2) {
//         try {
//           video.muted = true;
//           await video.play();
//         } catch {}
//       }
//     },
//     [slides, pauseAllVideos, armVideoFailover]
//   );

//   // ---------- swiper events ----------
//   useEffect(() => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;

//     const handler = () => playIfVideoActive(swiper);

//     swiper.on("init", handler);
//     swiper.on("slideChange", handler);

//     handler();

//     return () => {
//       swiper.off("init", handler);
//       swiper.off("slideChange", handler);
//     };
//   }, [playIfVideoActive]);

//   // ---------- video events ----------
//   const handleVideoEnded = useCallback(
//     (slideKey) => {
//       const swiper = swiperRef.current?.swiper;
//       if (!swiper) return;

//       const active = slides[swiper.realIndex];
//       if (!active || active.key !== slideKey) return;

//       disarmVideoFailover(slideKey);
//       swiper.slideNext();
//     },
//     [slides, disarmVideoFailover]
//   );

//   const handleVideoCanPlay = useCallback(
//     async (slideKey) => {
//       const swiper = swiperRef.current?.swiper;
//       if (!swiper) return;

//       const active = slides[swiper.realIndex];
//       if (!active || active.key !== slideKey) return;

//       const video = videoRefs.current[slideKey];
//       if (!video) return;

//       try {
//         video.muted = true;
//         await video.play();
//         disarmVideoFailover(slideKey);
//       } catch {}
//     },
//     [slides, disarmVideoFailover]
//   );

//   // ---------- open banner ----------
//   const openBanner = (item) => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;

//     // ✅ стопаем только перелистывание, видео может продолжать крутиться
//     swiper.autoplay?.stop?.();

//     setActiveBanner(true, item, swiper);

//     ymDataLayer.push({
//       ecommerce: {
//         promoClick: {
//           promotions: [
//             {
//               id: item?.id,
//               name: item?.title,
//               creative: item?.name,
//               position: 1,
//             },
//           ],
//         },
//       },
//     });

//     if (thisCityRu == "Самара") {
//       ym(100325084, "reachGoal", "open_banner", { akcia_name: item?.title });
//     }

//     if (thisCityRu == "Тольятти") {
//       ym(100601350, "reachGoal", "open_banner", { akcia_name: item?.title });
//     }
//   };

//   return (
//     <Box component="div" className="BannerPC BannerFontPC">
//       <Grid className="ImgItem">
//         <Swiper
//           key={slides.length}
//           ref={swiperRef}
//           modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
//           slidesPerView={1}
//           loop
//           autoplay={{ delay: 5000, disableOnInteraction: false }}
//           speed={2500}
//           navigation={{
//             prevEl: prevRef.current,
//             nextEl: nextRef.current,
//           }}
//           pagination={{
//             el: paginationRef.current,
//             clickable: true,
//           }}
//           onBeforeInit={(swiper) => {
//             swiper.params.navigation.prevEl = prevRef.current;
//             swiper.params.navigation.nextEl = nextRef.current;
//             swiper.params.pagination.el = paginationRef.current;
//           }}
//           onInit={(swiper) => {
//             swiper.navigation.init();
//             swiper.navigation.update();
//             swiper.pagination.init();
//             swiper.pagination.render();
//             swiper.pagination.update();
//             if (activeSlider) swiper.autoplay.start();
//           }}
//           style={{ width: "90.975vw", marginTop: "8.66425vw" }}
//         >
//           {slides.map((s) => (
//             <SwiperSlide key={s.key} onClick={() => openBanner(s.item)}>
//               {s.item.type_illustration === "video" ? (
//                 <video
//                   ref={(el) => {
//                     if (el) videoRefs.current[s.key] = el;
//                   }}
//                   muted
//                   playsInline
//                   loop
//                   preload="auto"
//                   style={{
//                     width: "100%",
//                     height: 'auto',

//                     borderRadius: "1.1552346570397vw",
//                     objectFit: "cover",
//                     pointerEvents: "none",
//                   }}
//                   onEnded={() => handleVideoEnded(s.key)}
//                   onCanPlay={() => handleVideoCanPlay(s.key)}
//                 >
//                   <source src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + s.item.img + '_video_1920x1080.mp4'} type="video/mp4" />
//                   {/* <source src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + s.item.img + '_video_1920x1080.webm'} type="video/webm" /> */}
//                 </video>
//               ) : (
//                 <picture>
//                   <source 
//                     type="image/webp" 
//                     srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img+"_3700x1000.webp"} 
//                     sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
//                   <source 
//                     type="image/jpeg" 
//                     srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img+"_3700x1000.jpg"} 
//                     sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

//                   <img 
//                     alt={s.item?.name} 
//                     title={s.item?.name} 
//                     src={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img+"_3700x1000.jpg"} 
//                     loading="lazy"
//                     style={{ width: '100%', height: 'auto', borderRadius: '1.1552346570397vw' }}
//                   />
//                 </picture>
//               )}
//             </SwiperSlide>
//           ))}
          

//           <div ref={prevRef} className="swiper-button-prev"><ArrowIcon /></div>
//           <div ref={nextRef} className="swiper-button-next"><NextIcon /></div>
//           <div ref={paginationRef} className="swiper-pagination" />
        
//         </Swiper>
//       </Grid>
//     </Box>
//   );
// }

export default function BannersPC() {
  const [bannerList, setActiveBanner, activeSlider, getBanners] = useHomeStore((state) => [
    state.bannerList,
    state.setActiveBanner,
    state.activeSlider,
    state.getBanners,
  ]);

  const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);

  const swiperRef = useRef(null);
  const videoRefs = useRef({}); // { [slideKey]: HTMLVideoElement }
  const loadingTimers = useRef({}); // { [slideKey]: timeoutId }

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  const playTokenRef = useRef(0);

  // ---------- load banners ----------
  useEffect(() => {
    if ((!bannerList || bannerList.length === 0) && thisCity) {
      getBanners("home", thisCity);
    }
  }, [bannerList, thisCity, getBanners]);

  const homeBanners = useMemo(() => {
    return bannerList?.filter((item) => parseInt(item.is_active_home) === 1) ?? [];
  }, [bannerList]);

  const slides = useMemo(() => {
    return homeBanners.map((item) => ({
      key: `slide-${item.id}`,
      type: item.type_illustration === "video" ? "video" : "image",
      item,
    }));
  }, [homeBanners]);

  // ---------- init fix ----------
  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;
    if (!slides.length) return;

    swiper.update();
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.updateSlides();

    swiper.pagination?.render?.();
    swiper.pagination?.update?.();
    swiper.navigation?.update?.();

    if (activeSlider) swiper.autoplay?.start?.();
  }, [slides.length, activeSlider]);

  // ---------- timers ----------
  const stopAllFailovers = useCallback(() => {
    Object.values(loadingTimers.current).forEach((t) => clearTimeout(t));
    loadingTimers.current = {};
  }, []);

  const disarmVideoFailover = useCallback((slideKey) => {
    clearTimeout(loadingTimers.current[slideKey]);
    delete loadingTimers.current[slideKey];
  }, []);

  const armVideoFailover = useCallback(
    (slideKey, ms = 6000) => {
      disarmVideoFailover(slideKey);

      loadingTimers.current[slideKey] = setTimeout(() => {
        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;

        const active = slides[swiper.realIndex];
        if (!active || active.key !== slideKey) return;

        swiper.slideNext();
      }, ms);
    },
    [slides, disarmVideoFailover]
  );

  const pauseAllExcept = useCallback(
    (exceptEl) => {
      stopAllFailovers();

      Object.values(videoRefs.current).forEach((v) => {
        if (!v) return;
        if (exceptEl && v === exceptEl) return;
        try {
          v.pause();
        } catch {}
      });
    },
    [stopAllFailovers]
  );

  // ---------- SAFARI SAFE PLAY ----------
  const safePlay = useCallback(async (video, token) => {
    if (!video) return false;

    try {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.preload = "auto";

      // если закончилось — сброс
      if (video.ended) {
        try {
          video.currentTime = 0;
        } catch {}
        try {
          video.load();
        } catch {}
      }

      if (playTokenRef.current !== token) return false;

      await new Promise((r) => requestAnimationFrame(r));
      if (playTokenRef.current !== token) return false;

      const p = video.play();
      if (p?.then) await p;

      if (playTokenRef.current !== token) return false;

      return true;
    } catch (e) {
      if (e?.name !== "AbortError") console.log("safePlay error:", e?.name, e?.message);
      return false;
    }
  }, []);

  // ---------- MAIN ----------
  const playIfVideoActive = useCallback(
    async (swiper) => {
      if (!swiper) return;

      const i = swiper.realIndex;
      const slide = slides[i];

      playTokenRef.current += 1;
      const token = playTokenRef.current;

      // ----- IMAGE -----
      if (!slide || slide.type !== "video") {
        pauseAllExcept(null);

        if (activeSlider) {
          try {
            swiper.autoplay?.stop?.();
            setTimeout(() => {
              if (playTokenRef.current === token) swiper.autoplay?.start?.();
            }, 80);
          } catch {}
        }
        return;
      }

      // ----- VIDEO -----
      swiper.autoplay?.stop?.();

      const video = videoRefs.current[slide.key];
      if (!video) return;

      pauseAllExcept(video);

      // ✅ всегда сбрасываем ended, чтобы не зависал на последнем кадре
      if (video.ended) {
        try { video.currentTime = 0; } catch {}
      }

      // failover если не запустилось или зависло
      armVideoFailover(slide.key);

      const ok = await safePlay(video, token);

      if (ok) {
        // ✅ если стартануло — можно убрать failover (или оставить на крайний случай)
        disarmVideoFailover(slide.key);

        // ✅ ВАЖНО: видео должно перелистнуть по окончанию
        video.onended = () => {
          const s = swiperRef.current?.swiper;
          if (!s) return;
          // если в этот момент это все еще активный видео-слайд — едем дальше
          s.slideNext();
        };
      }
    },
    [slides, pauseAllExcept, armVideoFailover, safePlay, disarmVideoFailover, activeSlider]
  );

  // ---------- swiper events ----------
  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    const handler = () => playIfVideoActive(swiper);

    swiper.on("init", handler);
    swiper.on("slideChangeTransitionEnd", handler);

    setTimeout(handler, 120);

    return () => {
      swiper.off("init", handler);
      swiper.off("slideChangeTransitionEnd", handler);
    };
  }, [playIfVideoActive]);

  // ---------- open banner ----------
  const openBanner = useCallback(
    (item) => {
      const swiper = swiperRef.current?.swiper;
      if (!swiper) return;

      swiper.autoplay?.stop?.();
      setActiveBanner(true, item, swiper);

      ymDataLayer.push({
        ecommerce: {
          promoClick: {
            promotions: [
              {
                id: item?.id,
                name: item?.title,
                creative: item?.name,
                position: 1,
              },
            ],
          },
        },
      });

      reachGoal('open_banner', { akcia_name: item?.title });
    },
    [setActiveBanner, thisCityRu]
  );

  return (
    <Box component="div" className="BannerPC BannerFontPC">
      <Grid className="ImgItem">
        <Swiper
          key={slides.length}
          ref={swiperRef}
          modules={[Autoplay, Navigation, Pagination, A11y, EffectCreative]}
          slidesPerView={1}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={2500}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{
            el: paginationRef.current,
            clickable: true,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.params.pagination.el = paginationRef.current;
          }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
            swiper.pagination.init();
            swiper.pagination.render();
            swiper.pagination.update();
            if (activeSlider) swiper.autoplay.start();
          }}
          style={{ width: "90.975vw", marginTop: "8.66425vw" }}
        >
          {slides.map((s) => (
            <SwiperSlide key={s.key} onClick={() => openBanner(s.item)}>
              {s.type === "video" ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[s.key] = el;
                  }}
                  muted
                  playsInline
                  // ✅ ВАЖНО: loop убран, иначе ended не сработает
                  preload="auto"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "1.1552346570397vw",
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                >
                  <source
                    src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}${s.item.img}_video_1920x1080.mp4`}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <picture>
                  <source 
                    type="image/webp" 
                    srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img+"_3700x1000.webp"} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                  <source 
                    type="image/jpeg" 
                    srcSet={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img+"_3700x1000.jpg"} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                  <img 
                    alt={s.item?.name} 
                    title={s.item?.name} 
                    src={ process.env.NEXT_PUBLIC_YANDEX_STORAGE + s.item.img+"_3700x1000.jpg"} 
                    loading="lazy"
                    style={{ width: '100%', height: 'auto', borderRadius: '1.1552346570397vw' }}
                  />
                </picture>
              )}
            </SwiperSlide>
          ))}

          <div ref={prevRef} className="swiper-button-prev">
            <ArrowIcon />
          </div>
          <div ref={nextRef} className="swiper-button-next">
            <NextIcon />
          </div>
          <div ref={paginationRef} className="swiper-pagination" />
        </Swiper>
      </Grid>
    </Box>
  );
}
