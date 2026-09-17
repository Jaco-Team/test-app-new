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
vi.mock('zustand/middleware', async (original) => ({
  ...(await original()),
  persist: (initializer) => initializer,
}));
import { api, apiAddress } from '../../components/api.js';
import { parseAddressInput, sameAddressHouse } from '../../utils/streetAddress';
import {
  useProfileStore,
  useHeaderStoreNew,
  useCitiesStore,
  useCartStore,
} from '../../components/store';
const store = () => useProfileStore.getState();
const initial = store();
const alert = vi.fn();
const load = vi.fn();
const select = vi.fn();
const deferred = () => {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
};
const address = (home = '58', id = 58) => ({
  id,
  street: 'улица Маршала Жукова',
  home,
  xy: [53.5, 49.2],
  addressLine: `улица Маршала Жукова, ${home}, подъезд 2`,
});
const reply = (home = '58', id = 58) => ({
  addrs: [address(home, id)],
  count: 1,
  type: 1,
});
const save = (method = 'saveNewAddr', pd = store().addressEntrance) =>
  store()[method](pd, true, '', '', '', 'token', false, '', 1);
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('window', { innerWidth: 1280 });
  useHeaderStoreNew.setState({
    setActiveModalAlert: alert,
    showLoad: load,
    setActiveModalSelectAddress: select,
  });
  useProfileStore.setState({
    ...initial,
    active_city: 1,
    cityList: [{ id: 1, name: 'Тольятти' }],
    getUserInfo: vi.fn(),
  });
  useCitiesStore.setState({ thisCityList: [{ id: 1, name: 'Тольятти' }] });
  useCartStore.setState({ getMySavedAddr: vi.fn() });
});

describe('ручной ввод', () => {
  it.each([
    ['улица Маршала Жукова, 58', 'улица Маршала Жукова', '58'],
    ['улица Маршала Жукова 58А', 'улица Маршала Жукова', '58А'],
    ['улица Маршала Жукова 58A', 'улица Маршала Жукова', '58A'],
    [
      '20-й квартал, Рябиновый бульвар, 1',
      '20-й квартал, Рябиновый бульвар',
      '1',
    ],
    ['40 лет Победы 55', '40 лет Победы', '55'],
    ['улица Ленина, д. 12/1', 'улица Ленина', '12/1'],
    ['улица Ленина 12 корпус 2', 'улица Ленина', '12 корпус 2'],
    ['улица Ленина 12к2', 'улица Ленина', '12к2'],
    ['улица Ленина 12 стр. 1', 'улица Ленина', '12 стр. 1'],
  ])('%s', (input, street, home) =>
    expect(parseAddressInput(input)).toEqual({ street, home })
  );
  it.each(['', '58', 'бульвар Гая', '20-й квартал', 'улица 1905 года'])(
    'не угадывает отсутствующий дом: %s',
    (text) => expect(parseAddressInput(text)).toBeNull()
  );
  it('сопоставляет эквивалентные буквы и корпус, но не другой дом', () => {
    expect(sameAddressHouse('58A', '58А')).toBe(true);
    expect(sameAddressHouse('58 корпус 2', '58к2')).toBe(true);
    expect(sameAddressHouse('58', '58А')).toBe(false);
  });
  it('сбрасывает старый 58А сразу после изменения текста на58', async () => {
    api.mockResolvedValue(reply('58А'));
    await store().checkStreet('улица Маршала Жукова', '58А', '', 1);
    store().setAddressInput('улица Маршала Жукова, 58');
    expect(store().street_id).toBe(0);
    expect(store().chooseAddrStreet).toEqual({});
    store().setAddressEntrance('2');
    api.mockResolvedValue(reply());
    await store().verifyAddressInput();
    expect(api).toHaveBeenLastCalledWith('profile', {
      type: 'check_street',
      city_id: 1,
      street: 'улица Маршала Жукова',
      home: '58',
      pd: '2',
    });
    expect(store().addressInput).toBe('улица Маршала Жукова, 58');
  });
  it('не подтверждает изменённый геокодером дом', async () => {
    api.mockResolvedValue(reply('58'));
    store().setAddressInput('улица Маршала Жукова, 58А');
    expect(await store().verifyAddressInput()).toBe(false);
    expect(store().street_id).toBe(0);
    expect(store().addressInput).toContain('58А');
    expect(alert).toHaveBeenCalledWith(
      true,
      expect.stringContaining('другой номер дома'),
      false
    );
  });
});

