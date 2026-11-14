import React, { act, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { getByRole, queryByRole } from '@testing-library/dom';
import { page } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({ state: {}, listeners: new Set(), hosted: vi.fn(), retry: vi.fn() }));
vi.mock('next/router', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/components/store.js', () => {
  const useCartStore = (selector) => selector(useSyncExternalStore(
    (listener) => { fixture.listeners.add(listener); return () => fixture.listeners.delete(listener); },
    () => fixture.state,
  ));
  useCartStore.getState = () => fixture.state;
  return {
    useCartStore,
    useHeaderStoreNew: (selector) => selector({ token: 'user-token', showLoad: () => {}, setActiveModalAlert: () => {} }),
    useCitiesStore: (selector) => selector({ thisCity: 'togliatti', thisCityRu: 'Тольятти' }),
    useProfileStore: (selector) => selector({ getOrderList: () => {} }),
  };
});
vi.mock('@/modules/cart/cartConfirmMap', () => ({ default: () => null }));
vi.mock('@/utils/metrika', () => ({ buildPurchasePayload: vi.fn(), reachGoal: vi.fn(), trackPurchase: vi.fn() }));
import ConfirmForm from '../../modules/cart/confirmForm';

let host; let root;
function update(value) { fixture.state = { ...fixture.state, ...value }; fixture.listeners.forEach((listener) => listener()); }
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true; vi.clearAllMocks();
  fixture.state = {
    openConfirmForm: true, typePay: { id: 'online', name: 'Картой на сайте' }, typeOrder: 'dev',
    cardPreflightState: 'idle', paidConfirmationState: 'idle', cardPaymentState: 'error',
    cardHostedFallback: null, retryCardPayment: fixture.retry, payCardOnHostedPage: fixture.hosted,
    // Дата не сегодня: форма не закрывается по вечернему ограничению приёма заказов.
    dateTimeOrder: { id: 1, name: 'Позже', date: '2099-01-01' },
    itemsOffDops: [], dopListCart: [], allPrice: 1488, free_drive: 0, orderAddr: { sum_div: 199 },
    checkNewOrder: {
      order: { order_id: 890427, point_id: 3, type_order_: 1, street: 'Ярославская улица', home: '13', kv: '37', max_time_order: 'Как можно скорее' },
      items: [{ name: 'Бургер-пицца', count: 1, price: 709 }, { name: 'Тартуфо', count: 1, price: 779 }],
    },
    setConfirmForm: vi.fn(), cancelCardPayment: vi.fn(), resetCardPreflight: vi.fn(),
  };
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); });

describe('страница ЮKassa в форме подтверждения, когда встроенная форма не открылась', () => {
  it.each([375, 1440])('предлагает оплату на сайте ЮKassa рядом с повтором на ширине %s', async (width) => {
    await page.viewport(width, 900);
    await act(async () => root.render(<ConfirmForm />));
    expect(getByRole(document.body, 'button', { name: 'Повторить загрузку формы оплаты' })).toBeTruthy();
    expect(queryByRole(document.body, 'button', { name: 'Оплатить на сайте ЮKassa' })).toBeNull();
    await act(async () => update({ cardHostedFallback: 'widget_timeout' }));
    const hosted = getByRole(document.body, 'button', { name: 'Оплатить на сайте ЮKassa' });
    expect(document.body.textContent).toContain('Можно оплатить заказ на защищённой странице ЮKassa.');
    expect(hosted.getBoundingClientRect().right).toBeLessThanOrEqual(width);
    expect(hosted.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);
    await act(async () => hosted.click());
    expect(fixture.hosted).toHaveBeenCalledTimes(1);
    await act(async () => getByRole(document.body, 'button', { name: 'Повторить загрузку формы оплаты' }).click());
    expect(fixture.retry).toHaveBeenCalledTimes(1);
    await act(async () => update({ cardPaymentState: 'loading', cardHostedFallback: null }));
    expect(queryByRole(document.body, 'button', { name: 'Оплатить на сайте ЮKassa' })).toBeNull();
    expect(document.body.textContent).toContain('Загружаем форму оплаты');
  });
});
