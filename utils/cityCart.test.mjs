import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCityDestination,
  isSupportedCity,
  reconcileCartItems,
} from './cityCart.js';

const catalog = {
  cats: [{ link: 'rolly' }],
  all_items: [
    { id: 10, name: 'Ролл', link: 'Roll', price: 250, cat_id: 1 },
    { id: 20, name: 'Пицца', link: 'Pizza', price: 500, cat_id: 2 },
  ],
};

test('сохраняет количество и заменяет цену и данные товара из нового каталога', () => {
  const result = reconcileCartItems(
    [
      { item_id: 10, name: 'Старое название', count: 2, one_price: 190 },
      { item_id: 20, count: 1, one_price: 490 },
    ],
    catalog.all_items
  );

  assert.deepEqual(
    result.items.map(({ item_id, name, count, one_price, all_price }) => ({
      item_id,
      name,
      count,
      one_price,
      all_price,
    })),
    [
      { item_id: 10, name: 'Ролл', count: 2, one_price: 250, all_price: 500 },
      { item_id: 20, name: 'Пицца', count: 1, one_price: 500, all_price: 500 },
    ]
  );
  assert.equal(result.itemsCount, 3);
  assert.equal(result.total, 1000);
  assert.deepEqual(result.removed, []);
});

test('удаляет отсутствующие товары и позиции без действительной цены', () => {
  const missing = { item_id: 30, name: 'Нет в городе', count: 1 };
  const invalidPrice = { item_id: 40, name: 'Без цены', count: 1 };
  const result = reconcileCartItems(
    [{ item_id: 10, count: 1 }, missing, invalidPrice],
    [...catalog.all_items, { id: 40, price: null }]
  );

  assert.deepEqual(
    result.items.map((item) => item.item_id),
    [10]
  );
  assert.deepEqual(result.removed, [missing, invalidPrice]);
  assert.equal(result.total, 250);
});

test('отбрасывает повреждённое количество и не принимает неизвестный город', () => {
  const result = reconcileCartItems(
    [
      { item_id: 10, count: 0 },
      { item_id: 20, count: 1.5 },
      { item_id: 10, count: 2 },
    ],
    catalog.all_items
  );

  assert.equal(result.itemsCount, 2);
  assert.equal(result.total, 500);
  assert.equal(result.removed.length, 2);
  assert.equal(isSupportedCity('samara'), true);
  assert.equal(isSupportedCity('togliatti'), true);
  assert.equal(isSupportedCity('unknown'), false);
});

test('сохраняет открытый раздел при наличии категории в новом городе', () => {
  assert.equal(
    buildCityDestination(
      '/samara/menu/rolly?utm=one&utm=two#list',
      'togliatti',
      catalog
    ),
    '/togliatti/menu/rolly?utm=one&utm=two#list'
  );
});

test('сохраняет повторяющиеся query-параметры, кодирование и hash', () => {
  const destination = buildCityDestination(
    '/samara/menu/rolly?utm_source=A%2FB&utm_source=second&item=Roll#details',
    'togliatti',
    catalog
  );

  assert.equal(
    destination,
    '/togliatti/menu/rolly?utm_source=A%2FB&utm_source=second&item=Roll#details'
  );
});

test('при недоступной категории или товаре открывает меню и сохраняет остальные параметры', () => {
  assert.equal(
    buildCityDestination(
      '/samara/menu/pizza?item=Pizza&utm=one&utm=two#top',
      'togliatti',
      catalog
    ),
    '/togliatti/menu?utm=one&utm=two#top'
  );
  assert.equal(
    buildCityDestination(
      '/samara/menu/rolly?item=Missing&utm=x#top',
      'togliatti',
      catalog
    ),
    '/togliatti/menu?utm=x#top'
  );
  assert.equal(
    buildCityDestination(
      '/samara?category=missing&utm=x#top',
      'togliatti',
      catalog
    ),
    '/togliatti/menu?utm=x#top'
  );
});
