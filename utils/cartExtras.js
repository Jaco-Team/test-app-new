export function getExtraItemId(item) {
  return Number(item?.item_id ?? item?.id);
}

export function getExtraCount(items, itemId) {
  const count = Number(
    (Array.isArray(items) ? items : []).find(
      (item) => getExtraItemId(item) === itemId
    )?.count ?? 0
  );
  return Number.isFinite(count) && count > 0 ? count : 0;
}

export function getCartExtraGroups(dopListCart, items, allItems, mainItems) {
  const catalog = new Map(
    (Array.isArray(allItems) ? allItems : []).map(
      (item) => [getExtraItemId(item), item]
    )
  );
  // Подарок с disabled — отдельная промо-строка, не платная позиция этого ID.
  const mainIds = new Set(
    (Array.isArray(mainItems) ? mainItems : [])
      .filter((item) => !item?.disabled)
      .map(getExtraItemId)
  );
  const extras = new Map();
  const selectedExtras = (Array.isArray(items) ? items : []).filter((item) => {
    const id = getExtraItemId(item);
    const categoryId = Number(item?.cat_id ?? catalog.get(id)?.cat_id);
    return Number(item?.count) > 0 &&
      (categoryId === 7 || id === 17 || id === 237);
  });

  // Сохраняем выдачу дополнений и выбранные соусы вне этой выдачи.
  [...(Array.isArray(dopListCart) ? dopListCart : []), ...selectedExtras].forEach((item) => {
    const id = getExtraItemId(item);
    if (!Number.isInteger(id) || id <= 0 || mainIds.has(id)) return;
    const extra = {
      ...catalog.get(id),
      ...extras.get(id),
      ...item,
      id,
      item_id: id,
      count: getExtraCount(items, id),
    };
    extra.one_price = extra.one_price ?? extra.price;
    extras.set(id, extra);
  });

  const utensils = [];
  const sauces = [];
  extras.forEach((item, id) => {
    (id === 17 || id === 237 ? utensils : sauces).push(item);
  });
  return { utensils, sauces, ids: new Set(extras.keys()) };
}
