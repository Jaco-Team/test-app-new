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
  HomeProduct,
  HomeTagFilterItem,
  HomeProductGroup,
} from './types';
import { normalizeCategories } from '@src/entities/catalog';
import { buildHeaderNavItems } from '@src/features/header/model/buildHeaderNav';
import { cityPath } from '@src/shared/lib/sitePaths';
import { htmlToPlainText } from '@src/shared/lib/text/htmlToPlainText';
import type { CategoryMenuItem } from '@ui/widgets/CategoryMenu/CategoryMenu';
import type { BadgeTone } from '@ui/components';

type HomeCategorySource = {
  name?: string;
  short_name?: string;
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
  cat_id?: number | string;
  weight?: number | string;
  count_part?: number | string;
  count_part_new?: number | string;
  size_pizza?: number | string;
  marc_desc?: string;
  tmp_desc?: string;
  sostav?: string;
  composition?: string;
  proteins?: number | string;
  fats?: number | string;
  carbohydrates?: number | string;
  calories?: number | string;
  badges?: { name?: string; type?: string }[];
  tags?: Array<number | string>;
  is_new?: number | string;
  is_hit?: number | string;
  is_updated?: number | string;
  link?: string;
  marc_desc_full?: string;
  items?: unknown[];
  protein?: number | string;
  fat?: number | string;
  kkal?: number | string;
};

const transparentProductImage =
  'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

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

function categoryDomId(cat: HomeCategorySource): string | undefined {
  const id = (cat as { id?: number | string }).id;
  if (id === undefined || id === null || String(id).length === 0) {
    return undefined;
  }

  return 'cat' + String(id);
}

function firstCategoryTarget(cat: HomeCategorySource): string | undefined {
  return cat.cats?.map(firstCategoryTarget).find(Boolean) ?? categoryDomId(cat);
}

function categoryMenuItem(
  cat: HomeCategorySource,
  index: number
): CategoryMenuItem {
  const id = (cat as { id?: number | string }).id;
  const parentId = (cat as { parent_id?: number | string }).parent_id;
  const children = Array.isArray(cat.cats)
    ? cat.cats
        .slice(0, 12)
        .map((child, childIndex) => categoryMenuItem(child, childIndex))
    : [];

  return {
    id: id === undefined || id === null ? undefined : String(id),
    parentId:
      parentId === undefined || parentId === null
        ? undefined
        : String(parentId),
    label: String(cat.name ?? cat.link ?? 'Категория'),
    shortLabel: String(cat.short_name ?? cat.name ?? cat.link ?? 'Категория'),
    active: index === 0,
    targetId: firstCategoryTarget(cat),
    children,
  };
}

function flattenCategoryItems(cats: unknown[]): CategoryMenuItem[] {
  return (cats as HomeCategorySource[])
    .slice(0, 12)
    .map((cat, index) => categoryMenuItem(cat, index));
}

function flattenLeafCategories(
  cats: HomeCategorySource[]
): HomeCategorySource[] {
  return cats.flatMap((cat) => {
    if (cat.cats?.length) {
      return flattenLeafCategories(cat.cats);
    }

    return [cat];
  });
}

function mapProductGroups(
  cats: unknown[],
  products: HomeProduct[]
): { id: string; label: string; products: HomeProduct[] }[] {
  const groups: { id: string; label: string; products: HomeProduct[] }[] = [];
  const used = new Set<string>();
  const leaves = flattenLeafCategories(cats as HomeCategorySource[]);

  leaves.forEach((cat) => {
    const id = (cat as { id?: number | string }).id;
    const catId = id === undefined || id === null ? '' : String(id);
    const groupProducts = products.filter((product) => product.catId === catId);
    if (!groupProducts.length) {
      return;
    }

    groupProducts.forEach((product) => used.add(product.id));
    groups.push({
      id: categoryDomId(cat) ?? 'cat-' + groups.length,
      label: String(cat.name ?? cat.link ?? 'Категория'),
      products: groupProducts,
    });
  });

  products.forEach((product) => {
    if (!product.catId || used.has(product.id)) {
      return;
    }

    const existing = groups.find((group) => group.id === 'cat' + product.catId);
    if (existing) {
      existing.products.push(product);
      used.add(product.id);
      return;
    }

    groups.push({
      id: 'cat' + product.catId,
      label: String(product.raw?.cat_name ?? 'Каталог'),
      products: [product],
    });
    used.add(product.id);
  });

  const leftovers = products.filter((product) => !used.has(product.id));
  if (leftovers.length) {
    groups.push({ id: 'cat-all', label: 'Каталог', products: leftovers });
  }

  return groups;
}

