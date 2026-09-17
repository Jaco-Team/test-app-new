import { describe, expect, it } from 'vitest';
import {
  buildStreetAddress,
  getAddressStreet,
  getAddressLabel,
} from '../../utils/streetAddress';

const part = (kind, name) => ({ kind: [kind], name });

describe('адрес подсказки Яндекса', () => {
  it.each([
    ['12-й квартал', 'бульвар Гая', '4'],
    ['20-й квартал', 'Рябиновый бульвар', '1'],
  ])('отделяет %s от улицы запятой', (district, street, home) => {
    expect(
      buildStreetAddress(
        [
          part('DISTRICT', district),
          part('STREET', street),
          part('HOUSE', home),
          part('LOCALITY', 'Тольятти'),
        ],
        'Тольятти'
      )
    ).toEqual({ street: `${district}, ${street}`, home });
  });

  it('сохраняет улицу при любом порядке и позиции kind', () => {
    expect(
      buildStreetAddress(
        [
          { kind: ['OTHER', 'STREET'], name: '  улица Ленина ' },
          part('LOCALITY', 'Тольятти'),
          part('HOUSE', ' 10А '),
        ],
        'Тольятти'
      )
    ).toEqual({ street: 'улица Ленина', home: '10А' });
  });

  it('сохраняет отличающийся населённый пункт и район', () => {
    expect(
      buildStreetAddress(
        [
          part('LOCALITY', 'Тимофеевка'),
          part('DISTRICT', 'Северный район'),
          part('STREET', 'улица Ленина'),
          part('HOUSE', '2'),
        ],
        'Тольятти'
      ).street
    ).toBe('Тимофеевка, Северный район, улица Ленина');
  });

  it('сохраняет населённый пункт для адреса без улицы', () => {
    expect(
      buildStreetAddress(
        [part('LOCALITY', 'Тимофеевка'), part('HOUSE', '2')],
        'Тольятти'
      )
    ).toEqual({ street: 'Тимофеевка', home: '2' });
  });

  it('убирает пустые и повторяющиеся части', () => {
    expect(
      buildStreetAddress([
        part('DISTRICT', ' '),
        part('DISTRICT', '12-й квартал'),
        part('DISTRICT', '12-й квартал'),
        part('STREET', 'бульвар Гая'),
        {},
        null,
      ]).street
    ).toBe('12-й квартал, бульвар Гая');
  });

  it('использует последнее уточнение района без лишнего административного префикса', () => {
    expect(
      buildStreetAddress(
        [
          part('DISTRICT', 'Автозаводский район'),
          part('DISTRICT', '12-й квартал'),
          part('STREET', 'бульвар Гая'),
          part('LOCALITY', 'Тольятти'),
        ],
        'Тольятти'
      ).street
    ).toBe('12-й квартал, бульвар Гая');
  });

  it('не падает без компонентов адреса', () => {
    expect(buildStreetAddress()).toEqual({ street: '', home: '' });
  });
});

describe('адрес из ответа бэкенда', () => {
  it.each([
    [
      '12-й квартал',
      '12-й квартал, бульвар Гая',
      '4',
      '12-й квартал, бульвар Гая',
    ],
    [
      '2-й квартал',
      '2-й квартал, бульвар Кулибина',
      '12',
      '2-й квартал, бульвар Кулибина',
    ],
    ['12-й квартал', 'бульвар Гая', '4', '12-й квартал, бульвар Гая'],
    ['2-й квартал', 'бульвар Кулибина', '12', '2-й квартал, бульвар Кулибина'],
    ['', 'улица Льва Яшина', '10', 'улица Льва Яшина'],
    [undefined, 'улица Льва Яшина', 10, 'улица Льва Яшина'],
    [
      '12-й квартал',
      '12-Й КВАРТАЛ  бульвар Гая',
      '4',
      '12-Й КВАРТАЛ  бульвар Гая',
    ],
  ])('не дублирует уточнение %s в %s', (district, street, home, expected) => {
    const address = { city_name_dop: district, street, home };
    expect(getAddressStreet(address)).toBe(expected);
    expect(getAddressLabel(address)).toBe(`${expected}, ${home}`);
    expect(getAddressStreet({ ...address, street: expected })).toBe(expected);
  });

  it('не принимает часть слова за совпадающее уточнение', () => {
    expect(
      getAddressStreet({
        city_name_dop: 'посёлок Мир',
        street: 'посёлок Мирный, улица Ленина',
      })
    ).toBe('посёлок Мир, посёлок Мирный, улица Ленина');
  });

  it('сохраняет поселок и уточнение при отсутствии совпадения', () => {
    expect(
      getAddressLabel({
        city_name_dop: 'Тимофеевка',
        street: 'Северный район, улица Ленина',
        home: '2',
      })
    ).toBe('Тимофеевка, Северный район, улица Ленина, 2');
  });

  it('не показывает район без улицы и не добавляет пустой дом', () => {
    expect(getAddressLabel({ city_name_dop: '12-й квартал' })).toBe('');
    expect(getAddressLabel({ street: 'бульвар Гая' })).toBe('бульвар Гая');
    expect(getAddressLabel()).toBe('');
  });
});
