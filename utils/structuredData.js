import { getItemImageUrl, hasItemImage } from './itemImage';

const SITE = 'https://jacofood.ru';
const ORGANIZATION_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const LANGUAGE = 'ru-RU';

export const CITY_NAMES = {
  samara: 'Самара',
  togliatti: 'Тольятти',
};

const clean = (value) => String(value ?? '').trim();
const url = (path) => `${SITE}${path}`;
const cityUrl = (city, path = '') => url(`/${city}${path}`);

function plainText(html) {
  return clean(html)
    .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|thinsp);/gi, ' ')
    .replace(/&laquo;/gi, '«')
    .replace(/&raquo;/gi, '»')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (match, code) => {
      const point = Number(code);
      return point >= 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function isoDate(value) {
  const match = clean(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : undefined;
}

function socialLinks(links) {
  return [links?.link_vk, links?.link_tg, links?.link_ok, links?.link_rt]
    .map(clean)
    .filter((value) => /^https:\/\//i.test(value));
}

export function organizationSchema(links, page) {
  const sameAs = socialLinks(links);
  const description = plainText(page?.description);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Жако Роллы и Пицца',
    url: `${SITE}/`,
    logo: url('/Jaco-Logo-PC.png'),
    ...(description ? { description } : {}),
    areaServed: Object.values(CITY_NAMES).map((name) => ({
      '@type': 'City',
      name,
    })),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema(page) {
  const description = plainText(page?.description);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE}/`,
    name: 'Жако Роллы и Пицца',
    inLanguage: LANGUAGE,
    publisher: { '@id': ORGANIZATION_ID },
    ...(description ? { description } : {}),
  };
}

// Несколько сущностей одной страницы — одним блоком @graph.
export function schemaGraph(...nodes) {
  const graph = nodes
    .flat()
    .filter(Boolean)
    .flatMap((node) => {
      const { '@context': _context, '@graph': inner, ...rest } = node;
      return Array.isArray(inner) ? inner : [rest];
    });
  return graph.length
    ? { '@context': 'https://schema.org', '@graph': graph }
    : null;
}

/**
 * Хлебные крошки только в разметке (в интерфейсе их нет): город → раздел → страница.
 * trail: [{ name, path }] — path относительно города, например '/menu/pizza'.
 */
export function breadcrumbSchema(city, trail) {
  if (!CITY_NAMES[city]) return null;
  const items = (Array.isArray(trail) ? trail : [])
    .map((item) => ({ name: plainText(item?.name), path: clean(item?.path) }))
    .filter((item) => item.name && item.path.startsWith('/'));
  if (!items.length) return null;
  const all = [{ name: `Жако — ${CITY_NAMES[city]}`, path: '' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${cityUrl(city, all[all.length - 1].path)}#breadcrumbs`,
    itemListElement: all.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: cityUrl(city, item.path),
    })),
  };
}

