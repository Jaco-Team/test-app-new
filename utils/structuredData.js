const SITE = 'https://jacofood.ru';
const ORGANIZATION_ID = `${SITE}/#organization`;

const CITY_NAMES = {
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

export function organizationSchema(links) {
  const sameAs = socialLinks(links);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Жако Роллы и Пицца',
    url: `${SITE}/`,
    logo: url('/Jaco-Logo-PC.png'),
    ...(sameAs.length ? { sameAs } : {}),
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
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function menuSchema(city, categories) {
  if (!CITY_NAMES[city]) return null;
  const sections = (Array.isArray(categories) ? categories : [])
    .filter((category) => clean(category?.name) && clean(category?.link))
    .map((category) => ({
      '@type': 'MenuSection',
      name: clean(category.name),
      url: cityUrl(city, `/menu/${encodeURIComponent(category.link)}`),
    }));
  if (!sections.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${cityUrl(city, '/menu')}#menu`,
    name: `Меню Жако — ${CITY_NAMES[city]}`,
    url: cityUrl(city, '/menu'),
    hasMenuSection: sections,
  };
}

export function categorySchema(city, slug, catalog) {
  if (!CITY_NAMES[city] || !clean(slug) || !Array.isArray(catalog?.items)) {
    return null;
  }

  const main = (catalog.main_cat || []).find(
    (category) => category?.link === slug || category?.main_link === slug
  );
  const sections = catalog.items.filter(
    (section) =>
      section?.link === slug ||
      section?.main_link === slug ||
      (main && String(section?.main_id) === String(main.id))
  );
  const hasMenuSection = sections
    .map((section) => {
      const hasMenuItem = (Array.isArray(section?.items) ? section.items : [])
        .filter((item) => clean(item?.name) && Number(item?.price) > 0)
        .map((item) => {
          const description = plainText(item?.tmp_desc || item?.marc_desc);
          return {
            '@type': 'MenuItem',
            name: clean(item.name),
            ...(description ? { description } : {}),
            offers: {
              '@type': 'Offer',
              price: Number(item.price),
              priceCurrency: 'RUB',
            },
          };
        });
      if (!clean(section?.name) || !hasMenuItem.length) return null;
      return {
        '@type': 'MenuSection',
        name: clean(section.name),
        hasMenuItem,
      };
    })
    .filter(Boolean);
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
  const startDate = isoDate(banner.date_start);
  const endDate = isoDate(banner.date_end);
  const shared = {
    '@context': 'https://schema.org',
    name: plainText(banner.title),
    url: pageUrl,
    ...(description ? { description } : {}),
  };
  if (clean(banner.link).toLowerCase() === 'konkurs_otzivov') {
    if (!startDate || !endDate) return null;
    return {
      ...shared,
      '@type': 'Event',
      '@id': `${pageUrl}#event`,
      startDate,
      endDate,
    };
  }
  return {
    ...shared,
    '@type': 'Offer',
    '@id': `${pageUrl}#offer`,
    priceCurrency: 'RUB',
    ...(startDate ? { availabilityStarts: startDate } : {}),
    ...(endDate ? { validThrough: endDate } : {}),
  };
}

export function articleSchema(city, page) {
  const headline = plainText(page?.page_h);
  const articleBody = plainText(page?.content);
  if (!CITY_NAMES[city] || !headline || !articleBody) return null;
  const pageUrl = cityUrl(city, '/pamiatka_po_sohraneniiu_zdorovia');
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
  const unique = new Map();
  for (const point of Array.isArray(points) ? points : []) {
    if (clean(point?.addr) && clean(point?.phone)) {
      unique.set(String(point.id ?? point.addr), point);
    }
  }
  const locations = [...unique.values()].map((point) => {
    const latitude = Number(point?.xy_point?.latitude);
    const longitude = Number(point?.xy_point?.longitude);
    return {
      '@type': 'LocalBusiness',
      '@id': `${cityUrl(city, '/contacts')}#point-${encodeURIComponent(point.id ?? point.addr)}`,
      name: `Жако — ${clean(point.addr)}`,
      url: cityUrl(city, '/contacts'),
      telephone: clean(point.phone),
      parentOrganization: { '@id': ORGANIZATION_ID },
      address: {
        '@type': 'PostalAddress',
        streetAddress: clean(point.addr),
        addressLocality: CITY_NAMES[city],
        addressRegion: 'Самарская область',
        addressCountry: 'RU',
      },
      ...(point?.xy_point?.latitude != null &&
      point?.xy_point?.longitude != null &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
        ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } }
        : {}),
    };
  });
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
    serviceType: 'Доставка еды',
    url: pageUrl,
    areaServed: { '@type': 'City', name: CITY_NAMES[city] },
    provider: { '@id': ORGANIZATION_ID },
  };
}

export function serializeStructuredData(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
