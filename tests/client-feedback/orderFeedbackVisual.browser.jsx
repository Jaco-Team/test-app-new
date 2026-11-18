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
vi.mock('@/utils/browserStorage', () => ({
  getLocalStorageItem: () => 'user-token',
}));
vi.mock('next/image', () => ({
  default: ({ alt, src }) => (
    <img alt={alt} src={typeof src === 'string' ? src : ''} />
  ),
}));

import OrderFeedback from '@/modules/clientFeedback/OrderFeedback';
import { mockFeedbackForm } from '@/modules/clientFeedback/mockFeedback';

// Скриншоты для ручной сверки с макетом; падений не проверяет.
const order = (submitted) => ({
  point_id: 7,
  order_id: 1234,
  type_order_: 1,
  date_time_order_new: '15 января 12:30',
  status_order: 6,
  feedback: { available: true, submitted },
});
let container;
let root;

describe.each([
  ['mobile', 414, 896],
  ['desktop', 1280, 800],
])('вёрстка %s', (name, width, height) => {
  beforeEach(async () => {
    fixture.request.mockResolvedValue({
      ...mockFeedbackForm,
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

  it('карточка, лист и форма', async () => {
    await act(async () => root.render(<OrderFeedback order={order(false)} />));
    await page.screenshot({
      path: `../../.codex/client-feedback-shots/${name}-1-card.png`,
    });
    await act(async () =>
      getByRole(container, 'button', { name: 'Оценить заказ' }).click()
    );
    await act(async () => new Promise((r) => setTimeout(r, 50)));
    await page.screenshot({
      path: `../../.codex/client-feedback-shots/${name}-2-intro.png`,
    });
    await act(async () =>
      getByRole(document.body, 'button', { name: '5 из 5' }).click()
    );
    await act(async () => new Promise((r) => setTimeout(r, 50)));
    await page.screenshot({
      path: `../../.codex/client-feedback-shots/${name}-3-form.png`,
    });
  });

  it('уже оценён', async () => {
    await act(async () => root.render(<OrderFeedback order={order(true)} />));
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
