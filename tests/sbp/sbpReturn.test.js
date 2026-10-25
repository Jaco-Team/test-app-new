import { describe, expect, it } from 'vitest';
import { readSbpReturn, samePaidOrder, sbpOrdersPath } from '@/utils/sbpReturn';

const query = { sbp_return: '1', point_id: '8', order_id: '180351' };
const path = '/samara/zakazy?sbp_return=1&point_id=8&order_id=180351';
describe('ссылка возврата СБП', () => {
  it('содержит точный заказ без зависимости от браузерного хранилища', () => {
    expect(readSbpReturn(query, path)).toEqual({ requested: true, reference: { pointId: 8, orderId: 180351 }, legacy: false, invalid: false });
  });
  it('поддерживает старую ссылку без идентификаторов', () => {
    expect(readSbpReturn({ sbp_return: '1' }, '/samara?sbp_return=1')).toEqual({ requested: true, reference: null, legacy: true, invalid: false });
  });
  it.each(['0', '-1', '1.5', '1e3', '008', 'NaN', '9007199254740992', '', '8\n', '8\r\n', ' 8', '8 ', ['8', '9']])('не принимает некорректный идентификатор %j', (point_id) => {
    const value = Array.isArray(point_id) ? '8&point_id=9' : encodeURIComponent(point_id);
    expect(readSbpReturn({ ...query, point_id }, `/samara/zakazy?sbp_return=1&point_id=${value}&order_id=180351`)).toMatchObject({ reference: null, invalid: true });
  });
  it.each([
    [{ sbp_return: '1', point_id: '8' }, '/samara?sbp_return=1&point_id=8'],
    [{ ...query, order_id: ['180351', '180352'] }, `${path}&order_id=180352`],
    [query, `${path}&point_id=8`],
    [query, `${path}&sbp_return=1`],
    [{ ...query, sbp_return: ['1', '1'] }, `${path}&sbp_return=1`],
    [{ ...query, sbp_return: '0' }, path.replace('sbp_return=1', 'sbp_return=0')],
  ])('не подменяет неоднозначную ссылку локальным заказом', (data, url) => {
    expect(readSbpReturn(data, url)).toMatchObject({ requested: true, reference: null, invalid: true, legacy: false });
  });
  it('не рассматривает произвольные order_id без маркера возврата как оплату', () => {
    expect(readSbpReturn({ point_id: '8', order_id: '180351' }, '/samara/zakazy?point_id=8&order_id=180351').requested).toBe(false);
  });
  it('переносит старый корневой URL с точной ссылкой на страницу заказов', () => {
    expect(sbpOrdersPath('/samara?sbp_return=1&point_id=8&order_id=180351&utm_source=bank#details', 'samara')).toBe(`${path}&utm_source=bank#details`);
  });
  it('убирает только служебные параметры, сохраняя кодирование, остальные параметры и hash', () => {
    expect(sbpOrdersPath('/samara/zakazy?utm_source=a%20b&sbp_return=1&point_id=8&order_id=180351&foo=1&foo=2#details', 'samara', true)).toBe('/samara/zakazy?utm_source=a%20b&foo=1&foo=2#details');
  });
  it('локальный контекст должен совпадать по точке, номеру и городу', () => {
    const reference = { pointId: 8, orderId: 180351 };
    expect(samePaidOrder({ ...reference, city: 'samara' }, reference, 'samara')).toBe(true);
    expect(samePaidOrder({ ...reference, city: 'togliatti' }, reference, 'samara')).toBe(false);
    expect(samePaidOrder({ ...reference, pointId: 4, city: 'samara' }, reference, 'samara')).toBe(false);
  });
});
