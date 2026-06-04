import { resolveCartDisplayTotal } from './cartTotals';
import type { CartLineItem } from './types';

export function formatCartLabel(
  itemsOffDops: CartLineItem[],
  dopListCart: CartLineItem[],
  checkPromo: { st?: boolean } | null | undefined,
  allPrice: number | string | null | undefined,
  allPriceWithoutPromo?: number | string | null
): string {
  const totalToShow = resolveCartDisplayTotal(
    itemsOffDops,
    dopListCart,
    checkPromo,
    allPrice,
    allPriceWithoutPromo
  );

  if (!Number.isFinite(totalToShow) || totalToShow <= 0) {
    return 'Корзина';
  }

  return `${new Intl.NumberFormat('ru-RU').format(totalToShow)} ₽`;
}
