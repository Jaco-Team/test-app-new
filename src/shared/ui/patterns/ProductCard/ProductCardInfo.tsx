import { cn } from '../../foundation/classNames';

export type ProductCardInfoData = {
  catId?: string;
  countPart?: string;
  countPartNew?: string;
  sizePizza?: string;
  weight?: string;
};

export type ProductCardInfoProps = {
  info?: ProductCardInfoData;
  fallback?: string[];
  className?: string;
};

const SET_CATEGORY_IDS = new Set(['4']);
const ROLL_CATEGORY_IDS = new Set(['9', '10', '12', '13']);
const PIZZA_CATEGORY_IDS = new Set('14');

function cleanValue(value: unknown): string | undefined {
  const text = String(value ?? '').trim();
  return text.length > 0 && text !== '0' ? text : undefined;
}

function withUnit(value: unknown, unit: string): string | undefined {
  const text = cleanValue(value);
  if (!text) {
    return undefined;
  }

  return /[a-zа-яё]/i.test(text) ? text : text + ' ' + unit;
}

export function ProductCardInfo({
  info,
  fallback = [],
  className,
}: ProductCardInfoProps) {
  const catId = cleanValue(info?.catId);
  const weight = withUnit(info?.weight, 'г');
  const countRolls = withUnit(info?.countPart, 'шт');
  const countPart = withUnit(info?.countPart, 'шт');
  const pizzaSize = withUnit(info?.sizePizza, 'см');
  const countPartNew = cleanValue(info?.countPartNew);
  const items =
    catId && PIZZA_CATEGORY_IDS.has(catId)
      ? [pizzaSize, weight]
      : catId && ROLL_CATEGORY_IDS.has(catId)
        ? [countPart, weight]
        : [pizzaSize, countPart, weight, countPartNew];
  const visibleItems = items.filter((item): item is string => Boolean(item));
  const fallbackItems = fallback.filter(Boolean);
  const displayItems = visibleItems || fallbackItems;

  if (!displayItems.length) {
    return null;
  }

  return (
    <p className={cn('ui-product-card__info', className)}>
      {displayItems.map((item, index) => (
        <span key={item + index}>{item}</span>
      ))}
    </p>
  );
}
