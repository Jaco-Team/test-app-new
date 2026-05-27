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

export type HomeBannerSlide = {
  id: string;
  /** Compact / tablet banner (1000x500). */
  image: string;
  /** Desktop banner (3700x1000). */
  imageWide: string;
  alt?: string;
  title?: string;
  text?: string;
  buttonLabel?: string;
  products?: HomeProduct[];
};

export type HomeFooterLinkGroup = {
  title: string;
  items: { label: string; href: string }[];
};

export type HomeFooterSocialLink = {
  label: string;
  href: string;
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
  footerLinks: HomeFooterLinkGroup[];
  footerSocialLinks: HomeFooterSocialLink[];
};
