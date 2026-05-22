import { productCardFixtures } from '@ui/fixtures/productFixtures';
import type { HomePageRawData } from '@src/shared/lib/loadHomePageData';
import {
  isValidMediaKey,
  resolveBannerImageUrl,
  resolveProductImageUrl,
} from '@src/shared/lib/mediaUrls';
import type {
  HomePageViewModel,
  HomeBannerSlide,
  HomeFooterLinkGroup,
  HomeFooterSocialLink,
  HomeTagFilterItem,
} from './types';
import { normalizeCategories } from '@src/entities/catalog';
import { buildHeaderNavItems } from '@src/features/header/model/buildHeaderNav';
import { previewCityPath } from '@src/shared/lib/previewPaths';
import type { CategoryMenuItem } from '@ui/widgets/CategoryMenu/CategoryMenu';
import type { BadgeTone } from '@ui/components';
import type { ProductCardProps } from '@ui/patterns/ProductCard/ProductCard';

type HomeCategorySource = {
  name?: string;
  link?: string;
  main_link?: string;
  cats?: HomeCategorySource[];
};

type HomeProductSource = {
  id?: number | string;
  name?: string;
  text?: string;
  price?: number | string;
  old_price?: number | string;
  img?: string;
  img_app?: string;
  cat_name?: string;
  badges?: { name?: string; type?: string }[];
};

type HomeTagSource = {
  name?: string;
  title?: string;
  tag?: string;
};

function resolveCityLabel(city: string, cities: unknown[]): string {
  const found = cities.find(
    (item) =>
      item &&
      typeof item === 'object' &&
      String((item as { link?: string }).link) === city
  ) as { name?: string } | undefined;

  return found?.name ?? city;
}

function flattenCategoryItems(cats: unknown[]): CategoryMenuItem[] {
  const first = (cats as HomeCategorySource[])[0];
  const subs = first?.cats ?? (cats as HomeCategorySource[]).slice(0, 6);

  return subs.slice(0, 8).map((cat, index) => ({
    label: String(cat.name ?? cat.link ?? 'Категория'),
    active: index === 0,
  }));
}

function mapProduct(item: HomeProductSource): ProductCardProps | null {
  const title = String(item.name ?? '').trim();
  const price = Number(item.price);
  if (!title || !Number.isFinite(price)) {
    return null;
  }

  const imgKey = String(item.img_app ?? item.img ?? '').trim();
  const image = isValidMediaKey(imgKey)
    ? resolveProductImageUrl(imgKey)
    : productCardFixtures.madeiraSet.image;

  const badges = Array.isArray(item.badges)
    ? item.badges
        .filter((badge) => badge?.name)
        .map((badge) => ({
          label: String(badge.name),
          tone: (badge.type === 'hit' ? 'hit' : 'new') as BadgeTone,
        }))
    : undefined;

  return {
    title,
    image,
    description: item.text ? String(item.text) : undefined,
    meta: item.cat_name ? [String(item.cat_name)] : undefined,
    price,
    oldPrice: item.old_price ? Number(item.old_price) : undefined,
    badges,
  };
}

function mapBanners(banners: unknown[]): HomeBannerSlide[] {
  const slides: HomeBannerSlide[] = [];

  banners.forEach((raw, index) => {
    const item = raw as {
      id?: number | string;
      img?: string;
      name?: string;
      title?: string;
    };
    const mediaKey = String(item.img ?? '').trim();
    if (!isValidMediaKey(mediaKey)) {
      return;
    }
    slides.push({
      id: String(item.id ?? index),
      image: resolveBannerImageUrl(mediaKey, 'compact'),
      imageWide: resolveBannerImageUrl(mediaKey, 'expanded'),
      alt: item.name
        ? String(item.name)
        : item.title
          ? String(item.title)
          : undefined,
    });
  });

  return slides;
}

