import assert from 'node:assert/strict';
import test from 'node:test';

import { updateRouteQuery } from './routeQuery.js';

test('карточка товара сохраняет UTM, повторяющиеся параметры и hash', () => {
  assert.equal(
    updateRouteQuery(
      '/samara?utm_source=A%2FB&utm_source=two&item=Old#top',
      'item',
      'Madeira_set'
    ),
    '/samara?utm_source=A%2FB&utm_source=two&item=Madeira_set#top'
  );
  assert.equal(
    updateRouteQuery(
      '/samara?utm_source=A%2FB&item=Madeira_set#top',
      'item',
      null
    ),
    '/samara?utm_source=A%2FB#top'
  );
});

test('очистка категории удаляет только её параметр', () => {
  assert.equal(
    updateRouteQuery(
      '/samara?category=pizza&item=Roll&utm=x#menu',
      'category',
      null
    ),
    '/samara?item=Roll&utm=x#menu'
  );
});
