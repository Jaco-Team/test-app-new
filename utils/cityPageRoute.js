const TEXT_PAGE_OVERRIDES = {
  jobs: {
    classNamePC: 'PAGEjobs',
    footerActivePage: 'jobs',
    rewriteCityLinks: false,
  },
  legal: {
    classNamePC: 'PAGELegal',
    footerActivePage: 'legal',
    rewriteCityLinks: false,
  },
  muzyka_v_kafe: {
    classNamePC: 'PageTextPC PageTextInfo',
    classNameMobile: 'PageTextMobile PageTextInfo',
  },
  beskontaktnyy_dostup: {
    classNamePC: 'PageTextPC PageTextInfo',
    classNameMobile: 'PageTextMobile PageTextInfo',
  },
  sroki_godnosti_i_usloviia_hraneniia_gotovyh_bliud: {
    classNamePC: 'PageTextPC PageTextInfo',
    classNameMobile: 'PageTextMobile PageTextInfo',
  },
  'company-details': {
    contentWrapperClass: 'companyDetailsTabletPageContent',
    footerWrapperClass: 'companyDetailsTabletPageFooter',
    rootClass: 'companyDetailsTabletPage',
  },
  dostavka: { schemaType: 'delivery' },
  pamiatka_po_sohraneniiu_zdorovia: { schemaType: 'article' },
};

export function normalizeCityPageSlug(value) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const slug = String(candidate ?? '')
    .trim()
    .toLowerCase();

  if (
    !slug ||
    slug === 'null' ||
    slug === 'undefined' ||
    slug === 'nan' ||
    slug.includes('/') ||
    slug.includes('\\') ||
    slug.length > 120
  ) {
    return '';
  }

  return slug;
}

export function cityPageIsCatalogCategory(data, slug) {
  if (!data?.page) return false;

  const categoryId = Number.parseInt(data.page.category_id, 10);

  return categoryId > 0 || slug === 'rolly';
}

export async function resolveCityPage({ city, slug, loadPage }) {
  const data = await loadPage(city, slug);

  if (data?.st === false) {
    return { type: 'unavailable' };
  }

  if (cityPageIsCatalogCategory(data, slug)) {
    return {
      type: 'redirect',
      destination: `/${city}/menu/${slug}`,
      permanent: true,
    };
  }

  if (data?.page) {
    return { type: 'text', data };
  }

  return { type: 'notFound' };
}

export function getCityTextPagePresentation(slug) {
  return {
    activePage: slug,
    classNamePC: 'PageTextPC',
    classNameMobile: 'PageTextMobile',
    rewriteCityLinks: true,
    ...TEXT_PAGE_OVERRIDES[slug],
  };
}

export function rewriteCityRelativeLinks(content, city) {
  if (typeof content !== 'string') return '';

  return content.replace(/<a href="\//g, `<a href="/${city}/`);
}
