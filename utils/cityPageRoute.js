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
    classNamePC: 'PageTextPC PageTextInfo PageStorageConditions',
    classNameMobile: 'PageTextMobile PageTextInfo PageStorageConditions',
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
    ['null', 'undefined', 'nan'].includes(slug) ||
    !/^[a-z0-9][a-z0-9_-]{0,190}$/.test(slug)
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
  // API использует info для данных подвала, а не для CMS-страницы.
  if (slug === 'info') return { type: 'notFound' };

  const data = await loadPage(city, slug);

  if (data?.st === false) return { type: 'unavailable' };

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

  return content.replace(
    /(<a\b[^>]*?\s+href\s*=\s*)(["'])(\/[^"']*)\2/gi,
    (link, prefix, quote, href) => {
      // Внешние ссылки и явный выбор города уже имеют готовый адрес.
      if (/^\/\//.test(href) || /^\/(samara|togliatti)(?:[/?#]|$)/i.test(href)) {
        return link;
      }

      return `${prefix}${quote}/${city}${href}${quote}`;
    }
  );
}
