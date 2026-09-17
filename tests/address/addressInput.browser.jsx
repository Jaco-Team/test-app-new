import React, { act, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { userEvent } from '@testing-library/user-event';
import { getByPlaceholderText, getByRole } from '@testing-library/dom';
import { page } from 'vitest/browser';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  state: {},
  listeners: new Set(),
  requests: [],
  suggestions: [],
  selected: [],
}));
function update(values) {
  fixture.state = { ...fixture.state, ...values };
  fixture.listeners.forEach((listener) => listener());
}
vi.mock('@/components/store.js', () => ({
  useProfileStore: (selector) =>
    selector(
      useSyncExternalStore(
        (listener) => {
          fixture.listeners.add(listener);
          return () => fixture.listeners.delete(listener);
        },
        () => fixture.state
      )
    ),
  useHeaderStoreNew: (selector) => selector({ token: '', matches: false }),
  useCitiesStore: (selector) =>
    selector({ thisCityRu: 'Тольятти', thisCityList: [] }),
}));
vi.mock('@pbe/react-yandex-maps', () => ({
  YMaps: () => null,
  Map: () => null,
  Placemark: () => null,
  Polygon: () => null,
}));
vi.mock('@/ui/Font.js', () => ({ roboto: { variable: '' } }));
vi.mock('@/ui/Icons.js', () => ({
  IconClose: () => null,
  PencilModalAddrIcon: () => null,
  HomeModalAddrIcon: () => null,
  EditPencilMobile: () => null,
  HomeCartMobile: () => null,
  VectorRightMobile: () => null,
}));
vi.mock('@mui/material/Dialog', () => ({
  default: ({ children, open }) =>
    open ? <section>{children}</section> : null,
}));
vi.mock('@mui/material/SwipeableDrawer', () => ({
  default: ({ children, open }) =>
    open ? <section>{children}</section> : null,
}));
vi.mock('@/ui/MySelect', () => ({ default: () => null }));
vi.mock('@/ui/Switch.js', () => ({ default: () => null }));
vi.mock('@/ui/MySwitch.js', () => ({ SwitchContactsMobile: () => null }));
import ModalAddr from '../../modules/profile/profile/modalAddr.jsx';
import AddressModalMobile from '../../modules/profile/address/modalAddressMobile.js';
import GetAddressMobile from '../../modules/profile/address/modalGetAddressMobile.js';
import GetAddress from '../../modules/profile/profile/modalGetAddress_PC.js';

let container, root;
const option = {
  name: 'улица Маршала Жукова, 58',
  title: 'Тольятти',
  value: { street: 'улица Маршала Жукова', home: '58' },
};
const render = async (element) => {
  await act(async () => root.render(element));
};
const change = async (input, text) => {
  await act(async () => {
    await userEvent.clear(input);
    await userEvent.type(input, text);
  });
};
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  fixture.requests = [];
  fixture.suggestions = [];
  fixture.selected = [];
  fixture.state = {
    addressInput: 'улица Маршала Жукова, 58А',
    addressEntrance: '',
    active_city: 1,
    cityList: [],
    zones: [],
    street_list: [option],
    infoAboutAddr: null,
    chooseAddrStreet: { street: 'улица Маршала Жукова', home: '58А' },
    isOpenModalAddr: true,
    openModalAddress: true,
    openModalGetAddress: true,
    clearAddr: () => {},
    setClearAddr: () => {},
    setActiveAddressModal: () => {},
    closeModalAddr: () => update({ isOpenModalAddr: false }),
    setActiveGetAddressModal: (open) => update({ openModalGetAddress: open }),
    setAddressInput: (value) =>
      update({ addressInput: value, chooseAddrStreet: {} }),
    setAddressEntrance: (value) =>
      update({ addressEntrance: value, chooseAddrStreet: {} }),
    getAddrList: (text) => fixture.suggestions.push(text),
    verifyAddressInput: () => {
      fixture.requests.push({
        text: fixture.state.addressInput,
        pd: fixture.state.addressEntrance,
      });
      return Promise.resolve(true);
    },
    chooseStreet: (value) => {
      fixture.selected.push(value);
      update({ addressInput: value.name });
      fixture.state.verifyAddressInput();
    },
    saveNewAddr: () => fixture.state.verifyAddressInput(),
    updateAddr: () => fixture.state.verifyAddressInput(),
  };
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

function Form({ mode }) {
  if (mode === 'mobile')
    return (
      <>
        <AddressModalMobile />
        <GetAddressMobile />
      </>
    );
  if (mode === 'cart') return <GetAddress />;
  return <ModalAddr />;
}

