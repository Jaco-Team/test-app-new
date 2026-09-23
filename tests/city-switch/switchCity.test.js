import { beforeEach, describe, expect, it, vi } from 'vitest';

const cookieJar = vi.hoisted(() => new Map());

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn((key) => cookieJar.get(key)),
    set: vi.fn((key, value) => cookieJar.set(key, value)),
    remove: vi.fn((key) => cookieJar.delete(key)),
  },
}));
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
  useCartStore,
  useCitiesStore,
  useHeaderStoreNew,
} from '../../components/store.js';
import { switchCity } from '../../utils/switchCity.js';

const cities = {
  samara: { name: 'Самара', link: 'samara' },
  togliatti: { name: 'Тольятти', link: 'togliatti' },
};
const products = {
  samara: [
    { id: 10, name: 'Ролл Самара', link: 'roll', price: 200 },
    { id: 20, name: 'Только Самара', link: 'samara-only', price: 300 },
  ],
  togliatti: [{ id: 10, name: 'Ролл Тольятти', link: 'roll', price: 250 }],
};
const catalog = (city) => ({
  page: { title: city },
  cats: [{ link: 'rolly' }],
  cities: Object.values(cities),
  all_items: products[city],
  free_items: [],
  need_dop: {},
});

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

const alert = vi.fn();
const loading = vi.fn();
const router = (
  path = '/samara/cart?utm_source=A%2FB&utm_source=two#basket'
) => ({
  isReady: true,
  asPath: path,
  replace: vi.fn().mockResolvedValue(true),
});

function seedCart(city, items) {
  const state = {
    city: cities[city],
    updatedAt: Date.now(),
    items,
    orderAddr: { id: 123 },
    orderPic: 4,
    typePay: { id: 'card' },
    typeOrder: 'pic',
    dateTimeOrder: 'tomorrow',
  };
  window.localStorage.setItem('setCart', JSON.stringify(state));
  useCartStore.setState({
    items,
    allItems: products[city],
    orderAddr: state.orderAddr,
    orderPic: state.orderPic,
    typePay: state.typePay,
    typeOrder: state.typeOrder,
    dateTimeOrder: state.dateTimeOrder,
    promoInfo: { status_promo: true },
    getItems: vi.fn(),
    setDataPromoBasket: vi.fn(),
    check_need_dops: vi.fn(),
    promoCheck: vi.fn(),
    getInfoPromo: vi.fn().mockResolvedValue({ status_promo: true }),
    clearCheckoutData: vi.fn(),
  });
  useCitiesStore.setState({
    thisCity: city,
    thisCityRu: cities[city].name,
    thisCityList: Object.values(cities),
  });
  window.localStorage.setItem('setCity', JSON.stringify(cities[city]));
  cookieJar.set('city', city);
}

beforeEach(() => {
  vi.clearAllMocks();
  cookieJar.clear();
  vi.stubGlobal('window', {
    localStorage: storage(),
    sessionStorage: storage(),
  });
  useHeaderStoreNew.setState({ setActiveModalAlert: alert, showLoad: loading });
  api.mockImplementation((module, request) =>
    Promise.resolve(catalog(request.city_id))
  );
});