function flattenRawProducts(items: unknown[]): unknown[] {
  return items.flatMap((row) => {
    const item = row as {
      id?: number | string;
      name?: string;
      items?: unknown[];
    };
    if (Array.isArray(item.items)) {
      return item.items.map((child) => ({
        ...(child as Record<string, unknown>),
        cat_id: (child as { cat_id?: unknown }).cat_id ?? item.id,
        cat_name: (child as { cat_name?: unknown }).cat_name ?? item.name,
      }));
    }

    return [row];
  });
}

function firstNonEmptyText(...values: unknown[]): unknown {
  return values.find(
    (value) =>
      value !== undefined && value !== null && String(value).trim().length > 0
  );
}

export function mapProduct(item: HomeProductSource): HomeProduct | null {
  const title = String(item.name ?? '').trim();
  const price = Number(item.price);
  if (!title || !Number.isFinite(price)) {
    return null;
  }

  const imgKey = String(item.img_app ?? item.img ?? '').trim();
  const image = isValidMediaKey(imgKey)
    ? resolveProductImageUrl(imgKey)
    : transparentProductImage;

  const badgeList = Array.isArray(item.badges)
    ? item.badges
        .filter((badge) => badge?.name)
        .map((badge) => ({
          label: String(badge.name),
          tone: (badge.type === 'hit' ? 'hit' : 'new') as BadgeTone,
        }))
    : [];

  if (
    Number(item.is_new) === 1 &&
    !badgeList.some((badge) => badge.tone === 'new')
  ) {
    badgeList.push({ label: 'НОВИНКА', tone: 'new' as BadgeTone });
  }

  if (
    Number(item.is_hit) === 1 &&
    !badgeList.some((badge) => badge.tone === 'hit')
  ) {
    badgeList.push({ label: 'ХИТ', tone: 'hit' as BadgeTone });
  }

  if (
    Number(item.is_updated) === 1 &&
    !badgeList.some((badge) => badge.tone === 'updated')
  ) {
    badgeList.push({ label: 'ОБНОВЛЕНО', tone: 'updated' as BadgeTone });
  }

  if (
    Array.isArray(item.tags) &&
    item.tags.map((tag) => Number(tag)).includes(14) &&
    !badgeList.some((badge) => badge.tone === 'hot')
  ) {
    badgeList.push({ label: 'ОСТРО', tone: 'hot' as BadgeTone });
  }

  const badges = badgeList.length ? badgeList : undefined;

  const nutrition = [
    ['Белки', item.proteins],
    ['Жиры', item.fats],
    ['Углеводы', item.carbohydrates],
    ['Ккал', item.calories],
  ]
    .filter(
      (row): row is [string, number | string] =>
        row[1] !== undefined && row[1] !== null && String(row[1]).length > 0
    )
    .map(([label, value]) => ({ label, value: String(value) }));

  const description = htmlToPlainText(
    firstNonEmptyText(item.marc_desc, item.tmp_desc, item.text)
  );

  return {
    id: String(item.id ?? title),
    catId: item.cat_id === undefined ? undefined : String(item.cat_id),
    title,
    image,
    imageKey: isValidMediaKey(imgKey) ? imgKey : undefined,
    description,
    link: item.link ? String(item.link) : undefined,
    detailText: htmlToPlainText(
      firstNonEmptyText(
        item.marc_desc_full,
        item.marc_desc,
        item.tmp_desc,
        item.text
      )
    ),
    composition: htmlToPlainText(item.sostav ?? item.composition),
    weight: item.weight === undefined ? undefined : String(item.weight),
    nutrition: nutrition.length ? nutrition : undefined,
    info: {
      catId: item.cat_id === undefined ? undefined : String(item.cat_id),
      productId: item.id === undefined ? undefined : String(item.id),
      countPart:
        item.count_part === undefined ? undefined : String(item.count_part),
      countPartNew:
        item.count_part_new === undefined
          ? undefined
          : String(item.count_part_new),
      sizePizza:
        item.size_pizza === undefined ? undefined : String(item.size_pizza),
      weight: item.weight === undefined ? undefined : String(item.weight),
    },
    meta: item.cat_name ? [String(item.cat_name)] : undefined,
    price,
    oldPrice: item.old_price ? Number(item.old_price) : undefined,
    badges,
    tagIds: Array.isArray(item.tags)
      ? item.tags.map((tag) => String(tag))
      : undefined,
    raw: item as Record<string, unknown>,
  };
}

