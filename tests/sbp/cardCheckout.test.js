import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cardCheckoutFingerprint, clearCardCheckoutRequest, hostedCardConfirmationUrl,
  readCardCheckoutRequest, saveCardCheckoutRequest,
} from '@/utils/cardCheckout';

function storage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key), values };
}
const marker = { fingerprint: 'a'.repeat(64), city: 'samara', confirmation: 'redirect' };
beforeEach(() => {
  vi.stubGlobal('window', { sessionStorage: storage() });
  clearCardCheckoutRequest('owner-secret'); clearCardCheckoutRequest('another-owner');
});
afterEach(() => vi.unstubAllGlobals());

describe('защита первого карточного запроса', () => {
  it('хранит только маркеры и точную ссылку, изолированную от другого аккаунта', () => {
    saveCardCheckoutRequest('owner-secret', { ...marker, token: 'private', address: 'Личный адрес', reference: { pointId: 5, orderId: 123 } });
    const stored = [...window.sessionStorage.values.values()].join();
    expect(stored).not.toContain('owner-secret'); expect(stored).not.toContain('private'); expect(stored).not.toContain('Личный адрес');
    expect(readCardCheckoutRequest('another-owner')).toBeNull();
    expect(readCardCheckoutRequest('owner-secret').reference).toEqual({ pointId: 5, orderId: 123 });
  });
  it('повторная загрузка модуля читает сохранённую блокировку неоднозначного запроса', async () => {
    saveCardCheckoutRequest('owner-secret', marker);
    vi.resetModules();
    const refreshed = await import('@/utils/cardCheckout');
    expect(refreshed.readCardCheckoutRequest('owner-secret')).toMatchObject(marker);
    refreshed.clearCardCheckoutRequest('owner-secret');
  });
  it('не разрешает hosted-запрос, если браузер не сохраняет маркер', () => {
    window.sessionStorage.setItem = () => { throw new Error('blocked'); };
    expect(saveCardCheckoutRequest('owner-secret', marker, { requirePersistence: true })).toBeNull();
    expect(readCardCheckoutRequest('owner-secret')).toBeNull();
  });
  it('сохраняет известный order ref в памяти, если после POST место в storage закончилось', () => {
    saveCardCheckoutRequest('owner-secret', marker);
    window.sessionStorage.setItem = () => { throw new Error('quota'); };
    saveCardCheckoutRequest('owner-secret', { ...marker, reference: { pointId: 5, orderId: 123 } });
    expect(readCardCheckoutRequest('owner-secret').reference).toEqual({ pointId: 5, orderId: 123 });
  });
  it('отпечаток изменяется при смене реквизитов оформления', () => {
    const state = { typePay: { id: 'online' }, typeOrder: 'pic', items: [{ item_id: 1, count: 1 }], allPrice: 100, orderPic: { id: 5 } };
    const original = cardCheckoutFingerprint(state, 'owner-secret', 'samara');
    expect(cardCheckoutFingerprint({ ...state, orderPic: { id: 6 } }, 'owner-secret', 'samara')).not.toBe(original);
    expect(cardCheckoutFingerprint(state, 'another-owner', 'samara')).not.toBe(original);
    expect(cardCheckoutFingerprint(state, 'owner-secret', 'togliatti')).not.toBe(original);
  });
});

describe('адрес страницы оплаты карты', () => {
  it.each(['https://yookassa.ru/payments/1', 'https://payments.yoomoney.ru:443/checkout?id=1'])('принимает только HTTPS провайдера: %s', (url) => {
    expect(hostedCardConfirmationUrl(url)).not.toBeNull();
  });
  it.each(['http://yookassa.ru/pay', 'javascript:alert(1)', 'https://yookassa.ru.evil.example/pay', 'https://evil.example/yookassa.ru', 'https://user:password@yookassa.ru/pay', 'https://yookassa.ru:444/pay'])('отклоняет подмену адреса: %s', (url) => {
    expect(hostedCardConfirmationUrl(url)).toBeNull();
  });
});
