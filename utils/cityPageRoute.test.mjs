import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cityPageIsCatalogCategory,
  getCityTextPagePresentation,
  normalizeCityPageSlug,
  resolveCityPage,
  rewriteCityRelativeLinks,
} from './cityPageRoute.js';
import { catalogRoute } from './catalogRoute.js';

test('applies the catalog route boundary to dynamic city pages', () => {
  assert.deepEqual(catalogRoute('samara', 'firmennye-rolly'), {
    city: 'samara',
    category: 'firmennye-rolly',
  });
  assert.equal(catalogRoute('unknown-city', 'jobs'), null);
  assert.equal(catalogRoute('samara', 'rolly&sa=u'), null);
  assert.equal(catalogRoute('samara', '../menu'), null);
});

test('normalizes a route slug and rejects empty or path-like values', () => {
  assert.equal(normalizeCityPageSlug(' Legal '), 'legal');
  assert.equal(normalizeCityPageSlug(['jobs']), 'jobs');
  assert.equal(normalizeCityPageSlug(''), '');
  assert.equal(normalizeCityPageSlug('null'), '');
  assert.equal(normalizeCityPageSlug('../jobs'), '');
  assert.equal(normalizeCityPageSlug('a'.repeat(121)), 'a'.repeat(121));
  assert.equal(normalizeCityPageSlug('a'.repeat(191)), 'a'.repeat(191));
  assert.equal(normalizeCityPageSlug('a'.repeat(192)), '');
});

test('loads a text page with one CMS lookup', async () => {
  let pageLookupCount = 0;

  const result = await resolveCityPage({
    city: 'samara',
    slug: 'jobs',
    loadPage: async () => {
      pageLookupCount += 1;
      return { page: { page_h: 'Работа', category_id: 0 } };
    },
  });

  assert.deepEqual(result, {
    type: 'text',
    data: { page: { page_h: 'Работа', category_id: 0 } },
  });
  assert.equal(pageLookupCount, 1);
});

test('preserves the legacy permanent category redirect', async () => {
  const result = await resolveCityPage({
    city: 'togliatti',
    slug: 'firmennye-rolly',
    loadPage: async () => ({ page: { category_id: '12' } }),
  });

  assert.deepEqual(result, {
    type: 'redirect',
    destination: '/togliatti/menu/firmennye-rolly',
    permanent: true,
  });
  assert.equal(cityPageIsCatalogCategory({ page: {} }, 'rolly'), true);
});

test('returns not found for an unknown slug', async () => {
  const result = await resolveCityPage({
    city: 'samara',
    slug: 'missing-page',
    loadPage: async () => ({ page: null }),
  });

  assert.deepEqual(result, { type: 'notFound' });
});

test('не отображает служебный ответ подвала как CMS-страницу', async () => {
  let requested = false;
  const result = await resolveCityPage({
    city: 'samara',
    slug: 'info',
    loadPage: async () => {
      requested = true;
      return { page: { link_vk: 'https://vk.ru/example', content: '' } };
    },
  });
  assert.deepEqual(result, { type: 'notFound' });
  assert.equal(requested, false);
});

test('does not treat a CMS request failure as a missing page', async () => {
  const result = await resolveCityPage({
    city: 'samara',
    slug: 'sss',
    loadPage: async () => ({ st: false }),
  });

  assert.deepEqual(result, { type: 'unavailable' });
});

test('keeps legacy presentation exceptions while defaulting new CMS pages', () => {
  assert.deepEqual(getCityTextPagePresentation('new-cms-page'), {
    activePage: 'new-cms-page',
    classNamePC: 'PageTextPC',
    classNameMobile: 'PageTextMobile',
    rewriteCityLinks: true,
  });
  assert.equal(getCityTextPagePresentation('legal').classNamePC, 'PAGELegal');
  assert.equal(getCityTextPagePresentation('dostavka').schemaType, 'delivery');
  assert.match(
    getCityTextPagePresentation(
      'sroki_godnosti_i_usloviia_hraneniia_gotovyh_bliud'
    ).classNamePC,
    /PageStorageConditions/
  );
  assert.equal(
    getCityTextPagePresentation('company-details').rootClass,
    'companyDetailsTabletPage'
  );
});

test('rewrites relative page links with the current city', () => {
  assert.equal(
    rewriteCityRelativeLinks('<a href="/menu">Меню</a>', 'samara'),
    '<a href="/samara/menu">Меню</a>'
  );
  assert.equal(rewriteCityRelativeLinks(null, 'samara'), '');
});

test('не добавляет город повторно и сохраняет явно выбранный другой город', () => {
  const content = '<a href="/samara/menu">Меню</a><a href="/togliatti/jobs">Работа</a>';
  assert.equal(rewriteCityRelativeLinks(content, 'samara'), content);
  const rewritten = rewriteCityRelativeLinks('<a href="/menu?tag=hit#rolls">Меню</a>', 'samara');
  assert.equal(rewritten, '<a href="/samara/menu?tag=hit#rolls">Меню</a>');
  assert.equal(rewriteCityRelativeLinks(rewritten, 'samara'), rewritten);
});

test('сохраняет внешние ссылки и поддерживает атрибуты перед href', () => {
  const external = '<a href="//example.com/page">Внешняя</a><a href="https://example.com">Сайт</a>';
  assert.equal(rewriteCityRelativeLinks(external, 'samara'), external);
  assert.equal(
    rewriteCityRelativeLinks("<a class='link' href='/menu'>Меню</a>", 'togliatti'),
    "<a class='link' href='/togliatti/menu'>Меню</a>"
  );
  assert.equal(
    rewriteCityRelativeLinks('<a href="/menu" data-href="/preview">Меню</a>', 'samara'),
    '<a href="/samara/menu" data-href="/preview">Меню</a>'
  );
});
