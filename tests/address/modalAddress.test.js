import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fixtures = vi.hoisted(() => ({ profile: {}, width: 1280 }));
vi.mock('@/components/store.js', () => ({
  useProfileStore: (selector) => selector(fixtures.profile),
  useHeaderStoreNew: (selector) => selector({}),
  useCitiesStore: (selector) =>
    selector({ thisCityList: [], thisCityRu: 'Тольятти' }),
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
vi.mock('@/ui/Switch.js', () => ({ default: () => null }));
vi.mock('@/ui/MySwitch.js', () => ({ SwitchContactsMobile: () => null }));
vi.mock('@/ui/MySelect', () => ({ default: () => null }));
vi.mock('@/ui/MyTextInput', () => ({ default: () => null }));
vi.mock('@/ui/MyAutocomplete', () => ({
  default: ({ inputValue }) =>
    React.createElement('input', {
      'aria-label': 'Адрес',
      value: inputValue,
      readOnly: true,
    }),
}));
vi.mock('@mui/material/IconButton', () => ({ default: () => null }));
vi.mock('@mui/material/Button', () => ({ default: () => null }));
vi.mock('@mui/material/Backdrop', () => ({ default: () => null }));
vi.mock('@mui/material/Dialog', () => ({
  default: ({ children }) => React.createElement('div', null, children),
}));
vi.mock('@mui/material/DialogContent', () => ({
  default: ({ children }) => React.createElement('div', null, children),
}));
vi.mock('@mui/material/SwipeableDrawer', () => ({
  default: ({ children }) => React.createElement('div', null, children),
}));
vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => fixtures.width <= 667,
}));

import ModalAddr from '../../modules/profile/profile/modalAddr.jsx';
import AddressModalMobile from '../../modules/profile/address/modalAddressMobile.js';

beforeEach(() => {
  fixtures.profile = {
    zones: [],
    cityList: [],
    street_list: [],
    active_city: 1,
    chooseAddrStreet: {},
    choose_street: '',
    addressInput: '',
    addressEntrance: '',
    infoAboutAddr: null,
  };
});

describe.each([375, 768, 1280])('рендер форм адреса при ширине %s', (width) => {
  it.each([ModalAddr, AddressModalMobile])(
    'показывает квартал один раз в %s',
    (Component) => {
      fixtures.width = width;
      fixtures.profile.chooseAddrStreet = {
        city_name_dop: '12-й квартал',
        street: '12-й квартал, бульвар Гая',
        home: '4',
      };
      fixtures.profile.addressInput = '12-й квартал, бульвар Гая, 4';
      const html = renderToStaticMarkup(React.createElement(Component));
      expect(html).toContain('12-й квартал, бульвар Гая, 4');
      expect(html.match(/12-й квартал/g)).toHaveLength(1);
    }
  );

  it.each([ModalAddr, AddressModalMobile])(
    'сохраняет черновик после ошибки в %s',
    (Component) => {
      fixtures.width = width;
      fixtures.profile.choose_street = '12-й квартал, бульвар Гая, 4';
      fixtures.profile.addressInput = '12-й квартал, бульвар Гая, 4';
      const html = renderToStaticMarkup(React.createElement(Component));
      expect(html).toContain('12-й квартал, бульвар Гая, 4');
    }
  );
});
