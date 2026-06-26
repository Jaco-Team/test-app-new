import Meta from '@/components/meta.js';
import React, { useMemo } from 'react';
import Link from 'next/link';

const cleanLink = (s = '') =>
  String(s)
    .trim()
    .split(/[?#]/)[0]
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/_+$/g, '');

const cleanSlug = (s = '') => {
  const link = cleanLink(s);
  const parts = link.split('/').filter(Boolean);
  return (parts[parts.length - 1] || '').toLowerCase();
};

const isMenuPage = (it) => {
  const link = cleanLink(it?.link).toLowerCase();
  const name = String(it?.name ?? '')
    .trim()
    .toLowerCase();
  return link === 'menu' || link.startsWith('menu') || name === 'меню';
};

const isPromotionsPage = (it) => {
  const link = cleanLink(it?.link).toLowerCase();
  const name = String(it?.name ?? '')
    .trim()
    .toLowerCase();
  return link === 'akcii' || name === 'акции';
};

const normalizePages = (raw = []) => {
  if (!Array.isArray(raw)) return [];
  const map = new Map();

  for (const it of raw) {
    if (isMenuPage(it)) continue;
    if (isPromotionsPage(it)) continue;

    const link = cleanLink(it?.link);
    if (!link) continue;

    if (!map.has(link)) map.set(link, { ...it, link });
  }

  return Array.from(map.values());
};

const normalizeMenu = (category = []) => {
  if (!Array.isArray(category)) return [];
  return category.map((c) => ({
    id: c?.id ?? c?.link,
    name: c?.name ?? '',
    link: cleanLink(c?.link),
    parent_cat: Array.isArray(c?.parent_cat)
      ? c.parent_cat.map((p) => ({
          id: p?.id ?? p?.link,
          name: p?.name ?? '',
          link: cleanLink(p?.link),
          items: Array.isArray(p?.items) ? p.items : [],
        }))
      : [],
    items: Array.isArray(c?.items) ? c.items : [],
  }));
};

const normalizePromotions = (raw = []) => {
  if (!Array.isArray(raw)) return [];
  const map = new Map();

  for (const it of raw) {
    if (parseInt(it?.is_active_actii, 10) !== 1) continue;

    const link = cleanSlug(it?.link || it?.name);
    if (!link) continue;

    if (!map.has(link)) {
      map.set(link, {
        id: it?.id ?? link,
        name: it?.title || it?.name || link,
        link,
      });
    }
  }

  return Array.from(map.values());
};

export default function SitemapContent({
  page,
  city,
  sitemap_pages = [],
  sitemap_category = [],
  sitemap_promotions = [],
}) {
  const pages = useMemo(() => normalizePages(sitemap_pages), [sitemap_pages]);
  const menu = useMemo(
    () => normalizeMenu(sitemap_category),
    [sitemap_category]
  );
  const promotions = useMemo(
    () => normalizePromotions(sitemap_promotions),
    [sitemap_promotions]
  );

  const menuPage = useMemo(() => {
    if (!Array.isArray(sitemap_pages)) return null;

    const byName = sitemap_pages.find(
      (p) =>
        String(p?.name ?? '')
          .trim()
          .toLowerCase() === 'меню'
    );
    if (byName?.link) return cleanLink(byName.link);

    const byLink = sitemap_pages.find((p) =>
      cleanLink(p?.link).toLowerCase().startsWith('menu')
    );
    return byLink?.link ? cleanLink(byLink.link) : 'menu';
  }, [sitemap_pages]);

  const homeHref = `/${city}`;
  const pageHref = (link) => `/${city}/${link}`;
  const categoryHref = (link) => `/${city}/menu/${link}`;
  const promotionHref = (link) => `/${city}/akcii/${link}`;
  const itemHref = (itemLink) => ({
    pathname: `/${city}`,
    query: { item: itemLink },
  });

  const Tree = () => (
    <div className="SitemapTree">
      {/* Главная */}
      <section>
        <div className="SitemapSectionTitle">
          <Link className="SitemapRootLink" href={homeHref}>
            Главная
          </Link>
        </div>

        {!!pages.length && (
          <ul className="SitemapList">
            {pages.map((p) => (
              <li key={p.link} className="SitemapLi">
                <Link className="SitemapLink" href={pageHref(p.link)}>
                  {p.name || p.link}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Акции */}
      <section className="SitemapMenuBlock">
        <Link className="SitemapRootLink" href={pageHref('akcii')}>
          Акции
        </Link>

        {!!promotions.length && (
          <div className="SitemapCategory">
            <ul className="SitemapItemsList">
              {promotions.map((promo) => {
                const href = promotionHref(promo.link);

                return (
                  <li key={promo.id} className="SitemapItemLi">
                    <a className="SitemapItemLink" href={href}>
                      {promo.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Меню */}
      <section className="SitemapMenuBlock">
        <Link className="SitemapRootLink" href={pageHref(menuPage)}>
          Меню
        </Link>

        {menu.map((cat) => (
          <div key={cat.id} className="SitemapCategory">
            <div className="SitemapSectionTitle">
              {cat.link ? (
                <Link className="SitemapRootLink" href={categoryHref(cat.link)}>
                  {cat.name}
                </Link>
              ) : (
                cat.name
              )}
            </div>

            {!!cat.parent_cat?.length
              ? cat.parent_cat.map((sub) => (
                  <div key={sub.id} className="SitemapSubCategory">
                    <div className="SitemapSectionTitle">
                      {sub.link ? (
                        <Link
                          className="SitemapRootLink"
                          href={categoryHref(sub.link)}
                        >
                          {sub.name}
                        </Link>
                      ) : (
                        sub.name
                      )}
                    </div>

                    {!!sub.items?.length && (
                      <ul className="SitemapItemsList">
                        {sub.items.map((it) => (
                          <li key={it.id ?? it.link} className="SitemapItemLi">
                            <Link
                              className="SitemapItemLink"
                              href={itemHref(it.link)}
                            >
                              {it.name || it.link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              : null}

            {!cat.parent_cat?.length && !!cat.items?.length ? (
              <ul className="SitemapItemsList">
                {cat.items.map((it) => (
                  <li key={it.id ?? it.link} className="SitemapItemLi">
                    <Link className="SitemapItemLink" href={itemHref(it.link)}>
                      {it.name || it.link}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>
    </div>
  );

  return (
    <Meta title={page?.title ?? ''} description={page?.description ?? ''}>
      {/* Desktop */}
      <div className="SitemapWrap">
        <div className="SitemapInner">
          <h1 className="SitemapTitle">Карта сайта</h1>
          <Tree />
        </div>
      </div>

      {/* Mobile */}
      <div className="SitemapWrapMobile">
        <div className="SitemapInnerMobile">
          <h1 className="SitemapTitleMobile">Карта сайта</h1>
          <Tree />
        </div>
      </div>
    </Meta>
  );
}
