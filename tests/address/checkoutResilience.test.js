import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../components/api.js', () => ({ api: vi.fn(), apiAddress: vi.fn() }));
vi.mock('../../components/useYandexMetrika', () => ({ default: vi.fn() }));
vi.mock('@sentry/nextjs', () => ({ captureMessage: vi.fn() }));
vi.mock('@/utils/metrika', () => ({ reachGoal: vi.fn(), setUserIdAll: vi.fn() }));
vi.mock('@/utils/clientMonitoring', () => ({ getClientNetworkContext: vi.fn() }));
vi.mock('zustand/middleware', async (original) => ({ ...(await original()), persist: (initializer) => initializer }));
import { api } from '../../components/api.js';
import { useProfileStore, useCartStore, useCitiesStore, useHeaderStoreNew } from '../../components/store.js';
const initialProfile = useProfileStore.getState();
const initialCart = useCartStore.getState();
const alert = vi.fn();
const response = (city = 1) => ({ city, cities: [], streets: [], zones: [], city_center: [53.5, 49.2] });
const deferred = () => {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('window', { innerWidth: 375 });
  vi.stubGlobal('document', { visibilityState: 'visible' });
  useHeaderStoreNew.setState({ token: 'test-token', setActiveModalAlert: alert, showLoad: vi.fn(), setActiveModalSelectAddress: vi.fn() });
  useProfileStore.setState(initialProfile);
  useCartStore.setState(initialCart);
  useCitiesStore.setState({ thisCity: 'togliatti', thisCityList: [] });
});

describe('восстановление адресной формы', () => {
  it.each([null, { st: false, text: 'Ошибка' }, { city: 1, zones: null }, { city: 1, zones: {} }])('не записывает повреждённые зоны: %j', async (json) => {
    api.mockResolvedValueOnce(json);
    expect(await useProfileStore.getState().getMapMobile(0, 'togliatti')).toBe(false);
    expect(useProfileStore.getState()).toMatchObject({ zones: [], active_city: 0, center_map: null, addressLoadState: 'error' });
    api.mockResolvedValueOnce(response());
    expect(await useProfileStore.getState().getMapMobile(0, 'togliatti')).toBe(true);
    expect(useProfileStore.getState()).toMatchObject({ zones: [], active_city: 1, addressLoadState: 'ready' });
  });
  it('после сетевого исключения оставляет форму пригодной для повтора', async () => {
    api.mockRejectedValueOnce(new Error('network'));
    await useProfileStore.getState().openModalAddr(0, 'togliatti');
    expect(useProfileStore.getState()).toMatchObject({ addressLoadState: 'error', isOpenModalAddr: true, zones: [] });
  });
  it('ответ старого города не перезаписывает новый', async () => {
    const old = deferred();
    api.mockReturnValueOnce(old.promise).mockResolvedValueOnce(response(2));
    const first = useProfileStore.getState().getMapMobile(0, 'togliatti');
    await useProfileStore.getState().getMapMobile(0, 'samara');
    old.resolve(response(1));
    await first;
    expect(useProfileStore.getState()).toMatchObject({ active_city: 2, addressLoadCity: 'samara' });
  });
  it('не передаёт нечисловые координаты карте', async () => {
    api.mockResolvedValueOnce({ ...response(), city_center: ['wrong', 49], zones: [{ xy_center_map: { latitude: null, longitude: 49 } }] });
    await useProfileStore.getState().getMapMobile(0, 'togliatti');
    expect(useProfileStore.getState().center_map).toBe(null);
  });
});

describe('загрузка списка кафе', () => {
  it('оплата и время не запрашивают кафе', async () => {
    await useCartStore.getState().setActiveMenuCart(true, 'pay');
    await useCartStore.getState().setActiveMenuCart(true, 'time');
    expect(api).not.toHaveBeenCalled();
  });
  it.each([null, { st: false }, { points: null }, { points: {} }])('не уничтожает рабочий массив при ошибке: %j', async (json) => {
    useCartStore.setState({ pointList: [{ id: 1 }], pointListCity: 'togliatti' });
    api.mockResolvedValueOnce(json);
    await useCartStore.getState().setActiveMenuCart(true, 'point');
    expect(useCartStore.getState()).toMatchObject({ pointList: [{ id: 1 }], pointListLoadState: 'error' });
    api.mockResolvedValueOnce({ points: [{ id: 2 }] });
    await useCartStore.getState().loadPointList();
    expect(useCartStore.getState()).toMatchObject({ pointList: [{ id: 2 }], pointListLoadState: 'ready' });
  });
  it('поздний ответ не открывает закрытое меню', async () => {
    const pending = deferred();
    api.mockReturnValueOnce(pending.promise);
    const opening = useCartStore.getState().setActiveMenuCart(true, 'point');
    await useCartStore.getState().setActiveMenuCart(false, null);
    pending.resolve({ points: [{ id: 9 }] });
    await opening;
    expect(useCartStore.getState()).toMatchObject({ openMenuCart: false, pointList: [] });
  });
  it('поздний ответ другого города не заменяет список', async () => {
    const pending = deferred();
    api.mockReturnValueOnce(pending.promise);
    const opening = useCartStore.getState().loadPointList();
    useCitiesStore.setState({ thisCity: 'samara' });
    pending.resolve({ points: [{ id: 9 }] });
    await opening;
    expect(useCartStore.getState().pointList).toEqual([]);
  });
});

describe('фоновые счётчики', () => {
  it('скрытая вкладка не запускает запрос', async () => {
    document.visibilityState = 'hidden';
    await useProfileStore.getState().getCountPromos_Orders('togliatti');
    expect(api).not.toHaveBeenCalled();
  });
  it('совмещает одновременные запросы и не заменяет числа при ошибке', async () => {
    const pending = deferred();
    api.mockReturnValueOnce(pending.promise);
    useProfileStore.setState({ count_promo: 3, count_orders: 4 });
    const first = useProfileStore.getState().getCountPromos_Orders('togliatti');
    const second = useProfileStore.getState().getCountPromos_Orders('togliatti');
    expect(second).toBe(first);
    pending.resolve({ st: false });
    await first;
    expect(api).toHaveBeenCalledTimes(1);
    expect(useProfileStore.getState()).toMatchObject({ count_promo: 3, count_orders: 4, countsPending: null });
  });
});

describe('неполные данные карты корзины', () => {
  it.each([null, { zones: [{ zone: [] }] }, { zones: [{ xy_center_map: { latitude: 'bad', longitude: 49 } }], points: [] }])('безопасно отклоняет ответ %j', async (json) => {
    api.mockResolvedValueOnce(json);
    expect(await useCartStore.getState().getMapCart('contacts', 'togliatti')).toBe(false);
    expect(useCartStore.getState()).toMatchObject({ cartMapLoadState: 'error', center_map: null, zones: [], points: [] });
  });
  it('игнорирует ответ карты после смены города', async () => {
    const pending = deferred();
    api.mockReturnValueOnce(pending.promise);
    const loading = useCartStore.getState().getMapCart('contacts', 'togliatti');
    useCitiesStore.setState({ thisCity: 'samara' });
    pending.resolve({ zones: [{ zone: [], xy_center_map: { latitude: 53, longitude: 49 } }], points: [] });
    expect(await loading).toBe(false);
    expect(useCartStore.getState().center_map).toBe(null);
  });
});
