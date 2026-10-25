import React, { act, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { getByRole, queryByText } from '@testing-library/dom';
import { page } from 'vitest/browser';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({ router: {}, listeners: new Set(), state: 'confirmed', request: vi.fn(), replace: vi.fn(), push: vi.fn() }));
vi.mock('next/router', () => ({ useRouter: () => useSyncExternalStore((listener) => { fixture.listeners.add(listener); return () => fixture.listeners.delete(listener); }, () => fixture.router) }));
vi.mock('@/components/api.js', () => ({ api: (...args) => fixture.request(...args), apiAddress: vi.fn(), beginPaymentFlow: vi.fn(), endPaymentFlow: vi.fn(), getPaymentFlowId: vi.fn(), trackPaymentClientEvent: vi.fn() }));
vi.mock('js-cookie', () => ({ default: { get: vi.fn(), set: vi.fn(), remove: vi.fn() } }));
vi.mock('@/components/useYandexMetrika', () => ({ default: vi.fn(() => vi.fn()) }));
vi.mock('@sentry/nextjs', () => ({ captureMessage: vi.fn() }));
vi.mock('@/utils/metrika', () => ({ reachGoal: vi.fn(), reachGoalMain: vi.fn(), buildPurchasePayload: vi.fn((value) => value), trackPurchase: vi.fn(), setUserIdAll: vi.fn() }));
vi.mock('@/utils/clientMonitoring', () => ({ getClientNetworkContext: vi.fn() }));
vi.mock('zustand/middleware', async (original) => ({ ...(await original()), persist: (initializer) => initializer }));
vi.mock('next/dynamic', () => ({ default: () => () => null }));
vi.mock('@/components/footer.js', () => ({ default: () => null }));
vi.mock('@/ui/Font.js', () => ({ roboto: { variable: '' } }));

import SbpReturnHandler from '../../modules/cart/sbpReturnHandler';
import Zakazy from '../../pages/[city]/zakazy.jsx';
import { useCartStore, useCitiesStore, useHeaderStoreNew, useProfileStore } from '@/components/store';
import { trackPurchase } from '@/utils/metrika';

let root;
let host;
function route(path) {
  const url = new URL(path, 'http://localhost');
  const query = {};
  for (const key of url.searchParams.keys()) {
    const values = url.searchParams.getAll(key); query[key] = values.length > 1 ? values : values[0];
  }
  fixture.router = { isReady: true, asPath: path, query, replace: fixture.replace, push: fixture.push };
  fixture.listeners.forEach((listener) => listener());
}
function render(city = 'samara', withPage = false) {
  return act(async () => root.render(<>{withPage && <Zakazy data1={{ city, cities: [], page: {}, all_items: [], free_items: [], need_dop: {}, links: {} }} />}<SbpReturnHandler city={city} /></>));
}
async function flush() { await act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)); }); }
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear(); sessionStorage.clear(); vi.clearAllMocks();
  useHeaderStoreNew.setState({ token: 'browser-test-owner' });
  useCitiesStore.setState({ thisCity: 'samara' });
  useCartStore.getState().resetPaidConfirmation();
  useCartStore.setState({ items: [{ item_id: 999, count: 1 }], allItems: [], checkNewOrder: null, openConfirmForm: false, pendingSbpOrder: null });
  useProfileStore.getState().clearOrderList();
  fixture.state = 'confirmed';
  fixture.request.mockImplementation(async (module, data) => {
    if (data.type === 'confirm_paid_order') return fixture.state === 'error' ? { st: false, text: 'unavailable' } : { st: true, status: fixture.state };
    if (data.type === 'get_my_orders_new_') return { order_list: [{ order_id: 180351 }] };
    if (data.type === 'get_my_count_orders_promos') return { count_orders: 1, count_promo: 0 };
    return { st: true };
  });
  fixture.replace.mockImplementation(async (path) => { route(path); return true; });
  route('/samara/zakazy?sbp_return=1&point_id=8&order_id=180351');
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount()); host.remove();
  useCartStore.getState().resetPaidConfirmation();
});

describe.each(['togliatti', 'samara'])('возврат СБП в городе %s', (city) => {
  it.each([375, 768, 1440])('в новой вкладке проверяет точный заказ на ширине %s', async (width) => {
    await page.viewport(width, 900); useCitiesStore.setState({ thisCity: city });
    route(`/${city}/zakazy?utm_source=bank&sbp_return=1&point_id=8&order_id=180351#details`);
    await render(city); await flush();
    expect(fixture.request).toHaveBeenCalledWith('cart', expect.objectContaining({ type: 'confirm_paid_order', point_id: 8, order_id: 180351, token: 'browser-test-owner' }));
    expect(fixture.router.asPath).toBe(`/${city}/zakazy?utm_source=bank#details`);
    expect(useCartStore.getState().items).toEqual([{ item_id: 999, count: 1 }]);
    expect(useProfileStore.getState().orderList).toEqual([{ order_id: 180351 }]);
    expect(trackPurchase).not.toHaveBeenCalled();
    expect(host.textContent).not.toContain('Не удалось найти заказ');
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
  });
});

it('старый generic URL без контекста обновляет историю и не выбирает последний заказ', async () => {
  route('/samara/zakazy?sbp_return=1&utm_source=a%20b#details'); await render(); await flush();
  expect(host.textContent).toContain('Актуальный статус ваших заказов указан в истории');
  expect(fixture.request.mock.calls.some(([, data]) => data.type === 'confirm_paid_order')).toBe(false);
  expect(useProfileStore.getState().orderList).toEqual([{ order_id: 180351 }]);
  expect(fixture.router.asPath).toBe('/samara/zakazy?utm_source=a%20b#details');
});