function bannerProducts(
  rawProducts: unknown[] | undefined,
  allProducts: HomeProduct[]
): HomeProduct[] {
  if (!Array.isArray(rawProducts)) {
    return [];
  }

  return rawProducts
    .map((row) => {
      const item = row as {
        id?: number | string;
        item_id?: number | string;
        price?: number | string;
      };
      const id = String(item.id ?? item.item_id ?? '');
      const base =
        allProducts.find((product) => product.id === id) ??
        mapProduct(row as HomeProductSource);
      if (!base) {
        return null;
      }

      const promoPrice = Number(item.price);
      if (Number.isFinite(promoPrice) && promoPrice > 0) {
        return { ...base, price: promoPrice };
      }

      return base;
    })
    .filter((item): item is HomeProduct => Boolean(item))
    .slice(0, 8);
}

export function mapBanners(
  banners: unknown[],
  allProducts: HomeProduct[]
): HomeBannerSlide[] {
  const slides: HomeBannerSlide[] = [];

  banners.forEach((raw, index) => {
    const item = raw as {
      id?: number | string;
      img?: string;
      name?: string;
      title?: string;
      text?: string;
      description?: string;
      button_name?: string;
      item?: unknown[];
      items?: unknown[];
      products?: unknown[];
      info?:
        | {
            name?: string;
            city_id?: number | string;
            promo_action?: number | string;
            items_add?: unknown[];
            items_on_price?: unknown[];
          }
        | unknown[];
    };
    const mediaKey = String(item.img ?? '').trim();
    if (!isValidMediaKey(mediaKey)) {
      return;
    }

    const info =
      item.info && typeof item.info === 'object' && !Array.isArray(item.info)
        ? item.info
        : undefined;
    const promoAction = Number(info?.promo_action ?? 0);
    const promoName = info?.name ? String(info.name).trim() : '';
    const promoText = item.text ?? item.description;
    const promoTextValue =
      promoText === undefined || promoText === null
        ? undefined
        : String(promoText);

    slides.push({
      id: String(item.id ?? index),
      image: resolveBannerImageUrl(mediaKey, 'compact'),
      imageWide: resolveBannerImageUrl(mediaKey, 'expanded'),
      alt: item.name
        ? String(item.name)
        : item.title
          ? String(item.title)
          : undefined,
      title: item.title
        ? String(item.title)
        : item.name
          ? String(item.name)
          : undefined,
      text: promoTextValue,
      buttonLabel: item.button_name ? String(item.button_name) : undefined,
      promoAction: Number.isFinite(promoAction) ? promoAction : 0,
      promoInfo:
        promoName.length > 0
          ? {
              name: promoName,
              cityId: String(info?.city_id ?? ''),
            }
          : undefined,
      products: bannerProducts(
        info?.items_add ??
          info?.items_on_price ??
          item.item ??
          item.items ??
          item.products,
        allProducts
      ),
    });
  });

  return slides;
}

