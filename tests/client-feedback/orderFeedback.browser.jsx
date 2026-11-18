import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import {
  getByRole,
  getByText,
  queryByRole,
  queryByText,
} from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const fixture = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock('@/components/api', () => ({
  api: (...args) => fixture.request(...args),
}));
vi.mock('@/utils/browserStorage', () => ({
  getLocalStorageItem: () => 'user-token',
}));
vi.mock('next/image', () => ({
  default: ({ alt, src }) => (
    <img alt={alt} src={typeof src === 'string' ? src : ''} />
  ),
}));

import OrderFeedback from '@/modules/clientFeedback/OrderFeedback';
import { mockFeedbackForm } from '@/modules/clientFeedback/mockFeedback';

let container;
let root;

function order(feedback) {
  return {
    point_id: 7,
    order_id: 12345,
    type_order_: 1,
    date_time_order_new: '15 января 12:30',
    status_order: 6,
    feedback,
  };
}

async function render(element) {
  await act(async () => root.render(element));
}

async function click(element) {
  await act(async () => {
    element.click();
  });
}

async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function calls(type) {
  return fixture.request.mock.calls.filter(
    ([, params]) => params.type === type
  );
}

describe('оценка заказа в модалке заказа', () => {
  beforeEach(() => {
    fixture.request.mockReset();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.innerHTML = '';
  });

  it('не показывается, если бэк не разрешил оценку', async () => {
    await render(
      <OrderFeedback order={order({ available: false, submitted: false })} />
    );
    expect(container.textContent).toBe('');

    await render(<OrderFeedback order={order(undefined)} />);
    expect(container.textContent).toBe('');
  });

  it('проводит от кнопки до «Спасибо» и отправляет отзыв один раз', async () => {
    let resolveSubmit;
    fixture.request.mockImplementation((module, params) => {
      expect(module).toBe('client_feedback');
      if (params.type === 'get_form')
        return Promise.resolve({ ...mockFeedbackForm, submitted: false });
      return new Promise((resolve) => {
        resolveSubmit = () =>
          resolve({ st: true, feedback_ids: [501], already_existed: false });
      });
    });

    await render(
      <OrderFeedback order={order({ available: true, submitted: false })} />
    );
    expect(
      getByText(container, 'Доставлен курьером 15 января 12:30')
    ).toBeTruthy();
    await click(getByRole(container, 'button', { name: 'Оценить заказ' }));

    // Лист «Вам понравился заказ?», форма грузится заранее.
    expect(getByText(document.body, 'Вам понравился заказ?')).toBeTruthy();
    await settle();
    expect(calls('get_form')).toHaveLength(1);
    expect(calls('get_form')[0][1]).toMatchObject({
      point_id: 7,
      order_id: 12345,
      token: 'user-token',
    });

    await click(getByRole(document.body, 'button', { name: '4 из 5' }));
    await settle();

    // Форма открылась с уже выбранной оценкой — «Отправить» активна.
    const dialog = getByRole(document.body, 'dialog', { name: 'Форма отзыва' });
    expect(getByText(dialog, 'Хорошо')).toBeTruthy();
    expect(queryByText(dialog, 'Добавить фото')).toBeNull();
    const send = getByRole(dialog, 'button', { name: 'Отправить' });
    expect(send.disabled).toBe(false);

    // Двойной клик: второй игнорируется, пока первый запрос идёт.
    await act(async () => {
      send.click();
      send.click();
    });
    expect(calls('submit_feedback')).toHaveLength(1);
    const responses = JSON.parse(calls('submit_feedback')[0][1].responses);
    expect(responses).toContainEqual({
      target_id: -100,
      element_id: 'site-order-rating',
      value: 4,
    });
    expect(calls('submit_feedback')[0][1].__disableRetry).toBe(true);

    await act(async () => resolveSubmit());
    await settle();

    expect(getByText(document.body, 'Спасибо за отзыв!')).toBeTruthy();
    expect(
      getByText(document.body, 'Отправим ваш отзыв в отдел контроля качества.')
    ).toBeTruthy();
    expect(
      getByRole(container, 'button', { name: 'Моя оценка заказа' })
    ).toBeTruthy();
    expect(calls('submit_feedback')).toHaveLength(1);
  });

  it('для уже оценённого заказа показывает «Моя оценка заказа» без запросов', async () => {
    await render(
      <OrderFeedback order={order({ available: true, submitted: true })} />
    );

    await click(getByRole(container, 'button', { name: 'Моя оценка заказа' }));
    expect(getByText(document.body, 'Спасибо за отзыв!')).toBeTruthy();
    expect(fixture.request).not.toHaveBeenCalled();

    await click(getByRole(document.body, 'button', { name: 'Закрыть' }));
    expect(queryByText(document.body, 'Спасибо за отзыв!')).toBeNull();
  });

  it('если отзыв уже отправлен с другого устройства, сразу благодарит', async () => {
    fixture.request.mockResolvedValue({
      ...mockFeedbackForm,
      submitted: true,
      feedback_ids: [9],
    });

    await render(
      <OrderFeedback order={order({ available: true, submitted: false })} />
    );
    await click(getByRole(container, 'button', { name: 'Оценить заказ' }));
    await click(getByRole(document.body, 'button', { name: '5 из 5' }));
    await settle();

    expect(getByText(document.body, 'Спасибо за отзыв!')).toBeTruthy();
    expect(
      queryByRole(document.body, 'dialog', { name: 'Форма отзыва' })
    ).toBeNull();
    expect(calls('submit_feedback')).toHaveLength(0);
  });

  it('показывает ошибку загрузки формы и даёт повторить', async () => {
    fixture.request
      .mockResolvedValueOnce({
        st: false,
        text: 'Оценка заказов сейчас недоступна',
      })
      .mockResolvedValueOnce({ ...mockFeedbackForm, submitted: false });

    await render(
      <OrderFeedback order={order({ available: true, submitted: false })} />
    );
    await click(getByRole(container, 'button', { name: 'Оценить заказ' }));
    await settle();
    expect(
      getByText(document.body, 'Оценка заказов сейчас недоступна')
    ).toBeTruthy();

    await click(getByRole(document.body, 'button', { name: 'Повторить' }));
    await settle();
    await click(getByRole(document.body, 'button', { name: '5 из 5' }));
    await settle();
    expect(
      getByRole(document.body, 'dialog', { name: 'Форма отзыва' })
    ).toBeTruthy();
  });
});
