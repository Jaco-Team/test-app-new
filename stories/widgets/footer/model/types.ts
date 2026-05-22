export interface FooterLinks {
  link_allergens?: string;
  link_vk?: string;
  link_tg?: string;
  link_ok?: string;
}

export interface FooterProps {
  cookie?: boolean;
  arrow?: boolean;
  cityName: string;
  links?: FooterLinks;
  page: string;
}