describe('смена города с корзиной', () => {
  it.each([
    ['samara', 'togliatti', 250],
    ['togliatti', 'samara', 200],
  ])(
    'пересчитывает цены и сохраняет количество: %s → %s',
    async (from, to, price) => {
      seedCart(from, [
        { item_id: 10, name: 'Старый ролл', count: 3, one_price: 1 },
      ]);
      const navigation = router(`/${from}/cart?utm=A%2FB&utm=second#basket`);

      await expect(switchCity(cities[to], navigation)).resolves.toBe(true);

      expect(api).toHaveBeenCalledWith('home', {
        type: 'get_page_info',
        city_id: to,
        page: 'menu',
      });
      expect(navigation.replace).toHaveBeenCalledWith(
        `/${to}/cart?utm=A%2FB&utm=second#basket`,
        undefined,
        { shallow: false }
      );
      expect(useCartStore.getState().items).toMatchObject([
        { item_id: 10, count: 3, one_price: price, all_price: price * 3 },
      ]);
      expect(useCartStore.getState().allPriceWithoutPromo).toBe(price * 3);
      expect(useCartStore.getState()).toMatchObject({
        orderAddr: null,
        orderPic: 0,
        typePay: null,
        typeOrder: 'dev',
        dateTimeOrder: null,
        promoInfo: null,
      });
      expect(JSON.parse(window.localStorage.getItem('setCart'))).toMatchObject({
        city: cities[to],
        items: [{ item_id: 10, count: 3, one_price: price }],
      });
      expect(JSON.parse(window.localStorage.getItem('setCity'))).toEqual(
        cities[to]
      );
      expect(cookieJar.get('city')).toBe(to);
      expect(loading.mock.calls.at(-1)).toEqual([false]);
    }
  );

  it('удаляет недоступный товар и называет его в уведомлении', async () => {
    seedCart('samara', [
      { item_id: 10, name: 'Ролл', count: 2 },
      { item_id: 20, name: 'Только Самара', count: 1 },
    ]);

    await switchCity(cities.togliatti, router());

    expect(useCartStore.getState().items.map((item) => item.item_id)).toEqual([
      10,
    ]);
    expect(alert).toHaveBeenCalledWith(
      true,
      expect.stringContaining('Только Самара'),
      false
    );
  });

  it('оставляет город, корзину и маршрут при ошибке загрузки каталога', async () => {
    seedCart('samara', [{ item_id: 10, count: 2, one_price: 200 }]);
    const oldCart = window.localStorage.getItem('setCart');
    const navigation = router();
    api.mockRejectedValueOnce(new Error('network'));

    await expect(switchCity(cities.togliatti, navigation)).resolves.toBe(false);

    expect(navigation.replace).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('setCart')).toBe(oldCart);
    expect(useCitiesStore.getState().thisCity).toBe('samara');
    expect(cookieJar.get('city')).toBe('samara');
    expect(alert).toHaveBeenCalledWith(
      true,
      expect.stringContaining('Не удалось'),
      false
    );
  });

  it('откатывает хранилища и состояние, если переход не состоялся', async () => {
    seedCart('samara', [{ item_id: 10, count: 2, one_price: 200 }]);
    const oldCart = window.localStorage.getItem('setCart');
    const navigation = router();
    navigation.replace.mockRejectedValueOnce(new Error('navigation'));

    await expect(switchCity(cities.togliatti, navigation)).resolves.toBe(false);

    expect(window.localStorage.getItem('setCart')).toBe(oldCart);
    expect(useCitiesStore.getState().thisCity).toBe('samara');
    expect(useCartStore.getState().items[0].one_price).toBe(200);
    expect(cookieJar.get('city')).toBe('samara');
  });

  it('отклоняет неполный каталог, не меняя корзину', async () => {
    seedCart('samara', [{ item_id: 10, count: 2, one_price: 200 }]);
    api.mockResolvedValueOnce({ page: {}, all_items: null });
    const navigation = router();

    await expect(switchCity(cities.togliatti, navigation)).resolves.toBe(false);

    expect(navigation.replace).not.toHaveBeenCalled();
    expect(useCartStore.getState().items[0].one_price).toBe(200);
    expect(useCitiesStore.getState().thisCity).toBe('samara');
  });

  it('объединяет два одновременных запроса на переключение', async () => {
    seedCart('samara', [{ item_id: 10, count: 1, one_price: 200 }]);
    let finish;
    api.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const navigation = router();

    const first = switchCity(cities.togliatti, navigation);
    const second = switchCity(cities.togliatti, navigation);
    expect(second).toBe(first);
    finish(catalog('togliatti'));

    await expect(first).resolves.toBe(true);
    expect(api).toHaveBeenCalledTimes(1);
    expect(navigation.replace).toHaveBeenCalledTimes(1);
  });

  it('сверяет сохранённую корзину с каталогом города из URL', () => {
    seedCart('samara', [{ item_id: 10, count: 2, one_price: 200 }]);
    useCitiesStore.setState({ thisCity: 'togliatti' });
    useCartStore.setState({ allItems: products.togliatti, items: [] });

    useCartStore.getState().getCartLocalStorage();

    expect(useCartStore.getState().items[0]).toMatchObject({
      name: 'Ролл Тольятти',
      count: 2,
      one_price: 250,
      all_price: 500,
    });
    expect(useCartStore.getState().clearCheckoutData).toHaveBeenCalled();
    expect(useCartStore.getState().getInfoPromo).not.toHaveBeenCalled();
  });

  it('повторно проверяет промокод для города из URL при восстановлении', () => {
    seedCart('samara', [{ item_id: 10, count: 1, one_price: 200 }]);
    useCitiesStore.setState({ thisCity: 'togliatti' });
    useCartStore.setState({ allItems: products.togliatti, items: [] });
    cookieJar.set('promo_name', 'PROMO');

    useCartStore.getState().getCartLocalStorage();

    expect(useCartStore.getState().getInfoPromo).toHaveBeenCalledWith(
      'PROMO',
      'togliatti'
    );
  });
});
