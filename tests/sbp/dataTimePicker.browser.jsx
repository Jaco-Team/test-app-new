import React, { act, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { getByRole } from '@testing-library/dom';
import { page } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({ state: {}, listeners: new Set() }));
vi.mock('@/components/store.js', () => {
  const useCartStore = (selector) => selector(useSyncExternalStore(
    (listener) => { fixture.listeners.add(listener); return () => fixture.listeners.delete(listener); },
    () => fixture.state,
  ));
  useCartStore.getState = () => fixture.state;
  return { useCartStore };
});
vi.mock('@/ui/Fade', () => ({ Fade: ({ children, style }) => <div style={style}>{children}</div> }));
vi.mock('@/ui/Icons', () => ({ IconClose: () => null }));
import DataTimePicker from '../../modules/cartForm/dataTimePicker';

const dates = [
  { date: '2099-01-01', text: 'Завтра', dow: 'Чт' },
  { date: '2099-01-02', text: '02 янв', dow: 'Пт' },
  { date: '2099-01-03', text: '03 янв', dow: 'Сб' },
  { date: '2099-01-04', text: '04 янв', dow: 'Вс' },
  { date: '2099-01-05', text: '05 янв', dow: 'Пн' },
];
const times = ['10:30', '10:45', '11:00', '11:15', '11:30'].map((start) => ({ name: `${start} - позже`, id: start }));

let host; let root; let style;
const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 80)); });
const arrows = () => document.querySelectorAll('[data-testid="ArrowBackIosNewIcon"]');
const click = async (element) => {
  await act(async () => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await settle();
};

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  fixture.state = {
    dateTimeOrder: null, openDataTimePicker: true, typeOrder: 'dev', orderAddr: { point_id: 5 }, orderPic: null,
    datePreOrder: dates, timePreOrder: times,
    getTimesPred: vi.fn(async () => {}), getDataPred: vi.fn(async () => {}),
    setActiveDataTimePicker: vi.fn(), setDataTimeOrder: vi.fn(),
  };
  // Колесу нужна высота окна меньше высоты списка, иначе прокручивать нечего.
  style = document.createElement('style');
  style.textContent = '.embla__viewport{height:60px;overflow:hidden}.embla__container{display:flex;flex-direction:column;height:60px}.embla__slide{flex:0 0 60px;height:60px}';
  document.head.appendChild(style);
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); style.remove(); });

describe('колесо даты и времени предзаказа', () => {
  it('на каждую смену даты запрашивает время один раз, сколько бы раз дату ни меняли', async () => {
    await page.viewport(1440, 900);
    await act(async () => root.render(<DataTimePicker />));
    await settle();
    const { getTimesPred, setDataTimeOrder } = fixture.state;
    expect(arrows()).toHaveLength(4);
    const nextDate = arrows()[1];

    for (let step = 1; step < dates.length; step += 1) {
      const before = getTimesPred.mock.calls.length;
      await click(nextDate);
      expect(getTimesPred.mock.calls.slice(before)).toEqual([[null, dates[step].date, null, []]]);
    }

    // Время листается без запросов, а «Выбрать» отдаёт дату и время из середины колёс.
    const before = getTimesPred.mock.calls.length;
    await click(arrows()[3]);
    await click(arrows()[3]);
    expect(getTimesPred.mock.calls).toHaveLength(before);
    await click(getByRole(document.body, 'button', { name: 'Выбрать' }));
    expect(setDataTimeOrder).toHaveBeenCalledWith({ ...dates[4], ...times[2] });
    expect(fixture.state.setActiveDataTimePicker).toHaveBeenCalledWith(false);
  });
});
