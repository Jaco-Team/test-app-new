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
