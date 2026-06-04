import type { CategoryMenuItem } from '@ui/widgets/CategoryMenu/CategoryMenu';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import type { ProductCardProps } from '@ui/patterns/ProductCard/ProductCard';

export type HomeProduct = ProductCardProps & {
  id: string;
  catId?: string;
  link?: string;
  imageKey?: string;
  weight?: string;
  detailText?: string;
  composition?: string;
  nutrition?: { label: string; value: string }[];
  tagIds?: string[];
  raw?: Record<string, unknown>;
};

export type HomeBannerPromoInfo = {
  name: string;
  cityId: string;
};

export type HomeBannerSlide = {
  id: string;
  /** Compact / tablet banner (1000x500). */
  image: string;
  /** Desktop banner (3700x1000). */
  imageWide: string;
  alt?: string;
  title?: string;
  /** Manager-authored HTML (emojis, simple markup). */
  text?: string;
  buttonLabel?: string;
  /** Legacy `info.promo_action`: 0 = none, 2 = price-only rows, other = promo CTA. */
  promoAction?: number;
  promoInfo?: HomeBannerPromoInfo;
  products?: HomeProduct[];
};

export type HomeProductGroup = {
  id: string;
  label: string;
  products: HomeProduct[];
};

export type HomeTagFilterItem = {
  label: string;
  active?: boolean;
  tone?: 'default' | 'new';
  id?: string;
};

export type HomePageViewModel = {
  citySlug: string;
  cityLabel: string;
  pageTitle: string;
  headerNav: HeaderNavItem[];
  categoryPrimary: CategoryMenuItem[];
  categorySecondary: CategoryMenuItem[];
  banners: HomeBannerSlide[];
  tags: HomeTagFilterItem[];
  products: HomeProduct[];
  productGroups: HomeProductGroup[];
};
