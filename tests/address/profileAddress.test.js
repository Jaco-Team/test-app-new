import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../components/api.js', () => ({
  api: vi.fn(),
  apiAddress: vi.fn(),
}));
vi.mock('../../components/useYandexMetrika', () => ({ default: vi.fn() }));
vi.mock('@sentry/nextjs', () => ({ captureMessage: vi.fn() }));
vi.mock('@/utils/metrika', () => ({
  reachGoal: vi.fn(),
  setUserIdAll: vi.fn(),
}));
vi.mock('@/utils/clientMonitoring', () => ({
  getClientNetworkContext: vi.fn(),
}));
vi.mock('zustand/middleware', async (importOriginal) => ({
  ...(await importOriginal()),
  persist: (initializer) => initializer,
}));

import { api } from '../../components/api.js';
import {
  useProfileStore,
  useHeaderStoreNew,
  useCitiesStore,
} from '../../components/store.js';

const checkStreet = useProfileStore.getState().checkStreet;
const alert = vi.fn();
const loading = vi.fn();
const select = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('window', { innerWidth: 1280 });
  useHeaderStoreNew.setState({
    setActiveModalAlert: alert,
    showLoad: loading,
    setActiveModalSelectAddress: select,
  });
  useProfileStore.setState({
    checkStreet,
    is_fetch: false,
    street_id: 999,
    chooseAddrStreet: { id: 999 },
    cityList: [],
    active_city: 1,
  });
  useCitiesStore.setState({ thisCityList: [{ id: 1, name: 'Тольятти' }] });
});

describe('проверка адреса в store', () => {
  it('отправляет подсказку с кварталом через запятую', () => {
    const check = vi.fn();
    useProfileStore.setState({ checkStreet: check });
    useProfileStore.getState().chooseStreet(
      {
        name: 'бульвар Гая, 4',
        full: {
          address: {
            component: [
              { kind: ['DISTRICT'], name: '12-й квартал' },
              { kind: ['STREET'], name: 'бульвар Гая' },
              { kind: ['HOUSE'], name: '4' },
              { kind: ['LOCALITY'], name: 'Тольятти' },
            ],
          },
        },
      },
      ''
    );
    expect(check).toHaveBeenCalledWith('12-й квартал, бульвар Гая', '4', '', 1);
  });

  it('берёт название выбранного города из данных формы без глобального списка', () => {
    const check = vi.fn();
    useProfileStore.setState({
      checkStreet: check,
      cityList: [{ id: 1, name: 'Тольятти' }],
    });
    useCitiesStore.setState({ thisCityList: [] });
    useProfileStore.getState().chooseStreet(
      {
        full: {
          address: {
            component: [
              { kind: ['STREET'], name: 'бульвар Гая' },
              { kind: ['HOUSE'], name: '4' },
              { kind: ['LOCALITY'], name: 'Тольятти' },
            ],
          },
        },
      },
      ''
    );
    expect(check).toHaveBeenCalledWith('бульвар Гая', '4', '', 1);
  });

  it.each([375, 768, 1280])(
    'показывает ошибку API и сбрасывает старый выбор при ширине %s',
    async (width) => {
      window.innerWidth = width;
      api.mockResolvedValue({
        st: false,
        text: 'Геокодер временно недоступен',
        count: 0,
        addrs: [],
      });
      await checkStreet('бульвар Гая', '4', '', 1);
      expect(alert).toHaveBeenCalledWith(
        true,
        'Геокодер временно недоступен',
        false
      );
      expect(useProfileStore.getState()).toMatchObject({
        is_fetch: false,
        street_id: 0,
        chooseAddrStreet: {},
      });
      expect(loading).toHaveBeenLastCalledWith(false);
    }
  );

  it('сбрасывает загрузку и адрес после исключения', async () => {
    api.mockRejectedValue(new Error('network'));
    await checkStreet('бульвар Гая', '4', '', 1);
    expect(alert).toHaveBeenCalledWith(
      true,
      expect.stringContaining('проверить адрес'),
      false
    );
    expect(useProfileStore.getState()).toMatchObject({
      is_fetch: false,
      street_id: 0,
      chooseAddrStreet: {},
    });
    expect(loading).toHaveBeenLastCalledWith(false);
  });

  it('не сохраняет предыдущий адрес, если дом не введён', async () => {
    await checkStreet('бульвар Гая', '', '', 1);
    expect(api).not.toHaveBeenCalled();
    expect(useProfileStore.getState()).toMatchObject({
      is_fetch: false,
      street_id: 0,
      chooseAddrStreet: {},
    });
  });

  it('оставляет выбор пустым при неоднозначном результате', async () => {
    const addrs = [{ id: 1 }, { id: 2 }];
    api.mockResolvedValue({ addrs });
    await checkStreet('бульвар Гая', '4', '', 1);
    expect(select).toHaveBeenCalledWith(true, addrs);
    expect(useProfileStore.getState().street_id).toBe(0);
  });

  it.each([375, 768, 1280])(
    'выбирает найденный адрес при ширине %s',
    async (width) => {
      window.innerWidth = width;
      const address = {
        id: 12,
        xy: [53.5, 49.2],
        addressLine: 'бульвар Гая, 4',
      };
      api.mockResolvedValue({ addrs: [address] });
      await checkStreet('бульвар Гая', '4', '', 1);
      expect(useProfileStore.getState()).toMatchObject({
        is_fetch: false,
        street_id: 12,
        chooseAddrStreet: address,
        center_map: { center: address.xy },
      });
    }
  );
});
