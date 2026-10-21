import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getCartExtraGroups,
  getExtraCount,
  getExtraItemId,
} from '../../utils/cartExtras.js';

const cost = (items) => items.reduce(
  (total, item) => total + Number(item.count) * Number(item.one_price),
  0
);
const extrasCost = (groups) => cost([...groups.utensils, ...groups.sauces]);

test('приборы определяются по ID, а названия и остальные дополнения не меняют группу', () => {
  const groups = getCartExtraGroups([
    { id: '17', name: 'Соус' },
    { id: 237, name: 'Приправа' },
    { id: 19, name: 'Палочки', cat_id: 7 },
    { id: 20, name: 'Вилка', cat_id: 7 },
  ]);
  assert.deepEqual(groups.utensils.map(getExtraItemId), [17, 237]);
  assert.deepEqual(groups.sauces.map(getExtraItemId), [19, 20]);
});

test('выбранный новый соус вне dopListCart сохраняет цену, изображение и количество', () => {
  const groups = getCartExtraGroups(
    [{ id: 19, one_price: 20 }],
    [{ item_id: 999, count: 2 }],
    [{ id: 999, cat_id: 7, name: 'Новый соус', price: 45, img_app: 'sauce' }]
  );
  assert.deepEqual(groups.sauces.map(getExtraItemId), [19, 999]);
  assert.equal(groups.sauces[1].name, 'Новый соус');
  assert.equal(groups.sauces[1].img_app, 'sauce');
  assert.equal(groups.sauces[1].one_price, 45);
  assert.equal(groups.sauces[1].count, 2);
  assert.equal(extrasCost(groups), 90);
});

test('числовые и строковые ID дедуплицируются, актуальное количество берется из корзины', () => {
  const groups = getCartExtraGroups(
    [{ id: 19, count: 0, price: 20 }, { id: '19', count: 99, price: 20 }],
    [{ item_id: '19', cat_id: 7, count: 3 }]
  );
  assert.equal(groups.sauces.length, 1);
  assert.equal(groups.sauces[0].count, 3);
  assert.equal(extrasCost(groups), 60);
  assert.deepEqual([...groups.ids], [19]);
});

test('выбранный прибор не становится соусом при отсутствии в выдаче дополнений', () => {
  const groups = getCartExtraGroups([], [{ item_id: 237, count: 1 }], [
    { id: 237, price: 0 },
  ]);
  assert.deepEqual(groups.utensils.map(getExtraItemId), [237]);
  assert.equal(groups.sauces.length, 0);
});

test('обычный итог основных товаров и дополнений совпадает с прежним расчетом', () => {
  const main = [{ item_id: 114, count: 1, one_price: 1000 }];
  const dops = [
    { id: 17, count: 2, one_price: 0 },
    { id: 19, count: 2, one_price: 20 },
    { id: 20, count: 1, one_price: 35 },
  ];
  const items = [...main, ...dops.map((item) => ({ ...item, item_id: item.id, cat_id: 7 }))];
  const groups = getCartExtraGroups(dops, items, [], main);
  assert.equal(cost(main) + extrasCost(groups), cost(main) + cost(dops));
  assert.equal(cost(main) + extrasCost(groups), 1075);
});

test('подарок не подменяет счетчик платного соуса с тем же ID', () => {
  const paid = { item_id: 19, cat_id: 7, count: 2, one_price: 30 };
  const gift = {
    item_id: 19, cat_id: 7, count: 1, one_price: 30, all_price: 0, disabled: true,
  };
  const main = [{ item_id: 114, count: 1, one_price: 1000 }, gift];
  const groups = getCartExtraGroups(
    [{ id: 19, one_price: 30, count: 2 }],
    [paid],
    [{ id: 19, cat_id: 7, price: 30 }],
    main
  );
  assert.deepEqual(groups.sauces.map(getExtraItemId), [19]);
  assert.equal(groups.sauces[0].count, 2);
  assert.equal(extrasCost(groups), 60);
  assert.equal(cost(main) + extrasCost(groups), cost(main) + cost([paid]));
  assert.equal(gift.count, 1);
  assert.equal(gift.all_price, 0);
});

test('подарок без платного соуса не прибавляет количество и стоимость к дополнениям', () => {
  const gift = {
    item_id: 19, cat_id: 7, count: 1, one_price: 30, all_price: 0, disabled: true,
  };
  const groups = getCartExtraGroups(
    [{ id: 19, one_price: 30, count: 1 }],
    [],
    [],
    [gift]
  );
  assert.equal(groups.sauces[0].count, 0);
  assert.equal(extrasCost(groups), 0);
  assert.equal(gift.count, 1);
  assert.equal(gift.all_price, 0);
});

test('платная основная строка не дублируется среди дополнений', () => {
  const paid = { item_id: 19, cat_id: 7, count: 2, one_price: 30 };
  const groups = getCartExtraGroups(
    [{ id: 19, one_price: 30, count: 2 }],
    [paid],
    [],
    [paid]
  );
  assert.deepEqual(groups.sauces, []);
  assert.equal(groups.ids.has(19), false);
  assert.equal(cost([paid]) + extrasCost(groups), 60);
});

test('обычное блюдо не переносится в соусы, даже если передано среди выбранных товаров', () => {
  const groups = getCartExtraGroups([], [{ item_id: 114, cat_id: 4, count: 1 }]);
  assert.equal(groups.sauces.length, 0);
  assert.equal(groups.utensils.length, 0);
});

test('пустые и некорректные ответы безопасны, неверные ID не отображаются', () => {
  for (const input of [undefined, null, {}, 'invalid']) {
    const groups = getCartExtraGroups(input, input, input, input);
    assert.deepEqual(groups.sauces, []);
    assert.deepEqual(groups.utensils, []);
  }
  const groups = getCartExtraGroups([{ id: 0 }, { id: -1 }, {}, { id: 'no' }, { id: 1.5 }]);
  assert.equal(groups.ids.size, 0);
});

test('группировка не мутирует каталог, корзину и выдачу дополнений', () => {
  const dops = Object.freeze([Object.freeze({ id: 19, price: 25, count: 0 })]);
  const items = Object.freeze([Object.freeze({ item_id: 19, cat_id: 7, count: 2 })]);
  const catalog = Object.freeze([Object.freeze({ id: 19, cat_id: 7, img_app: 'sauce' })]);
  const groups = getCartExtraGroups(dops, items, catalog);
  assert.equal(groups.sauces[0].count, 2);
  assert.equal(dops[0].count, 0);
  assert.equal(catalog[0].item_id, undefined);
});

test('счетчик не показывает отрицательное или нечисловое количество', () => {
  assert.equal(getExtraCount([{ item_id: 19, count: -1 }], 19), 0);
  assert.equal(getExtraCount([{ item_id: 19, count: 'bad' }], 19), 0);
  assert.equal(getExtraCount([{ item_id: '19', count: '2' }], 19), 2);
});