function defaultFooterGroups(citySlug: string): HomeFooterLinkGroup[] {
  return [
    {
      title: 'Жако',
      items: [
        { label: 'О компании', href: previewCityPath(citySlug, 'about') },
        {
          label: 'Реквизиты',
          href: previewCityPath(citySlug, 'company-details'),
        },
        { label: 'Контакты', href: previewCityPath(citySlug, 'contacts') },
      ],
    },
    {
      title: 'Документы',
      items: [
        {
          label: 'Публичная оферта',
          href: previewCityPath(citySlug, 'publichnaya-oferta'),
        },
        {
          label: 'Политика конфиденциальности',
          href: previewCityPath(citySlug, 'politika-konfidencialnosti'),
        },
        { label: 'Карта сайта', href: previewCityPath(citySlug, 'sitemap') },
      ],
    },
    {
      title: 'Работа в жако',
      items: [{ label: 'Вакансии', href: previewCityPath(citySlug, 'jobs') }],
    },
    {
      title: 'Франшиза',
      items: [
        { label: 'Сайт франшизы', href: 'https://franchise.jacofood.ru' },
        { label: 'Сайт для инвестиций', href: 'https://invest.jacofood.ru' },
      ],
    },
  ];
}

function mapFooterSocialLinks(
  links: Record<string, unknown>
): HomeFooterSocialLink[] {
  const defs: { key: string; label: string }[] = [
    { key: 'link_vk', label: 'VK' },
    { key: 'link_tg', label: 'Telegram' },
    { key: 'link_ok', label: 'OK' },
    { key: 'link_rt', label: 'RuTube' },
  ];

  return defs
    .map(({ key, label }) => {
      const href = links?.[key];
      if (typeof href !== 'string' || !href.trim()) {
        return null;
      }
      return { label, href };
    })
    .filter((item): item is HomeFooterSocialLink => Boolean(item));
}

function mapFooterLinks(
  citySlug: string,
  links: Record<string, unknown>
): HomeFooterLinkGroup[] {
  const entries = Object.entries(links).filter(
    ([key]) => !key.startsWith('link_')
  );

  if (entries.length === 0) {
    return defaultFooterGroups(citySlug);
  }

  const mapped = entries.slice(0, 4).map(([title, value]) => ({
    title,
    items: Array.isArray(value)
      ? value.slice(0, 8).map((item) => {
          const row = item as { name?: string; link?: string };
          return {
            label: String(row.name ?? 'Ссылка'),
            href: row.link ? String(row.link) : '#',
          };
        })
      : [{ label: String(value), href: '#' }],
  }));

  return mapped.length > 0 ? mapped : defaultFooterGroups(citySlug);
}

function mapTags(tags: unknown[]): HomeTagFilterItem[] {
  return (tags as HomeTagSource[])
    .map((tag, index): HomeTagFilterItem | null => {
      const label = String(tag.name ?? tag.title ?? tag.tag ?? '').trim();
      if (!label) {
        return null;
      }

      return {
        label,
        active: index === 0,
      };
    })
    .filter((tag): tag is HomeTagFilterItem => Boolean(tag))
    .slice(0, 24);
}

export function mapHomePageViewModel(data: HomePageRawData): HomePageViewModel {
  const productsFromApi = data.all_items
    .map((item) => mapProduct(item as HomeProductSource))
    .filter((item): item is ProductCardProps => Boolean(item))
    .slice(0, 24);

  const products =
    productsFromApi.length > 0
      ? productsFromApi
      : [productCardFixtures.madeiraSet];

  const cats = data.cats;
  const normalizedCats = normalizeCategories(cats);
  const primary = flattenCategoryItems(cats);
  const secondarySource = (cats as HomeCategorySource[])[0]?.cats ?? [];
  const secondary =
    secondarySource.length > 0
      ? secondarySource.slice(0, 8).map((cat, index) => ({
          label: String(cat.name ?? cat.link ?? 'Категория'),
          active: index === 0,
        }))
      : primary;

  return {
    citySlug: data.city,
    cityLabel: resolveCityLabel(data.city, data.cities),
    pageTitle: String((data.page as { title?: string })?.title ?? 'Жако'),
    headerNav: buildHeaderNavItems(data.city, normalizedCats, {
      activePage: 'home',
    }),
    categoryPrimary: primary,
    categorySecondary: secondary,
    banners: mapBanners(data.banners),
    tags: mapTags(data.tags),
    products,
    footerLinks: mapFooterLinks(data.city, data.links),
    footerSocialLinks: mapFooterSocialLinks(data.links),
  };
}
