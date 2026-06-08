export type ProfileUser = {
  id?: number | string;
  name?: string;
  fam?: string;
  mail?: string;
  login?: string;
  spam?: number | string;
  date_bir?: string;
  date_bir_full?: string;
  date_bir_d?: string | number;
  date_bir_m?: string | number;
  date_bir_y?: string | number;
  [key: string]: unknown;
};

export type ProfileStreet = {
  id: number | string;
  city?: string;
  city_id?: number | string;
  city_name?: string;
  name_street?: string;
  home?: string;
  kv?: string;
  is_main?: number | string;
  [key: string]: unknown;
};

export type ProfilePromo = {
  promo_name?: string;
  promo_action_text?: string;
  promo_text?: string;
  diff_days_text?: string;
  city_id?: number | string;
  [key: string]: unknown;
};

export type ProfileOrder = {
  order_id?: number | string;
  point_id?: number | string;
  status_order?: string;
  status_order_?: number | string;
  type_status?: number | string;
  is_delete?: number | string;
  date?: string;
  time?: string;
  sum?: number | string;
  [key: string]: unknown;
};
