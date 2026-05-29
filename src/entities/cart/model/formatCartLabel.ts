import type { CartLineItem } from './types';

export function formatCartLabel(
  itemsOffDops: CartLineItem[],
  dopListCart: CartLineItem[],
  checkPromo: { st?: boolean } | null | undefined,
  allPrice: number | string | null | undefined,
  allPriceWithoutPromo?: number | string | null
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
  const storedBase = Number(allPriceWithoutPromo);
  const resolvedBase =
    Number.isFinite(storedBase) && storedBase > 0 ? storedBase : baseTotal;
  const totalToShow =
    checkPromo?.st && itemsOffDops.length ? Number(allPrice) : resolvedBase;

  if (!Number.isFinite(totalToShow) || totalToShow <= 0) {
    return 'Корзина';
  }

  return `${new Intl.NumberFormat('ru-RU').format(totalToShow)} ₽`;
}
