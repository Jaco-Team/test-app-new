import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  UMAMI_BEFORE_SEND,
  getVisitIds,
  trackUmami,
  umamiBeforeSendScript,
  umamiEventData,
} from '@/utils/umami';

const VID = '6F1C2B3A-1111-4222-8333-944455556666';

function withBrowser(cookie) {
  vi.stubGlobal('document', { cookie });
  vi.stubGlobal('window', { location: { origin: 'https://jacofood.ru' } });
}

afterEach(() => vi.unstubAllGlobals());

describe('данные событий Umami', () => {
  it('оставляет только скаляры и не пропускает персональные поля', () => {
    expect(
      umamiEventData({
        item_id: 123,
        price: 590,
        city: 'samara',
        is_set: true,
        phone: '89001112233',
        Number: '89001112233',
        address: 'ул. Мира',
        cart: [{ id: 1 }],
        empty: '',
        bad: Number.NaN,
      })
    ).toEqual({ item_id: 123, price: 590, city: 'samara', is_set: true });
  });

  it('отправляет событие отмены без свободного текста причины', () => {
    withBrowser('');
    const track = vi.fn();
    window.umami = { track };
    trackUmami('del_order', { text: 'позвоните на 89001112233' });
    expect(track).toHaveBeenCalledWith('del_order', undefined);
  });

  it('обрезает длинные строки и число полей', () => {
    const params = Object.fromEntries(
      Array.from({ length: 30 }, (_, i) => [`f${i}`, 'x'.repeat(300)])
    );
    const data = umamiEventData(params);
    expect(Object.keys(data)).toHaveLength(20);
    expect(data.f0).toHaveLength(200);
    expect(umamiEventData(null)).toBeUndefined();
  });

  it('без трекера не падает, с трекером шлёт очищенные данные', () => {
    withBrowser('');
    expect(() => trackUmami('add_to_cart', { item_id: 1 })).not.toThrow();
    const track = vi.fn();
    window.umami = { track };
    trackUmami('add_to_cart', { item_id: 1, phone: '8900' });
    expect(track).toHaveBeenCalledWith('add_to_cart', { item_id: 1 });
  });
});

describe('связь визита', () => {
  it('берёт только корректные vid/sid из cookie', () => {
    withBrowser(`a=1; vid=${VID}; sid=not-a-uuid`);
    expect(getVisitIds()).toEqual({ vid: VID.toLowerCase() });
  });

  it.each(['missing', 'blocked'])('недоступный cookie (%s) не ломает заказ или before-send', (mode) => {
    withBrowser(undefined);
    if (mode === 'blocked') {
      Object.defineProperty(document, 'cookie', {
        get() { throw new Error('cookie access blocked'); },
      });
    }
    expect(getVisitIds()).toEqual({});
    new Function(umamiBeforeSendScript)();
    expect(window[UMAMI_BEFORE_SEND]('event', { url: '/' })).not.toHaveProperty('id');
  });

  it('повреждённое кодирование cookie не ломает заказ или before-send', () => {
    withBrowser(`vid=%E0%A4%A; sid=${VID}`);
    expect(getVisitIds()).toEqual({ sid: VID.toLowerCase() });
    new Function(umamiBeforeSendScript)();
    expect(window[UMAMI_BEFORE_SEND]('event', { url: '/' })).not.toHaveProperty('id');
  });

  it('before-send ставит vid как distinct id и вырезает чувствительные query', () => {
    withBrowser(`vid=${VID}`);
    new Function(umamiBeforeSendScript)();
    const payload = window[UMAMI_BEFORE_SEND]('event', {
      website: 'w',
      url: '/samara/zakazy?token=secret&utm_source=vk',
      referrer: 'https://ya.ru/?phone=8900&q=rolly',
    });
    expect(payload).toEqual({
      website: 'w',
      url: '/samara/zakazy?utm_source=vk',
      referrer: 'https://ya.ru/?q=rolly',
      id: VID.toLowerCase(),
    });
  });

  it.each(['stars', 'emoji'])('не отправляет capability формы %s в url или referrer', (flow) => {
    withBrowser(`vid=${VID}`);
    new Function(umamiBeforeSendScript)();
    const capability = 'synthetic-feedback-capability';
    const input = {
      url: `/feedback/${flow}/${capability}/extra?utm_source=${capability}#${capability}`,
      referrer: `https://jacofood.ru/feedback/${flow}/${capability}?token=${capability}#${capability}`,
    };
    const payload = window[UMAMI_BEFORE_SEND]('event', input);
    expect(payload.url).toBe(`/feedback/${flow}`);
    expect(payload.referrer).toBe(`https://jacofood.ru/feedback/${flow}`);
    expect(JSON.stringify(payload)).not.toContain(capability);
    expect(input.url).toContain(capability);
  });

  it('удаляет hash обычных URL, сохраняя разрешённые query-параметры', () => {
    withBrowser('');
    new Function(umamiBeforeSendScript)();
    const payload = window[UMAMI_BEFORE_SEND]('event', {
      url: '/samara?utm_source=vk#synthetic-secret',
      referrer: 'https://ya.ru/?q=rolly#synthetic-secret',
    });
    expect(payload.url).toBe('/samara?utm_source=vk');
    expect(payload.referrer).toBe('https://ya.ru/?q=rolly');
  });

  it('не отправляет исходную строку, если URL не удалось разобрать', () => {
    withBrowser('');
    new Function(umamiBeforeSendScript)();
    const payload = window[UMAMI_BEFORE_SEND]('event', {
      url: 'http://[broken/feedback/stars/synthetic-capability',
      referrer: 'http://[broken/#synthetic-secret',
    });
    expect(payload.url).toBe('');
    expect(payload.referrer).toBe('');
  });

  it('без vid не подставляет id', () => {
    withBrowser('vid=broken');
    new Function(umamiBeforeSendScript)();
    expect(window[UMAMI_BEFORE_SEND]('event', { url: '/' })).not.toHaveProperty('id');
  });
});
