import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.SITE_API_TEST_BASE_URL;

test(
  'каталог бэкенда для Самары и Тольятти сохраняет контракт корзины',
  {
    skip:
      !baseUrl && 'Укажите SITE_API_TEST_BASE_URL для проверки запущенного API',
  },
  async () => {
    const catalogs = {};

    for (const city of ['samara', 'togliatti']) {
      const url = new URL('home', `${baseUrl.replace(/\/+$/, '')}/`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          type: 'get_page_info',
          city_id: city,
          page: 'menu',
        }),
        signal: AbortSignal.timeout(15_000),
      });

      assert.equal(response.status, 200, `${city}: HTTP ${response.status}`);
      const catalog = await response.json();
      assert.ok(
        catalog.page && typeof catalog.page === 'object',
        `${city}: page`
      );
      assert.ok(Array.isArray(catalog.cats), `${city}: cats`);
      assert.ok(Array.isArray(catalog.all_items), `${city}: all_items`);
      assert.ok(catalog.all_items.length > 0, `${city}: пустой каталог`);

      for (const item of catalog.all_items) {
        assert.ok(
          Number.isInteger(Number(item.id)) && Number(item.id) > 0,
          `${city}: id`
        );
        assert.ok(
          Number.isFinite(Number(item.price)),
          `${city}: price для ${item.id}`
        );
      }

      catalogs[city] = catalog;
    }

    const samaraIds = new Set(
      catalogs.samara.all_items.map((item) => Number(item.id))
    );
    const shared = catalogs.togliatti.all_items.filter((item) =>
      samaraIds.has(Number(item.id))
    );
    assert.ok(
      shared.length > 0,
      'Нет общих товаров для проверки переноса корзины'
    );
  }
);