function pointGeo(point) {
  let xy = point?.xy_point;
  if (typeof xy === 'string') {
    try {
      xy = JSON.parse(xy);
    } catch {
      xy = null;
    }
  }
  if (xy?.latitude == null || xy?.longitude == null) return null;
  const latitude = Number(xy.latitude);
  const longitude = Number(xy.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { '@type': 'GeoCoordinates', latitude, longitude }
    : null;
}

function uniquePoints(points) {
  const unique = new Map();
  for (const point of Array.isArray(points) ? points : []) {
    if (clean(point?.addr) && clean(point?.phone)) {
      unique.set(String(point.id ?? point.addr), point);
    }
  }
  return [...unique.values()];
}

// Одно кафе: только то, что отдаёт API точек (адрес, телефон, координаты).
function pointNode(city, point) {
  const geo = pointGeo(point);
  return {
    '@type': 'Restaurant',
    '@id': `${cityUrl(city, '/contacts')}#point-${encodeURIComponent(point.id ?? point.addr)}`,
    name: `Жако — ${clean(point.addr)}`,
    url: cityUrl(city, '/contacts'),
    telephone: clean(point.phone),
    parentOrganization: { '@id': ORGANIZATION_ID },
    servesCuisine: ['Японская кухня', 'Итальянская кухня'],
    hasMenu: cityUrl(city, '/menu'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: clean(point.addr),
      addressLocality: CITY_NAMES[city],
      addressRegion: 'Самарская область',
      addressCountry: 'RU',
    },
    ...(geo ? { geo } : {}),
  };
}

export function restaurantSchema(city, points, links) {
  const cityName = CITY_NAMES[city];
  const point = (Array.isArray(points) ? points : []).find(
    (item) => clean(item?.phone) && clean(item?.addr)
  );
  if (!cityName || !point) return null;

  const sameAs = socialLinks(links);
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${cityUrl(city)}#restaurant`,
    name: `Жако Роллы и Пицца — ${cityName}`,
    url: cityUrl(city),
    telephone: clean(point.phone),
    image: url('/Jaco-Logo-PC.png'),
    branchOf: { '@id': ORGANIZATION_ID },
    servesCuisine: ['Японская кухня', 'Итальянская кухня'],
    areaServed: { '@type': 'City', name: cityName },
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: 'Самарская область',
      addressCountry: 'RU',
    },
    hasMenu: cityUrl(city, '/menu'),
    // Кафе города с адресами и координатами — те же узлы, что на странице контактов.
    department: uniquePoints(points).map((item) => ({
      '@id': pointNode(city, item)['@id'],
      '@type': 'Restaurant',
      name: `Жако — ${clean(item.addr)}`,
      telephone: clean(item.phone),
      address: pointNode(city, item).address,
      ...(pointGeo(item) ? { geo: pointGeo(item) } : {}),
    })),
    potentialAction: {
      '@type': 'OrderAction',
      target: cityUrl(city, '/menu'),
      deliveryMethod: [
        'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet',
        'http://purl.org/goodrelations/v1#DeliveryModePickUp',
      ],
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

const ITEM_UNIT_LITRE_CATEGORY = 6;
const ITEM_UNIT_PIECE_IDS = new Set([17, 237]);

// Как в карточке товара: напитки в литрах, палочки/приборы в штуках, остальное в граммах.
function servingSize(item) {
  const weight = Number(item?.weight);
  if (!Number.isFinite(weight) || weight <= 0) return '';
  const unit = ITEM_UNIT_PIECE_IDS.has(Number(item?.id))
    ? 'шт.'
    : Number(item?.cat_id) === ITEM_UNIT_LITRE_CATEGORY
      ? 'л'
      : 'г';
  return `${weight} ${unit}`;
}

const decimal = (value) => {
  const number = Number(clean(value).replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
};

// API отдаёт КБЖУ на 100 г. В разметке рядом стоит вес порции (servingSize), поэтому
// значения пересчитываются на всё блюдо — так же, как в карточке товара на сайте.
// Для напитков (литры) и штучных позиций пересчёта нет: публикуется только размер порции.
function nutrition(item) {
  const size = servingSize(item);
  const weight = Number(item?.weight);
  const inGrams = size.endsWith(' г');
  const perServing = (value) => {
    const per100 = decimal(value);
    return inGrams && per100 != null ? (per100 * weight) / 100 : null;
  };
  const calories = perServing(item?.kkal);
  const protein = perServing(item?.protein);
  const fat = perServing(item?.fat);
  const carbohydrates = perServing(item?.carbohydrates);
  if (!size) return null;
  const grams = (value) => `${Math.round(value * 10) / 10} г`;
  return {
    '@type': 'NutritionInformation',
    servingSize: size,
    ...(calories != null ? { calories: `${Math.round(calories)} ккал` } : {}),
    ...(protein != null ? { proteinContent: grams(protein) } : {}),
    ...(fat != null ? { fatContent: grams(fat) } : {}),
    ...(carbohydrates != null
      ? { carbohydrateContent: grams(carbohydrates) }
      : {}),
  };
}

function menuItemNode(item) {
  const description = plainText(item?.tmp_desc || item?.marc_desc);
  const itemNutrition = nutrition(item);
  return {
    '@type': 'MenuItem',
    name: clean(item.name),
    ...(description ? { description } : {}),
    ...(hasItemImage(item?.img_app) && process.env.NEXT_PUBLIC_YANDEX_IMG
      ? { image: getItemImageUrl(item.img_app, '585x585') }
      : {}),
    ...(itemNutrition ? { nutrition: itemNutrition } : {}),
    offers: {
      '@type': 'Offer',
      price: Number(item.price),
      priceCurrency: 'RUB',
    },
  };
}

function menuSectionNodes(sections) {
  return (Array.isArray(sections) ? sections : [])
    .map((section) => {
      const hasMenuItem = (Array.isArray(section?.items) ? section.items : [])
        .filter((item) => clean(item?.name) && Number(item?.price) > 0)
        .map(menuItemNode);
      if (!clean(section?.name) || !hasMenuItem.length) return null;
      return {
        '@type': 'MenuSection',
        name: clean(section.name),
        hasMenuItem,
      };
    })
    .filter(Boolean);
}

// Разделы каталога, относящиеся к странице категории (тот же отбор, что у карточек).
export function catalogSectionsFor(catalog, slug) {
  const sections = Array.isArray(catalog?.items) ? catalog.items : [];
  if (!clean(slug)) return sections;
  const main = (catalog?.main_cat || []).find(
    (category) => category?.link === slug || category?.main_link === slug
  );
  return sections.filter(
    (section) =>
      section?.link === slug ||
      section?.main_link === slug ||
      (main && String(section?.main_id) === String(main.id))
  );
}

export function menuSchema(city, categories, catalog) {
  if (!CITY_NAMES[city]) return null;
  const sections = (Array.isArray(categories) ? categories : [])
    .filter((category) => clean(category?.name) && clean(category?.link))
    .map((category) => ({
      '@type': 'MenuSection',
      name: clean(category.name),
      url: cityUrl(city, `/menu/${encodeURIComponent(category.link)}`),
    }));
  // На странице меню показаны все блюда — при наличии каталога размечаем их целиком.
  const fullSections = menuSectionNodes(catalogSectionsFor(catalog, ''));
  if (!sections.length && !fullSections.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${cityUrl(city, '/menu')}#menu`,
    name: `Меню Жако — ${CITY_NAMES[city]}`,
    url: cityUrl(city, '/menu'),
    hasMenuSection: fullSections.length ? fullSections : sections,
  };
}

export function categorySchema(city, slug, catalog) {
  if (!CITY_NAMES[city] || !clean(slug) || !Array.isArray(catalog?.items)) {
    return null;
  }
  const main = (catalog.main_cat || []).find(
    (category) => category?.link === slug || category?.main_link === slug
  );
  const hasMenuSection = menuSectionNodes(catalogSectionsFor(catalog, slug));
  if (!hasMenuSection.length) return null;
  const pageUrl = cityUrl(city, `/menu/${encodeURIComponent(slug)}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${pageUrl}#menu`,
    name: `${main?.name || hasMenuSection[0].name} — Жако ${CITY_NAMES[city]}`,
    url: pageUrl,
    hasMenuSection,
  };
}

// Название категории для хлебных крошек.
export function categoryName(catalog, slug) {
  const main = (catalog?.main_cat || []).find(
    (category) => category?.link === slug || category?.main_link === slug
  );
  const section = catalogSectionsFor(catalog, slug)[0];
  return clean(main?.name) || clean(section?.name);
}

const activeBanners = (banners) =>
  (Array.isArray(banners) ? banners : []).filter(
    (banner) =>
      Number(banner?.is_active) === 1 &&
      Number(banner?.is_active_actii) === 1 &&
      clean(banner?.link) &&
      clean(banner?.title)
  );

export function promotionListSchema(city, banners) {
  if (!CITY_NAMES[city]) return null;
  const itemListElement = activeBanners(banners).map((banner, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: plainText(banner.title),
    url: cityUrl(city, `/akcii/${encodeURIComponent(banner.link)}`),
  }));
  if (!itemListElement.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${cityUrl(city, '/akcii')}#offers`,
    name: `Акции Жако — ${CITY_NAMES[city]}`,
    itemListElement,
  };
}

export function promotionSchema(city, banner, noindex = false) {
  if (
    noindex ||
    !CITY_NAMES[city] ||
    !clean(banner?.link) ||
    !clean(banner?.title) ||
    Number(banner?.is_active_actii) !== 1 ||
    Number(banner?.is_active) !== 1
  )
    return null;

  const pageUrl = cityUrl(city, `/akcii/${encodeURIComponent(banner.link)}`);
  const description = plainText(banner.text);
  if (!description) return null;
  // Конкурс проходит во ВКонтакте без очной площадки. Даты баннера не описывают
  // отдельное мероприятие, поэтому разметка Event здесь неприменима.
  if (clean(banner.link).toLowerCase() === 'konkurs_otzivov') return null;
  const startDate = isoDate(banner.date_start);
  const endDate = isoDate(banner.date_end);
  const shared = {
    '@context': 'https://schema.org',
    name: plainText(banner.title),
    url: pageUrl,
    ...(description ? { description } : {}),
  };
  return {
    ...shared,
    '@type': 'Offer',
    '@id': `${pageUrl}#offer`,
    priceCurrency: 'RUB',
    ...(startDate ? { availabilityStarts: startDate } : {}),
    ...(endDate ? { validThrough: endDate } : {}),
  };
}

export function articleSchema(
  city,
  page,
  slug = 'pamiatka_po_sohraneniiu_zdorovia'
) {
  const headline = plainText(page?.page_h);
  const articleBody = plainText(page?.content);
  if (!CITY_NAMES[city] || !clean(slug) || !headline || !articleBody) {
    return null;
  }
  const pageUrl = cityUrl(city, `/${slug}`);
  const dateModified = isoDate(page?.date_time_update);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline,
    url: pageUrl,
    articleBody: articleBody.slice(0, 5000),
    author: { '@id': ORGANIZATION_ID },
    ...(dateModified ? { dateModified } : {}),
  };
}

export function contactLocationsSchema(city, points) {
  if (!CITY_NAMES[city]) return null;
  const locations = uniquePoints(points).map((point) => pointNode(city, point));
  if (!locations.length) return null;
  return { '@context': 'https://schema.org', '@graph': locations };
}

export function deliverySchema(city, page) {
  if (!CITY_NAMES[city] || !plainText(page?.page_h)) return null;
  const pageUrl = cityUrl(city, '/dostavka');
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: plainText(page.page_h),
    ...(plainText(page?.description)
      ? { description: plainText(page.description) }
      : {}),
    serviceType: 'Доставка еды',
    url: pageUrl,
    areaServed: { '@type': 'City', name: CITY_NAMES[city] },
    provider: { '@id': ORGANIZATION_ID },
  };
}

