import { describe, expect, it } from 'vitest';
import { buildStreetAddress } from '../../utils/streetAddress';

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