describe('порядок ответов', () => {
  it('поздний старый ответ не меняет новый дом', async () => {
    const first = deferred(),
      second = deferred();
    api.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const old = store().checkStreet('улица Маршала Жукова', '58А', '', 1);
    const latest = store().checkStreet('улица Маршала Жукова', '58', '2', 1);
    second.resolve(reply('58'));
    await latest;
    first.resolve(reply('58А'));
    await old;
    expect(store().addressInput).toBe('улица Маршала Жукова, 58');
    expect(store().addressEntrance).toBe('2');
    expect(store().street_id).toBe(58);
  });
  it('старый отказ не выключает загрузку и не показывает ошибку нового поиска', async () => {
    const first = deferred(),
      second = deferred();
    api.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const old = store().checkStreet('улица Маршала Жукова', '58А', '', 1);
    const latest = store().checkStreet('улица Маршала Жукова', '58', '2', 1);
    first.resolve({ st: false, text: 'Старая ошибка' });
    await old;
    expect(store().is_fetch).toBe(true);
    expect(load).toHaveBeenLastCalledWith(true);
    expect(alert).not.toHaveBeenCalled();
    second.resolve(reply());
    await latest;
  });
  it('смена подъезда во время проверки проверяет последний подъезд', async () => {
    const first = deferred(),
      second = deferred();
    api.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    store().setAddressInput('улица Маршала Жукова, 58');
    store().setAddressEntrance('1');
    const old = store().verifyAddressInput();
    store().setAddressEntrance('12');
    const latest = store().verifyAddressInput();
    expect(api.mock.calls[1][1].pd).toBe('12');
    second.resolve(reply());
    await latest;
    first.resolve(reply());
    await old;
    expect(store().addressEntrance).toBe('12');
    expect(store().addressVerifiedKey).toContain('12');
  });
  it('игнорирует результат после закрытия формы', async () => {
    const pending = deferred();
    api.mockReturnValue(pending.promise);
    const checking = store().checkStreet('улица Маршала Жукова', '58', '', 1);
    store().closeModalAddr();
    pending.resolve(reply());
    await checking;
    expect(store().street_id).toBe(0);
    expect(store().addressInput).toBe('');
  });
  it('не выбирает старые варианты после изменения ввода', async () => {
    const addrs = [address('58', 1), address('58', 2)];
    api.mockResolvedValue({ addrs });
    await store().checkStreet('улица Маршала Жукова', '58', '', 1);
    store().setAddressInput('бульвар Гая, 4');
    expect(store().setAddress(addrs[0])).toBe(false);
    expect(store().street_id).toBe(0);
  });
  it('выбор актуального варианта подтверждает текущий адрес', async () => {
    const addrs = [address('58', 1), address('58', 2)];
    api.mockResolvedValue({ addrs });
    await store().checkStreet('улица Маршала Жукова', '58', '2', 1);
    expect(store().setAddress(addrs[1])).toBe(true);
    expect(store().street_id).toBe(2);
    expect(store().addressEntrance).toBe('2');
    expect(await store().verifyAddressInput()).toBe(true);
    expect(api).toHaveBeenCalledTimes(1);
  });
  it('поздние подсказки не заменяют текущие', async () => {
    const first = deferred(),
      second = deferred();
    apiAddress
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    store().setAddressInput('Жукова58А');
    const old = store().getAddrList('Жукова58А');
    store().setAddressInput('Жукова58');
    const latest = store().getAddrList('Жукова58');
    second.resolve({ results: [{ title: { text: '58' } }] });
    await latest;
    first.resolve({ results: [{ title: { text: '58А' } }] });
    await old;
    expect(store().street_list[0].name).toBe('58');
  });
  it('город ещё загружается: старый город нельзя проверить', async () => {
    const pending = deferred();
    api.mockReturnValueOnce(pending.promise);
    const opening = store().openModalAddr(0, 'samara');
    store().setAddressInput('улица Ленина, 12');
    expect(await store().verifyAddressInput()).toBe(false);
    expect(api).toHaveBeenCalledTimes(1);
    pending.resolve({
      city: 2,
      cities: [],
      streets: [],
      zones: [],
      this_info: null,
    });
    await opening;
    expect(store().active_city).toBe(2);
    expect(store().addressInput).toBe('улица Ленина, 12');
  });
  it('поздняя загрузка закрытой формы не открывает её снова', async () => {
    const pending = deferred();
    api.mockReturnValueOnce(pending.promise);
    const opening = store().openModalAddr(0, 'samara');
    store().closeModalAddr();
    pending.resolve({ city: 2, cities: [], streets: [], zones: [] });
    await opening;
    expect(store().isOpenModalAddr).toBe(false);
    expect(store().active_city).toBe(0);
  });
});