/**
 * Общая разметка текстовой страницы из CMS: заголовок, описание и дата изменения.
 * type: WebPage | AboutPage | ContactPage | CollectionPage.
 */
export function webPageSchema(city, slug, page, type = 'WebPage') {
  const name = plainText(page?.page_h) || plainText(page?.title);
  if (!CITY_NAMES[city] || !name) return null;
  const pageUrl = cityUrl(city, clean(slug) ? `/${slug}` : '');
  const description = plainText(page?.description);
  const dateModified = isoDate(page?.date_time_update);
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name,
    ...(description ? { description } : {}),
    inLanguage: LANGUAGE,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    ...(dateModified ? { dateModified } : {}),
  };
}

function tableRows(html) {
  return [...clean(html).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) =>
    [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map((cell) => plainText(cell[1]))
      .filter(Boolean)
  );
}

/**
 * Таблица «продукт — условия хранения» из текста страницы → ItemList.
 * Первая строка — шапка; строка с одной ячейкой продолжает предыдущий продукт (rowspan).
 */
export function storageConditionsSchema(city, slug, page) {
  if (!CITY_NAMES[city] || !clean(slug)) return null;
  const products = [];
  for (const cells of tableRows(page?.content).slice(1)) {
    if (cells.length >= 2) {
      products.push({ name: cells[0], conditions: [cells.slice(1).join('; ')] });
    } else if (cells.length === 1 && products.length) {
      products[products.length - 1].conditions.push(cells[0]);
    }
  }
  if (!products.length) return null;
  const pageUrl = cityUrl(city, `/${slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#storage`,
    name: plainText(page?.page_h) || 'Сроки годности и условия хранения',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      description: product.conditions.join('; '),
    })),
  };
}

// Разметка текстовой страницы города по её типу (utils/cityPageRoute.js → schemaType).
export function cityTextPageSchema(city, slug, page, schemaType) {
  const crumbs = breadcrumbSchema(city, [
    { name: page?.page_h || page?.title, path: `/${slug}` },
  ]);
  const webPage = webPageSchema(city, slug, page);

  if (schemaType === 'delivery') {
    return schemaGraph(deliverySchema(city, page), webPage, crumbs);
  }
  if (schemaType === 'article') {
    return schemaGraph(articleSchema(city, page, slug), webPage, crumbs);
  }
  if (schemaType === 'storage') {
    return schemaGraph(
      webPage,
      storageConditionsSchema(city, slug, page),
      crumbs
    );
  }
  return schemaGraph(webPage, crumbs);
}

export function serializeStructuredData(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
