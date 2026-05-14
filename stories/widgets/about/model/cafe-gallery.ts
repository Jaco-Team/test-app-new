export interface AboutCafeSlide {
  img: string;
  comment: string;
}

/** Слайды блока «Как выглядит кафе» — как в `modules/about/pc/cafeLooks.js`. */
export const ABOUT_CAFE_GALLERY_SLIDES: AboutCafeSlide[] = [
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
    comment:
      'Касса и кухня кафе на Ленинградской 47 (Тольятти), за кассой — Анастасия',
  },
  {
    img: '/about/slide4.png',
    comment: 'Уборная на Ленинградской 47 (Тольятти)',
  },
];
