import { beforeEach, describe, expect, it, vi } from 'vitest';
import dayjs from 'dayjs';

vi.mock('js-cookie', () => ({
  default: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
}));
vi.mock('../../components/api.js', () => ({
  api: vi.fn(),
  apiAddress: vi.fn(),
  beginPaymentFlow: vi.fn(),
  endPaymentFlow: vi.fn(),
  getPaymentFlowId: vi.fn(),
  trackPaymentClientEvent: vi.fn(),
}));
vi.mock('../../components/useYandexMetrika', () => ({ default: vi.fn(() => vi.fn()) }));
vi.mock('@sentry/nextjs', () => ({ captureMessage: vi.fn() }));
vi.mock('@/utils/metrika', () => ({
  reachGoal: vi.fn(),
  buildPurchasePayload: vi.fn((value) => value),
  trackPurchase: vi.fn(),
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
import { useCartStore, useHeaderStoreNew } from '../../components/store.js';

const NEAREST = { name: 'В ближайшее время', id: -1 };
const slot = (start, end) => ({ name: `${start} - ${end}`, id: start });
const QUEUE_ERROR = { st: false, text: 'Произошла ошибка, попробуйте еще раз' };

const today = dayjs().format('YYYY-MM-DD');
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
const friday = dayjs().add(2, 'day').format('YYYY-MM-DD');
const saturday = dayjs().add(3, 'day').format('YYYY-MM-DD');

// Ответ, который приходит тогда, когда это нужно тесту.
function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

let alert;

beforeEach(() => {
  vi.clearAllMocks();
  alert = vi.fn();
  useHeaderStoreNew.setState({ setActiveModalAlert: alert });
  useCartStore.setState({
    typeOrder: 'dev',
    point_id: 5,
    items: [{ item_id: 172, count: 1 }],
    timePreOrder: null,
    datePreOrder: [
      { date: today, text: 'Сегодня', dow: 'Ср' },
      { date: tomorrow, text: 'Завтра', dow: 'Чт' },
      { date: friday, text: '13 нояб', dow: 'Пт' },
    ],
  });
});

describe('время предзаказа в оформлении заказа', () => {
  it('не отправляет такой же запрос, пока первый ещё выполняется', async () => {
    const answer = deferred();
    api.mockReturnValueOnce(answer.promise);

    const first = useCartStore.getState().getTimesPred(null, friday, null, []);
    const second = useCartStore.getState().getTimesPred(null, friday, null, []);

    expect(api).toHaveBeenCalledTimes(1);
    expect(api).toHaveBeenCalledWith('cart', {
      type: 'get_times_pred',
      date: friday,
      point_id: 5,
      type_order: 0,
      cart: JSON.stringify([{ id: 172, item_id: 172, count: 1 }]),
    });

    answer.resolve([NEAREST, slot('10:30', '11:00')]);
    await Promise.all([first, second]);

    expect(useCartStore.getState().timePreOrder).toEqual([slot('10:30', '11:00')]);
    expect(alert).not.toHaveBeenCalled();

    // После ответа тот же вопрос задаётся заново: слоты со временем меняются.
    api.mockResolvedValueOnce([NEAREST, slot('10:45', '11:15')]);
    await useCartStore.getState().getTimesPred(null, friday, null, []);
    expect(api).toHaveBeenCalledTimes(2);
    expect(useCartStore.getState().timePreOrder).toEqual([slot('10:45', '11:15')]);
  });

  it('опоздавший отказ прежнего запроса не затирает список новой даты', async () => {
    const old = deferred();
    api.mockReturnValueOnce(old.promise);
    api.mockResolvedValueOnce([NEAREST, slot('12:00', '12:30')]);

    const fridayRequest = useCartStore.getState().getTimesPred(null, friday, null, []);
    await useCartStore.getState().getTimesPred(null, saturday, null, []);
    expect(useCartStore.getState().timePreOrder).toEqual([slot('12:00', '12:30')]);

    old.resolve(QUEUE_ERROR);
    await fridayRequest;

    expect(useCartStore.getState().timePreOrder).toEqual([slot('12:00', '12:30')]);
    expect(alert).not.toHaveBeenCalled();
    // Устаревший запрос не повторяется.
    expect(api).toHaveBeenCalledTimes(2);
  });

  it('опоздавший успешный ответ прежней даты не подменяет слоты выбранной', async () => {
    const old = deferred();
    api.mockReturnValueOnce(old.promise);
    api.mockResolvedValueOnce([NEAREST, slot('12:00', '12:30')]);

    const fridayRequest = useCartStore.getState().getTimesPred(null, friday, null, []);
    await useCartStore.getState().getTimesPred(null, saturday, null, []);

    old.resolve([NEAREST, slot('18:00', '18:30')]);
    await fridayRequest;

    expect(useCartStore.getState().timePreOrder).toEqual([slot('12:00', '12:30')]);
  });

  it('разовый отказ бэкенда повторяет сам и ошибку не показывает', async () => {
    api.mockResolvedValueOnce(QUEUE_ERROR);
    api.mockResolvedValueOnce([NEAREST, slot('10:30', '11:00'), slot('10:45', '11:15')]);

    await useCartStore.getState().getTimesPred(null, friday, null, []);

    expect(api).toHaveBeenCalledTimes(2);
    expect(api.mock.calls[1]).toEqual(api.mock.calls[0]);
    expect(useCartStore.getState().timePreOrder).toEqual([
      slot('10:30', '11:00'),
      slot('10:45', '11:15'),
    ]);
    expect(alert).not.toHaveBeenCalled();
  });

  it('после второго отказа показывает текст бэкенда один раз и очищает список', async () => {
    useCartStore.setState({ timePreOrder: [slot('09:00', '09:30')] });
    api.mockResolvedValue(QUEUE_ERROR);

    await useCartStore.getState().getTimesPred(null, friday, null, []);

    expect(api).toHaveBeenCalledTimes(2);
    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith(true, 'Произошла ошибка, попробуйте еще раз', false);
    expect(useCartStore.getState().timePreOrder).toEqual([]);
  });

  it('сетевой сбой не повторяет поверх повторов самого запроса', async () => {
    api.mockResolvedValue({
      st: false,
      text: 'Сервис временно недоступен. Проверьте интернет и попробуйте еще раз.',
      transport_error: true,
    });

    await useCartStore.getState().getTimesPred(null, friday, null, []);

    expect(api).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledTimes(1);
    expect(useCartStore.getState().timePreOrder).toEqual([]);
  });

  it('если на сегодня слотов нет, показывает завтрашние и убирает «Сегодня»', async () => {
    api.mockResolvedValueOnce([NEAREST]);
    api.mockResolvedValueOnce([NEAREST, slot('10:30', '11:00')]);

    await useCartStore.getState().getTimesPred(5, null, 0, []);

    expect(api.mock.calls.map(([, data]) => data.date)).toEqual([today, tomorrow]);
    expect(useCartStore.getState().timePreOrder).toEqual([slot('10:30', '11:00')]);
    expect(useCartStore.getState().datePreOrder.map((day) => day.text)).toEqual([
      'Завтра',
      '13 нояб',
    ]);
    expect(alert).not.toHaveBeenCalled();
  });

  it('для самовывоза и другой точки отправляет отдельный запрос', async () => {
    const answer = deferred();
    api.mockReturnValueOnce(answer.promise);
    api.mockResolvedValueOnce([NEAREST, slot('11:00', '11:05')]);

    const delivery = useCartStore.getState().getTimesPred(5, friday, 0, []);
    useCartStore.setState({ typeOrder: 'pic' });
    await useCartStore.getState().getTimesPred(7, friday, 1, []);

    expect(api).toHaveBeenCalledTimes(2);
    expect(api.mock.calls[1][1]).toMatchObject({ point_id: 7, type_order: 1 });
    expect(useCartStore.getState().point_id).toBe(7);

    answer.resolve([NEAREST, slot('15:00', '15:30')]);
    await delivery;
    expect(useCartStore.getState().timePreOrder).toEqual([slot('11:00', '11:05')]);
    expect(useCartStore.getState().point_id).toBe(7);
  });
});
