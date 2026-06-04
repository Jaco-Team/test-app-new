import type { CartLineItem } from './types';

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

/** Сумма количеств по строкам (legacy: `items.reduce((all, item) => all + item.count, 0)`). */
export function countCartLines(lines: CartLineItem[]): number {
  return lines.reduce((sum, item) => sum + toNumber(item.count), 0);
}

/** Сумма `count * one_price` по строкам. */
export function sumCartLines(lines: CartLineItem[]): number {
  return lines.reduce(
    (sum, item) => sum + toNumber(item.count) * toNumber(item.one_price),
    0
  );
}

/**
 * Число позиций для «Итого: N позиций» — основные товары + допы в корзине.
 * Эквивалентно `countCartLines(items)`, если допы лежат в `items` с cat_id=7.
 */
export function countCartPositions(
  itemsOffDops: CartLineItem[],
  dopListCart: CartLineItem[]
): number {
  return countCartLines(itemsOffDops) + countCartLines(dopListCart);
}

/** Базовая сумма корзины без промо (основные + допы). */
export function sumCartSubtotal(
  itemsOffDops: CartLineItem[],
  dopListCart: CartLineItem[]
): number {
  return sumCartLines(itemsOffDops) + sumCartLines(dopListCart);
}

export function formatCartPositionWord(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return 'позиция';
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'позиции';
  }
  return 'позиций';
}

export function formatCartPositionsLabel(count: number): string {
  return `${count} ${formatCartPositionWord(count)}`;
}

export function formatCartTotalLine(count: number): string {
  return `Итого: ${formatCartPositionsLabel(count)}`;
}

export function resolveCartDisplayTotal(
  itemsOffDops: CartLineItem[],
  dopListCart: CartLineItem[],
  checkPromo: { st?: boolean } | null | undefined,
  allPrice: number | string | null | undefined,
  allPriceWithoutPromo?: number | string | null
): number {
  const subtotal = sumCartSubtotal(itemsOffDops, dopListCart);
  const storedBase = toNumber(allPriceWithoutPromo);
  const resolvedBase = storedBase > 0 ? storedBase : subtotal;
  const promoTotal = toNumber(allPrice);

  return checkPromo?.st && itemsOffDops.length > 0 ? promoTotal : resolvedBase;
}
