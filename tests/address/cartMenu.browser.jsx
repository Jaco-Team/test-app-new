import React, { act, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { getByRole, queryByText } from '@testing-library/dom';
import { page } from 'vitest/browser';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
const fixture = vi.hoisted(() => ({ state: {}, listeners: new Set(), retry: vi.fn() }));
function update(values) {
  fixture.state = { ...fixture.state, ...values };
  fixture.listeners.forEach((listener) => listener());
}
vi.mock('@/components/store.js', () => ({
  useCartStore: (selector) => selector(useSyncExternalStore((listener) => {
    fixture.listeners.add(listener);
    return () => fixture.listeners.delete(listener);
  }, () => fixture.state)),
  useProfileStore: (selector) => selector({ userInfo: {}, setActiveAddressModal: vi.fn() }),
  useCitiesStore: (selector) => selector({ thisCity: 'togliatti', thisCityRu: 'Тольятти' }),
}));
vi.mock('@/modules/profile/address/modalAddressMobile', () => ({ default: () => null }));
vi.mock('@/modules/profile/address/modalGetAddressMobile', () => ({ default: () => null }));
vi.mock('@/ui/Font.js', () => ({ roboto: { variable: '' } }));
vi.mock('@/ui/Icons.js', () => ({ HomeCartMobile: () => null }));
vi.mock('@/ui/MyTextInput', () => ({ default: () => null }));
vi.mock('@mui/material/SwipeableDrawer', () => ({ default: ({ children, open }) => open ? <section>{children}</section> : null }));
vi.mock('@mui/material/List', () => ({ default: ({ children }) => <ul>{children}</ul> }));
vi.mock('@mui/material/ListItem', () => ({ default: ({ children, onClick }) => <li onClick={onClick}>{children}</li> }));
vi.mock('@mui/material/Typography', () => ({ default: ({ children }) => <span>{children}</span> }));
vi.mock('@mui/material/Button', () => ({ default: ({ children, onClick }) => <button onClick={onClick}>{children}</button> }));
import CartMenuMobile from '../../modules/cart/cartMenuMobile.js';
let root;
let host;
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  fixture.retry.mockReset();
  fixture.state = {
    openMenuCart: true, nameList: 'point', pointList: undefined,
    pointListLoadState: 'error', addrList: [], getMapCart: vi.fn(),
    loadPointList: fixture.retry, orderPic: {}, typeOrder: 'pic',
  };
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});
describe.each([320, 375, 667])('восстановление выбора кафе на ширине %s', (width) => {
  it('после ошибки показывает повтор и список успешно загруженных кафе', async () => {
    await page.viewport(width, 900);
    fixture.retry.mockImplementation(async () => {
      update({ pointListLoadState: 'loading' });
      await Promise.resolve();
      update({ pointListLoadState: 'ready', pointList: [{ id: 2, name: 'Кафе на Ленина', name_ru: 'Тольятти' }] });
    });
    await act(async () => root.render(<CartMenuMobile cityName="togliatti" />));
    expect(getByRole(host, 'alert').textContent).toContain('Не удалось загрузить');
    await act(async () => getByRole(host, 'button', { name: 'Повторить' }).click());
    expect(fixture.retry).toHaveBeenCalledTimes(1);
    expect(queryByText(host, 'Кафе на Ленина')).not.toBe(null);
  });
});
