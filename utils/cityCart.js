const CITY_LINKS = new Set(['samara', 'togliatti']);

export function isSupportedCity(value) {
  return CITY_LINKS.has(value);
}

export function reconcileCartItems(items, catalog) {
  const products = new Map(
    (Array.isArray(catalog) ? catalog : [])
      .filter((product) => product?.id != null)
      .map((product) => [Number(product.id), product])
  );
  const kept = [];
  const removed = [];

  for (const item of Array.isArray(items) ? items : []) {
    const product = products.get(Number(item?.item_id ?? item?.id));
    const count = Number(item?.count);
    const price = product?.price == null ? NaN : Number(product.price);

    if (
      !product ||
      !Number.isFinite(price) ||
      !Number.isInteger(count) ||
      count < 1
    ) {
      removed.push(item);
      continue;
    }

    kept.push({
      ...product,
      item_id: product.id,
      count,
      one_price: price,
      all_price: price * count,
    });
  }

  return {
    items: kept,
    removed,
    itemsCount: kept.reduce((sum, item) => sum + item.count, 0),
    total: kept.reduce((sum, item) => sum + item.all_price, 0),
  };
}

export function buildCityDestination(asPath, targetCity, catalog) {
  const url = new URL(asPath || '/', 'https://jacofood.ru');
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length && isSupportedCity(parts[0])) {
    parts[0] = targetCity;
  } else {
    parts.unshift(targetCity);
  }

  const categories = Array.isArray(catalog?.cats) ? catalog.cats : [];
  const hasCategory = (items, link) =>
    items.some(
      (item) =>
        item?.link === link ||
        (Array.isArray(item?.cats) && hasCategory(item.cats, link))
    );
  const categoryLinks = [
    ...(parts[1] === 'menu' && parts[2] ? [parts[2]] : []),
    ...url.searchParams.getAll('category'),
  ];
  const itemLink = url.searchParams.get('item');
  const hasItem =
    !itemLink ||
    (catalog?.all_items || []).some((item) => item?.link === itemLink);

  if (
    categoryLinks.some((link) => !hasCategory(categories, link)) ||
    !hasItem
  ) {
    url.pathname = `/${targetCity}/menu`;
    url.searchParams.delete('item');
    url.searchParams.delete('category');
  } else {
    url.pathname = `/${parts.join('/')}`;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