function defaultFooterGroups(citySlug: string): HomeFooterLinkGroup[] {
  return [
    {
      title: 'Жако',
      items: [
        { label: 'О компании', href: cityPath(citySlug, 'about') },
        {
          label: 'Реквизиты',
          href: cityPath(citySlug, 'company-details'),
        },
        { label: 'Контакты', href: cityPath(citySlug, 'contacts') },
      ],
    },
    {
      title: 'Документы',
      items: [
        {
          label: 'Публичная оферта',
          href: cityPath(citySlug, 'publichnaya-oferta'),
        },
        {
          label: 'Политика конфиденциальности',
          href: cityPath(citySlug, 'politika-konfidencialnosti'),
        },
        {
          label: 'Согласие на обработку персональных данных',
          href: cityPath(citySlug, 'legal'),
        },
        {
          label: 'Политика в отношении обработки метрических данных',
          href: cityPath(citySlug, 'politika-legal'),
        },
        {
          label: 'Правила оплаты',
          href: cityPath(citySlug, 'instpayorders'),
        },
        { label: 'Карта сайта', href: cityPath(citySlug, 'sitemap') },
      ],
    },
    {
      title: 'Работа в жако',
      items: [{ label: 'Вакансии', href: cityPath(citySlug, 'jobs') }],
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
  const groups = defaultFooterGroups(citySlug);
  const allergenHref = links?.link_allergens;

  if (typeof allergenHref !== 'string' || !allergenHref.trim()) {
    return groups;
  }

  const docsGroup = groups.find((group) => group.title === 'Документы');
  if (!docsGroup) {
    return groups;
  }

  return groups.map((group) =>
    group.title === 'Документы'
      ? {
          ...group,
          items: [
            {
              label: 'Калорийность, состав, БЖУ',
              href: allergenHref,
            },
            ...group.items,
          ],
        }
      : group
  );
}

export function mapTags(tags: unknown[]): HomeTagFilterItem[] {
  return (tags as HomeTagSource[])
    .map((tag, index): HomeTagFilterItem | null => {
      const label = String(tag.name ?? tag.title ?? tag.tag ?? '').trim();
      if (!label) {
        return null;
      }

      const normalized = label.toLowerCase();

      return {
        label,
        id:
          (tag as { id?: number | string }).id === undefined
            ? String(index)
            : String((tag as { id?: number | string }).id),
        active: false,
        tone:
          normalized === 'новинка' || normalized === 'new' ? 'new' : 'default',
      };
    })
    .filter((tag): tag is HomeTagFilterItem => Boolean(tag))
    .slice(0, 24);
}

export function mapHomeCatalogView(cats: unknown[], allItems: unknown[]) {
  const productsFromApi = flattenRawProducts(allItems)
    .map((item) => mapProduct(item as HomeProductSource))
    .filter((item): item is HomeProduct => Boolean(item));

  const products = productsFromApi;
  const primary = flattenCategoryItems(cats);
  const secondary = primary[0]?.children?.length
    ? primary[0].children
    : primary;
  const productGroups: HomeProductGroup[] = mapProductGroups(cats, products);

  return {
    categoryPrimary: primary,
    categorySecondary: secondary,
    products,
    productGroups,
  };
}

export function mapHomePageViewModel(data: HomePageRawData): HomePageViewModel {
  const cats = data.cats;
  const normalizedCats = normalizeCategories(cats);
  // Catalog cards are filled client-side via `get_items_cat` (SSR `all_items` is shallow).
  const catalog = mapHomeCatalogView(cats, []);

  return {
    citySlug: data.city,
    cityLabel: resolveCityLabel(data.city, data.cities),
    pageTitle: String((data.page as { title?: string })?.title ?? 'Жако'),
    headerNav: buildHeaderNavItems(data.city, normalizedCats, {
      activePage: 'home',
    }),
    categoryPrimary: catalog.categoryPrimary,
    categorySecondary: catalog.categorySecondary,
    banners: mapBanners(data.banners, catalog.products),
    tags: mapTags(data.tags),
    products: catalog.products,
    productGroups: catalog.productGroups,
    footerLinks: mapFooterLinks(data.city, data.links),
    footerSocialLinks: mapFooterSocialLinks(data.links),
  };
}