it('не теряет URL возврата на настоящей странице истории до авторизации', async () => {
  useHeaderStoreNew.setState({ token: '' }); await render('samara', true); await flush();
  expect(fixture.push).not.toHaveBeenCalled();
  expect(host.textContent).toContain('Войдите в аккаунт');
  expect(fixture.router.asPath).toContain('order_id=180351');
  expect(fixture.request.mock.calls.some(([, data]) => data.type === 'confirm_paid_order')).toBe(false);
  await act(async () => useHeaderStoreNew.setState({ token: 'browser-test-owner' })); await flush();
  expect(fixture.router.asPath).toBe('/samara/zakazy');
});

it('при отказе проверки владельца не показывает успех и сохраняет ссылку для повторной проверки', async () => {
  fixture.state = 'error'; await render(); await flush();
  expect(useCartStore.getState().paidConfirmationState).toBe('checking');
  expect(fixture.router.asPath).toContain('order_id=180351');
  expect(trackPurchase).not.toHaveBeenCalled();
  expect(useCartStore.getState().items).toEqual([{ item_id: 999, count: 1 }]);
});

it('повторное открытие обработанной ссылки безопасно после удаления контекста', async () => {
  await render(); await flush();
  await act(async () => { useCartStore.getState().resetPaidConfirmation(); route('/samara/zakazy?sbp_return=1&point_id=8&order_id=180351'); }); await flush();
  expect(useCartStore.getState().paidConfirmationState).toBe('confirmed');
  expect(trackPurchase).not.toHaveBeenCalled();
  expect(fixture.router.asPath).toBe('/samara/zakazy');
});

it('повторный возврат в той же вкладке очищает URL уже подтверждённого заказа без повторного запроса', async () => {
  await render(); await flush();
  const calls = fixture.request.mock.calls.filter(([, data]) => data.type === 'confirm_paid_order').length;
  expect(useCartStore.getState().paidConfirmationNavigate).toBe(false);
  await act(async () => route('/samara/zakazy?sbp_return=1&point_id=8&order_id=180351')); await flush();
  expect(fixture.router.asPath).toBe('/samara/zakazy');
  expect(fixture.request.mock.calls.filter(([, data]) => data.type === 'confirm_paid_order')).toHaveLength(calls);
  expect(trackPurchase).not.toHaveBeenCalled();
});

it('старый generic URL с контекстом другого города не зависает и не переключает заказ', async () => {
  useCartStore.getState().registerPaidOrder({ orderId: 999, pointId: 2, city: 'togliatti', method: 'sbp' }, 'browser-test-owner');
  route('/samara/zakazy?sbp_return=1'); await render(); await flush();
  expect(fixture.router.asPath).toBe('/samara/zakazy');
  expect(useCartStore.getState().pendingPaidOrder.orderId).toBe(999);
  expect(host.textContent).toContain('Актуальный статус ваших заказов');
});

it('проверяет конфликтующую ссылку отдельно и не прерывает исходное подтверждение', async () => {
  useCartStore.getState().registerPaidOrder({ orderId: 999, pointId: 8, city: 'samara', method: 'sbp' }, 'browser-test-owner');
  useCartStore.setState({ paidConfirmationState: 'checking' }); fixture.state = 'pending';
  await render(); await flush();
  expect(useCartStore.getState().pendingPaidOrder.orderId).toBe(999);
  expect(useCartStore.getState().paidConfirmationState).toBe('checking');
  expect(fixture.router.asPath).toContain('order_id=180351');
  fixture.state = 'confirmed'; await act(async () => getByRole(host, 'button', { name: 'Проверить ещё раз' }).click()); await flush();
  expect(useCartStore.getState().pendingPaidOrder.orderId).toBe(999);
  expect(fixture.router.asPath).toBe('/samara/zakazy');
  expect(host.textContent).toContain('Заказ №180351 подтверждён');
  expect(trackPurchase).not.toHaveBeenCalled();
});

it('не использует локальный заказ для повреждённой ссылки', async () => {
  route('/samara/zakazy?sbp_return=1&point_id=8&order_id=180351&order_id=180352');
  await render(); await flush();
  expect(fixture.request.mock.calls.some(([, data]) => data.type === 'confirm_paid_order')).toBe(false);
  expect(fixture.router.asPath).toBe('/samara/zakazy');
});

it.each(['token', 'city'])('поздний ответ отдельной проверки игнорируется при синхронной смене %s', async (changed) => {
  useCartStore.getState().registerPaidOrder({ orderId: 999, pointId: 8, city: 'samara', method: 'sbp' }, 'browser-test-owner');
  useCartStore.setState({ paidConfirmationState: 'checking' });
  let resolve;
  fixture.request.mockImplementation((module, data) => data.type === 'confirm_paid_order' ? new Promise((r) => { resolve = r; }) : Promise.resolve({ st: true }));
  await render();
  await act(async () => {
    if (changed === 'token') useHeaderStoreNew.setState({ token: 'another-owner' });
    else useCitiesStore.setState({ thisCity: 'togliatti' });
    resolve({ st: true, status: 'confirmed' });
  });
  expect(fixture.router.asPath).toContain('order_id=180351');
  expect(host.textContent).not.toContain('Заказ №180351 подтверждён');
});
