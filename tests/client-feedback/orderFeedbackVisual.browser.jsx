import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { getByRole } from '@testing-library/dom';
import { page } from 'vitest/browser';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const fixture = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock('@/components/api', () => ({
  api: (...args) => fixture.request(...args),
}));

import OrderReviewController from '@/modules/clientFeedback/OrderReviewController';
import { orderReviewFixture } from '@/stories/features/order-review/model/fixtures';

// Скриншоты для ручной сверки с макетом; падений не проверяет.
const order = (submitted) => ({
  point_id: 7,
  order_id: 1234,
  type_order_: 1,
  date_time_order_new: '15 января 12:30',
  status_order: 6,
  is_delete: 0,
  feedback: { available: true, submitted },
});
let container;
let root;

describe.each([
  ['mobile', 414, 896],
  ['tablet', 768, 1024],
  ['desktop', 1280, 800],
])('вёрстка %s', (name, width, height) => {
  beforeEach(async () => {
    fixture.request.mockResolvedValue({
      ...orderReviewFixture,
      submitted: false,
    });
    await page.viewport(width, height);
    container = document.createElement('div');
    container.style.cssText =
      'max-width:414px;margin:24px auto;padding:0 12px;font-family:Roboto,Arial';
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    document.body.innerHTML = '';
  });

  it('кнопка оценки и форма', async () => {
    await act(async () =>
      root.render(
        <OrderReviewController token="user-token" order={order(false)} />
      )
    );
    await page.screenshot({
      path: `../../.codex/client-feedback-shots/${name}-1-card.png`,
    });
    await act(async () =>
      getByRole(container, 'button', { name: 'Оценить заказ' }).click()
    );
    await act(async () => new Promise((r) => setTimeout(r, 50)));
    await page.screenshot({
      path: `../../.codex/client-feedback-shots/${name}-2-form.png`,
    });
    await act(async () =>
      getByRole(document.body, 'radio', { name: '5 из 5, Отлично' }).click()
    );
    await act(async () => new Promise((r) => setTimeout(r, 50)));
    await page.screenshot({
      path: `../../.codex/client-feedback-shots/${name}-3-rated.png`,
    });
  });

  it('уже оценён', async () => {
    await act(async () =>
      root.render(
        <OrderReviewController token="user-token" order={order(true)} />
      )
    );
    await page.screenshot({
      path: `../../.codex/client-feedback-shots/${name}-4-mine.png`,
    });
    await act(async () =>
      getByRole(container, 'button', { name: 'Моя оценка заказа' }).click()
    );
    await page.screenshot({
      path: `../../.codex/client-feedback-shots/${name}-5-done.png`,
    });
  });
});
