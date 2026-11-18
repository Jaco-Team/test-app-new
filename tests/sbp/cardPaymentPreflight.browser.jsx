import React, { act, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { getByRole, queryByRole } from '@testing-library/dom';
import { page } from 'vitest/browser';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  state: {},
  listeners: new Set(),
  push: vi.fn(),
  close: vi.fn(),
  hosted: vi.fn(),
  retry: vi.fn(),
}));
vi.mock('next/router', () => ({ useRouter: () => ({ push: fixture.push }) }));
vi.mock('@/components/store.js', () => ({
  useCartStore: (selector) =>
    selector(
      useSyncExternalStore(
        (listener) => {
          fixture.listeners.add(listener);
          return () => fixture.listeners.delete(listener);
        },
        () => fixture.state
      )
    ),
  useCitiesStore: (selector) => selector({ thisCity: 'samara' }),
}));
import CardPaymentPreflight from '../../modules/cart/cardPaymentPreflight';

let host;
let root;
function update(value) {
  fixture.state = { ...fixture.state, ...value };
  fixture.listeners.forEach((listener) => listener());
}
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.clearAllMocks();
  fixture.state = {
    cardPreflightState: 'error',
    cardScriptFailures: 0,
    cardPreflightRetry: fixture.retry,
    cardPreflightHosted: fixture.hosted,
    cardHostedUrl: null,
    paidConfirmationState: 'idle',
    pendingPaidOrder: null,
  };
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});

describe('переход на страницу ЮKassa при недоступности виджета', () => {
  it.each([375, 768, 1440])(
    'показывает альтернативу после первой ошибки на ширине %s',
    async (width) => {
      await page.viewport(width, 900);
      await act(async () =>
        root.render(<CardPaymentPreflight open onClose={fixture.close} />)
      );
      expect(
        queryByRole(document.body, 'button', {
          name: 'Оплатить на сайте ЮKassa',
        })
      ).toBeNull();
      expect(
        getByRole(document.body, 'button', {
          name: 'Повторить загрузку формы оплаты',
        })
      ).toBeTruthy();
      await act(async () => update({ cardScriptFailures: 1 }));
      const button = getByRole(document.body, 'button', {
        name: 'Оплатить на сайте ЮKassa',
      });
      expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(width);
      expect(button.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
      await act(async () => button.click());
      expect(fixture.hosted).toHaveBeenCalledTimes(1);
      await act(async () => update({ cardPreflightState: 'creating' }));
      expect(
        queryByRole(document.body, 'button', {
          name: 'Оплатить на сайте ЮKassa',
        })
      ).toBeNull();
      expect(document.body.textContent).toContain('Готовим оплату');
    }
  );
});