describe('сохранение', () => {
  it.each(['saveNewAddr', 'updateAddr'])(
    '%s проверяет ручной ввод и не требует подсказки',
    async (method) => {
      useProfileStore.setState({ infoAboutAddr: { id: 9 } });
      store().setAddressInput('улица Маршала Жукова 58');
      store().setAddressEntrance('2');
      api
        .mockResolvedValueOnce(reply())
        .mockResolvedValueOnce({ st: false, text: 'Тест сохранения' });
      await save(method);
      expect(api).toHaveBeenCalledTimes(2);
      expect(api.mock.calls[1][1]).toMatchObject({
        type: method === 'saveNewAddr' ? 'save_new_addr' : 'update_addr',
        pd: '2',
        city_id: 1,
      });
      expect(JSON.parse(api.mock.calls[1][1].street)).toEqual(
        method === 'saveNewAddr' ? { id: 58 } : { street_id: 58 }
      );
      expect(store().is_fetch_save_new_addr).toBe(false);
    }
  );
  it('клик после blur использует ту же проверку; повторный save не дублируется', async () => {
    const pending = deferred();
    api
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce({ st: false });
    store().setAddressInput('улица Маршала Жукова, 58');
    const checking = store().verifyAddressInput();
    const saving = save();
    await save();
    expect(api).toHaveBeenCalledTimes(1);
    pending.resolve(reply());
    await checking;
    await saving;
    expect(api).toHaveBeenCalledTimes(2);
  });
  it('изменение адреса в процессе save-проверки отменяет сохранение', async () => {
    const pending = deferred();
    api.mockReturnValueOnce(pending.promise);
    store().setAddressInput('улица Маршала Жукова, 58');
    const saving = save();
    store().setAddressInput('бульвар Гая, 4');
    pending.resolve(reply());
    await saving;
    expect(api).toHaveBeenCalledTimes(1);
    expect(store().is_fetch_save_new_addr).toBe(false);
  });
  it.each(['saveNewAddr', 'updateAddr'])(
    '%s завершает отказ без фоновых повторов',
    async (method) => {
      store().setAddressInput('улица Маршала Жукова, 58');
      api.mockResolvedValue({ st: false, text: 'Не найден' });
      await save(method);
      expect(api).toHaveBeenCalledTimes(1);
      expect(store().is_fetch_save_new_addr).toBe(false);
      expect(store().street_id).toBe(0);
    }
  );
  it('пустой ввод не сохраняет старый id', async () => {
    useProfileStore.setState({
      street_id: 99,
      chooseAddrStreet: address('58А', 99),
    });
    store().setAddressInput('');
    await save();
    expect(api).not.toHaveBeenCalled();
  });
});
