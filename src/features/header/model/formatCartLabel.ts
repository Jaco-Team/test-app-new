export function formatCartLabel(
  itemsOffDops: { count?: number | string; one_price?: number | string }[],
  dopListCart: { count?: number | string; one_price?: number | string }[],
  checkPromo: { st?: boolean } | null | undefined,
  allPrice: number | string | null | undefined
): string {
  const price1 = itemsOffDops.reduce(
    (sum, item) => sum + Number(item.count ?? 0) * Number(item.one_price ?? 0),
    0
  );
  const price2 = dopListCart.reduce(
    (sum, item) => sum + Number(item.count ?? 0) * Number(item.one_price ?? 0),
    0
  );
  const baseTotal = price1 + price2;
  const totalToShow =
    checkPromo?.st && itemsOffDops.length ? Number(allPrice) : baseTotal;

  if (!Number.isFinite(totalToShow) || totalToShow <= 0) {
    return 'Корзина';
  }

  return `${new Intl.NumberFormat('ru-RU').format(totalToShow)} ₽`;
}
