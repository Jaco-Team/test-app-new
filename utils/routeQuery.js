// Обновляет один параметр, не меняя кодирование и порядок остальных параметров.
export function updateRouteQuery(path, name, value) {
  const route = String(path || '/');
  const hashIndex = route.indexOf('#');
  const hash = hashIndex === -1 ? '' : route.slice(hashIndex);
  const withoutHash = hashIndex === -1 ? route : route.slice(0, hashIndex);
  const queryIndex = withoutHash.indexOf('?');
  const pathname =
    queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : withoutHash.slice(queryIndex + 1);
  const entries = query ? query.split('&').filter(Boolean) : [];
  const retained = entries.filter((entry) => {
    const rawName = entry.split('=', 1)[0];
    try {
      return decodeURIComponent(rawName.replace(/\+/g, ' ')) !== name;
    } catch {
      return rawName !== name;
    }
  });

  if (value != null && value !== '') {
    retained.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
  }

  return `${pathname}${retained.length ? `?${retained.join('&')}` : ''}${hash}`;
}
