export interface Banner {
  /** ID баннера */
  id: string;
  /** Название акции */
  name: string;
  /** Ссылка (slug) */
  link: string;
  /** Заголовок акции */
  title: string;
  /** HTML текст описания акции */
  text: string;
  /** Название изображения */
  img: string;
  /** Название миниатюры (если есть) */
  thumbnail: string;
  /** Тип иллюстрации ('img' или другое) */
  type_illustration: string;
  /** ID города (1 - Тольятти, -1 - все города) */
  city_id: string;
  /** ID промокода (0 если нет) */
  promo_id: string;
  /** Дата начала акции (YYYY-MM-DD) */
  date_start: string;
  /** Дата окончания акции (YYYY-MM-DD) */
  date_end: string;
  /** Активен ли баннер (1 - да, 0 - нет) */
  is_active: string;
  /** Показывать ли на странице акций (1 - да, 0 - нет) */
  is_active_actii: string;
  /** Показывать ли на главной странице (1 - да, 0 - нет) */
  is_active_home: string;
  /** Порядок сортировки */
  sort: string;
  /** Дата обновления (YYYY_MM_DD_HH_MM_SS) */
  date_update: string;
  /** SEO заголовок */
  seo_title: string;
  /** SEO описание */
  seo_desc: string;
  /** Версии (может быть null или объект) */
  versions: any | null;
  /** Название промокода */
  promo_name: string | null;
  /** Дополнительная информация (массив) */
  info: BannerInfo[];
  /** Список товаров в акции */
  item: BannerItem[];
}

export interface BannerItem {
  item_id: string;
}

export interface bannerListProps {
  bannerList: Banner[];
}

export interface BannerInfo {}
