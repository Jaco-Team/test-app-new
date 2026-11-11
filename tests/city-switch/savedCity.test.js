import { describe, expect, it } from 'vitest';

import { savedCityAction, savedCityPath } from '@/utils/savedCity';

describe('путь страницы в сохранённом городе', () => {
  it('подменяет только город, остальной путь сохраняет', () => {
    expect(savedCityPath('/samara', '', 'togliatti')).toBe('/togliatti');
    expect(savedCityPath('/samara/menu/pizza/', '', 'Togliatti')).toBe(
      '/togliatti/menu/pizza'
    );
    expect(savedCityPath('/togliatti/akcii/mambo', '?a=1', 'samara')).toBe(
      '/samara/akcii/mambo'
    );
  });

  it('не трогает адрес, когда города нет, он тот же или не наш', () => {
    expect(savedCityPath('/samara/menu', '', undefined)).toBeNull();
    expect(savedCityPath('/samara/menu', '', '')).toBeNull();
    expect(savedCityPath('/samara/menu', '', 'samara')).toBeNull();
    expect(savedCityPath('/samara/menu', '', 'moscow')).toBeNull();
    expect(savedCityPath('/samara/menu', '', '//evil.example')).toBeNull();
    expect(savedCityPath('/', '', 'togliatti')).toBeNull();
    expect(savedCityPath('/feedback/stars/token', '', 'togliatti')).toBeNull();
  });

  it('оставляет страницы, привязанные к городу заказа', () => {
    expect(
      savedCityPath('/samara/only_pay_page', '?token=abc', 'togliatti')
    ).toBeNull();
    expect(
      savedCityPath('/samara/zakazy', '?payment_return=1', 'togliatti')
    ).toBeNull();
    expect(
      savedCityPath('/samara/zakazy', '?sbp_return=1', 'togliatti')
    ).toBeNull();
    expect(savedCityPath('/samara/zakazy', '', 'togliatti')).toBe(
      '/togliatti/zakazy'
    );
  });
});

describe('страница города в браузере', () => {
  const location = (pathname, search = '', hash = '') => ({
    pathname,
    search,
    hash,
  });

  it('запоминает город, пока сохранённого нет или он совпадает', () => {
    expect(savedCityAction('samara', undefined, location('/samara'))).toEqual({
      save: true,
    });
    expect(savedCityAction('samara', 'moscow', location('/samara'))).toEqual({
      save: true,
    });
    expect(savedCityAction('samara', 'samara', location('/samara'))).toEqual({
      save: true,
    });
  });

  it('уходит в сохранённый город с теми же параметрами и якорем', () => {
    expect(
      savedCityAction(
        'samara',
        'togliatti',
        location('/samara/menu/pizza', '?utm_source=vk', '#cat14')
      )
    ).toEqual({ redirect: '/togliatti/menu/pizza?utm_source=vk#cat14' });
  });

  it('на странице оплаты не уходит и не перезаписывает сохранённый город', () => {
    expect(
      savedCityAction(
        'samara',
        'togliatti',
        location('/samara/only_pay_page', '?token=abc')
      )
    ).toEqual({});
  });
});
