export interface ProductItem {
  /** ID товара */
  id: string;
  /** Название товара */
  name: string;
  /** Краткое описание (для списка) */
  tmp_desc: string;
  /** Маркетинговое описание (короткое) */
  marc_desc: string;
  /** Полное маркетинговое описание */
  marc_desc_full: string;
  /** Размер пиццы (0 - не пицца, иначе размер в см) */
  size_pizza: string;
  /** Количество кусочков/порций */
  count_part: string;
  /** Вес в граммах */
  weight: string;
  /** Цена в рублях */
  price: string;
  /** Ссылка (slug) на товар */
  link: string;
  /** Название изображения для приложения */
  img_app: string;
  /** ID категории */
  cat_id: string;
  /** Название категории */
  cat_name: string;
  /** Новинка (1 - да, 0 - нет) */
  is_new: string;
  /** Хит (1 - да, 0 - нет) */
  is_hit: string;
  /** Обновлен (1 - да, 0 - нет) */
  is_updated: string;
  /** Массив тегов (ID тегов) */
  tags: number[];
}
