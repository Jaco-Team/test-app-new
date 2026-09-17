// Сохраняем уточнения адреса, отделяя их от улицы как в ответах бэкенда.
export function buildStreetAddress(components, cityName = '') {
  const parts = Array.isArray(components) ? components : [];
  const names = (kind) =>
    parts
      .filter((item) => Array.isArray(item?.kind) && item.kind.includes(kind))
      .map((item) => (typeof item.name === 'string' ? item.name.trim() : ''))
      .filter(Boolean);
  const streets = names('STREET');
  const localities = names('LOCALITY');
  const selectedCity = cityName.trim().toLocaleLowerCase('ru');
  const qualifiers = streets.length
    ? localities.filter((name) => name.toLocaleLowerCase('ru') !== selectedCity)
    : [];
  // Последний район — самое подробное уточнение, как в прежнем выборе подсказки.
  const district = names('DISTRICT').slice(-1);
  const result = [
    ...qualifiers,
    ...district,
    ...(streets.length ? streets : localities),
  ];
  const seen = new Set();
  const unique = result.filter((name) => {
    const key = name.toLocaleLowerCase('ru');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { street: unique.join(', '), home: names('HOUSE')[0] ?? '' };
}

// В ответе из БД street уже включает район, у геокодера район приходит отдельно.
export function getAddressStreet(address) {
  const street =
    typeof address?.street === 'string' ? address.street.trim() : '';
  const district =
    typeof address?.city_name_dop === 'string'
      ? address.city_name_dop.trim()
      : '';
  if (!street || !district) return street;

  const normalize = (value) =>
    value
      .replace(/[,\s]+/g, ' ')
      .trim()
      .toLocaleLowerCase('ru');
  const normalizedStreet = normalize(street);
  const normalizedDistrict = normalize(district);
  if (
    normalizedStreet === normalizedDistrict ||
    normalizedStreet.startsWith(`${normalizedDistrict} `)
  ) {
    return street;
  }
  return `${district}, ${street}`;
}

export function getAddressLabel(address) {
  const street = getAddressStreet(address);
  if (!street) return '';
  return [street, String(address?.home ?? '').trim()]
    .filter(Boolean)
    .join(', ');
}

// Дом выделяем только в конце строки: числа в названии улицы/квартала сохраняются.
export function parseAddressInput(value) {
  const text = String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  const match = text.match(
    /^(.+?)(?:,\s*|\s+)(?:д(?:ом)?\.?\s*)?(\d+[а-яa-z]?(?:[/-]\d+[а-яa-z]?)?(?:\s*(?:к(?:орпус|орп)?\.?|с(?:троение|тр)?\.?)\s*\d+[а-яa-z]?)?)$/iu
  );
  if (!match) return null;
  const street = match[1].replace(/[,\s]+$/, '').trim();
  if (!street || /^(?:дом|д\.?|квартал|корпус|строение)$/iu.test(street))
    return null;
  return { street, home: match[2] };
}

export function addressVerificationKey(text, entrance, city) {
  return JSON.stringify([
    String(text ?? '').trim(),
    String(entrance ?? '').trim(),
    String(city ?? ''),
  ]);
}

export function sameAddressHouse(first, second) {
  const normalize = (value) =>
    String(value ?? '')
      .toLocaleLowerCase('ru')
      .replace(/корпус|корп\.?/g, 'к')
      .replace(/строение|стр\.?/g, 'с')
      .replace(/[\s.]+/g, '')
      .replace(
        /[abcehkmoptxy]/g,
        (letter) =>
          ({
            a: 'а',
            b: 'в',
            c: 'с',
            e: 'е',
            h: 'н',
            k: 'к',
            m: 'м',
            o: 'о',
            p: 'р',
            t: 'т',
            x: 'х',
            y: 'у',
          })[letter]
      );
  return normalize(first) === normalize(second);
}
