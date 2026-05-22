import type { CategoryMenuItem } from '@ui/widgets/CategoryMenu/CategoryMenu';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';
import type { ProductCardProps } from '@ui/patterns/ProductCard/ProductCard';

export type HomeBannerSlide = {
  id: string;
  /** Compact / tablet banner (1000x500). */
  image: string;
  /** Desktop banner (3700x1000). */
  imageWide: string;
  alt?: string;
};

export type HomeFooterLinkGroup = {
  title: string;
  items: { label: string; href: string }[];
};

export type HomeFooterSocialLink = {
  label: string;
  href: string;
};

export type HomeTagFilterItem = {
  label: string;
  active?: boolean;
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
  products: ProductCardProps[];
  footerLinks: HomeFooterLinkGroup[];
  footerSocialLinks: HomeFooterSocialLink[];
};