describe.each(['desktop', 'tablet', 'mobile', 'cart'])(
  'ввод адреса: %s',
  (mode) => {
    it('передаёт новый дом без выбора подсказки по Enter', async () => {
      await page.viewport(
        mode === 'mobile' ? 375 : mode === 'tablet' ? 768 : 1280,
        900
      );
      await render(<Form mode={mode} />);
      const input = getByPlaceholderText(container, 'Улица и номер дома');
      await change(input, 'улица Маршала Жукова, 58');
      expect(fixture.state.chooseAddrStreet).toEqual({});
      await act(async () => userEvent.keyboard('{Enter}'));
      expect(fixture.requests.at(-1)).toEqual({
        text: 'улица Маршала Жукова, 58',
        pd: '',
      });
      expect(input.value).toBe('улица Маршала Жукова, 58');
    });
    it('подтверждает ручной ввод при уходе из поля', async () => {
      await page.viewport(
        mode === 'mobile' ? 375 : mode === 'tablet' ? 768 : 1280,
        900
      );
      await render(<Form mode={mode} />);
      const input = getByPlaceholderText(container, 'Улица и номер дома');
      await change(input, 'бульвар Гая, 4');
      await act(async () => input.blur());
      expect(fixture.requests.at(-1)?.text).toBe('бульвар Гая, 4');
    });
    it('выбор мышью не отправляет черновик раньше выбранной подсказки', async () => {
      await page.viewport(
        mode === 'mobile' ? 375 : mode === 'tablet' ? 768 : 1280,
        900
      );
      await render(<Form mode={mode} />);
      const input = getByPlaceholderText(container, 'Улица и номер дома');
      await change(input, 'Жукова 58');
      await act(async () =>
        userEvent.click(getByRole(document.body, 'option'))
      );
      expect(fixture.selected).toEqual([option]);
      expect(fixture.requests).toEqual([{ text: option.name, pd: '' }]);
    });
    it('стрелка и Enter выбирают подсказку один раз', async () => {
      await page.viewport(
        mode === 'mobile' ? 375 : mode === 'tablet' ? 768 : 1280,
        900
      );
      await render(<Form mode={mode} />);
      await change(
        getByPlaceholderText(container, 'Улица и номер дома'),
        'Жукова 58'
      );
      await act(async () => userEvent.keyboard('{ArrowDown}{Enter}'));
      expect(fixture.selected).toEqual([option]);
      expect(fixture.requests).toHaveLength(1);
    });
  }
);

it.each(['desktop', 'tablet', 'mobile'])(
  'дом 58А → 58 и подъезд 2: %s',
  async (mode) => {
    await page.viewport(
      mode === 'mobile' ? 375 : mode === 'tablet' ? 768 : 1280,
      900
    );
    await render(<Form mode={mode} />);
    await change(
      getByPlaceholderText(container, 'Улица и номер дома'),
      'улица Маршала Жукова, 58'
    );
    const entrance = getByPlaceholderText(container, 'Подъезд');
    await act(async () => userEvent.type(entrance, '2'));
    await act(async () => entrance.blur());
    expect(fixture.requests.at(-1)).toEqual({
      text: 'улица Маршала Жукова, 58',
      pd: '2',
    });
    expect(fixture.requests.some(({ text }) => text.endsWith('58А'))).toBe(
      false
    );
  }
);

it('отменяет отложенный поиск при закрытии формы', async () => {
  await render(<ModalAddr />);
  await change(
    getByPlaceholderText(container, 'Улица и номер дома'),
    'Рябиновый бульвар, 1'
  );
  await act(async () => fixture.state.closeModalAddr());
  await new Promise((resolve) => setTimeout(resolve, 400));
  expect(fixture.suggestions).toEqual([]);
});

it('очистка текста немедленно сбрасывает предыдущий адрес', async () => {
  await render(<ModalAddr />);
  const input = getByPlaceholderText(container, 'Улица и номер дома');
  await act(async () => userEvent.clear(input));
  expect(fixture.state.addressInput).toBe('');
  expect(fixture.state.chooseAddrStreet).toEqual({});
});

it('ввод подъезда 11 проверяется после паузы, без промежуточного 1', async () => {
  await render(<ModalAddr />);
  const entrance = getByPlaceholderText(container, 'Подъезд');
  await act(async () => userEvent.type(entrance, '11'));
  expect(fixture.requests).toEqual([]);
  await new Promise((resolve) => setTimeout(resolve, 400));
  expect(fixture.requests).toEqual([
    { text: 'улица Маршала Жукова, 58А', pd: '11' },
  ]);
});

it('пустое поле при уходе не вызывает проверку адреса', async () => {
  await render(<ModalAddr />);
  const input = getByPlaceholderText(container, 'Улица и номер дома');
  await act(async () => {
    await userEvent.clear(input);
    input.blur();
  });
  expect(fixture.requests).toEqual([]);
});

it('смена города отменяет отложенный поиск старой улицы', async () => {
  await render(<ModalAddr />);
  await change(
    getByPlaceholderText(container, 'Улица и номер дома'),
    'Рябиновый бульвар, 1'
  );
  await act(async () => update({ active_city: 2, addressInput: '' }));
  await new Promise((resolve) => setTimeout(resolve, 400));
  expect(fixture.suggestions).toEqual([]);
});
