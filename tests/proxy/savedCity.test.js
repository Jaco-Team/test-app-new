import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '../../proxy.js';

const fetchMock = vi.fn();

function pageRequest(path, cookie) {
  return new NextRequest(`https://jacofood.ru${path}`, {
    headers: {
      host: 'jacofood.ru',
      'x-forwarded-proto': 'https',
      accept: 'text/html',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      ...(cookie ? { cookie } : {}),
    },
  });
}

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('сохранённый город', () => {
  it.each([
    ['/samara', '/togliatti'],
    ['/samara/menu/pizza', '/togliatti/menu/pizza'],
    ['/samara/akcii/mambo', '/togliatti/akcii/mambo'],
    ['/samara/cart?utm_source=qr', '/togliatti/cart?utm_source=qr'],
  ])('ведёт %s в сохранённый город', async (path, expected) => {
    const response = await proxy(pageRequest(path, 'city=togliatti'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      `https://jacofood.ru${expected}`
    );
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('за один переход меняет город и чистит служебные параметры', async () => {
    const response = await proxy(
      pageRequest('/Samara/menu?showItem=5&utm_source=vk', 'city=togliatti')
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://jacofood.ru/togliatti/menu?utm_source=vk'
    );
  });

  it('не переносит в адрес служебный параметр города из запроса данных страницы', async () => {
    const response = await proxy(
      pageRequest('/samara/menu?city=samara&category=pizza', 'city=togliatti')
    );

    expect(response.headers.get('location')).toBe(
      'https://jacofood.ru/togliatti/menu?category=pizza'
    );
  });

  it.each([
    ['без сохранённого города', '/samara/menu/pizza', undefined],
    ['с тем же городом', '/samara/menu/pizza', 'city=samara'],
    ['с неизвестным городом в куке', '/samara/menu/pizza', 'city=moscow'],
    ['с пустой кукой', '/samara/menu/pizza', 'city='],
    ['на странице выбора города', '/', 'city=togliatti'],
    ['на странице оплаты по ссылке', '/samara/only_pay_page?token=abc', 'city=togliatti'],
    ['при возврате с оплаты картой', '/samara/zakazy?payment_return=1&order_id=77', 'city=togliatti'],
    ['при возврате из СБП', '/samara/zakazy?sbp_return=1', 'city=togliatti'],
    ['на служебной странице вне города', '/feedback/stars/token', 'city=togliatti'],
  ])('остаётся на странице %s', async (_name, path, cookie) => {
    const response = await proxy(pageRequest(path, cookie));

    expect(response.headers.get('location')).toBeNull();
    expect(response.status).toBe(200);
  });
});
