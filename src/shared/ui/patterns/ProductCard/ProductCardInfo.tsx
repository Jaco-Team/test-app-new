import { cn } from '../../foundation/classNames';

export type ProductCardInfoData = {
  catId?: string;
  productId?: string;
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

const SET_CATEGORY_ID = '4';
const PIZZA_CATEGORY_ID = '14';
const DRINK_LITER_CAT_ID = '6';
const HIDDEN_PIECES_CAT_IDS = new Set(['5', '6', '7', '15']);
const ROLL_CATEGORY_IDS = new Set(['9', '10', '12', '13']);
const WEIGHT_AS_PIECES_ITEM_IDS = new Set(['17', '237']);

function cleanValue(value: unknown): string | undefined {
  const text = String(value ?? '').trim();
  return text.length > 0 && text !== '0' ? text : undefined;
}

function formatPieces(
  catId: string,
  countPart?: string,
  sizePizza?: string
): string | undefined {
  if (HIDDEN_PIECES_CAT_IDS.has(catId)) {
    return undefined;
  }

  if (catId === PIZZA_CATEGORY_ID) {
    const size = cleanValue(sizePizza);
    return size ? `${size} см` : undefined;
  }

  const count = cleanValue(countPart);
  if (!count) {
    return undefined;
  }

  const unit = catId === DRINK_LITER_CAT_ID ? 'л' : 'шт.';
  return `${count} ${unit}`;
}

function formatWeight(
  catId: string,
  productId: string | undefined,
  weight?: string
): string | undefined {
  const raw = cleanValue(weight);
  if (!raw) {
    return undefined;
  }

  const numeric = Number(String(raw).replace(/\s/g, '').replace(',', '.'));
  const formatted = Number.isFinite(numeric)
    ? new Intl.NumberFormat('ru-RU').format(numeric)
    : raw;

  let unit = 'г';
  if (productId && WEIGHT_AS_PIECES_ITEM_IDS.has(productId)) {
    unit = 'шт.';
  } else if (catId === DRINK_LITER_CAT_ID) {
    unit = 'л';
  }

  return `${formatted} ${unit}`;
}

function buildDisplayItems(info?: ProductCardInfoData): string[] {
  const catId = cleanValue(info?.catId);
  if (!catId) {
    return [];
  }

  const productId = cleanValue(info?.productId);
  const weight = formatWeight(catId, productId, info?.weight);
  const pieces = formatPieces(catId, info?.countPart, info?.sizePizza);
  const rollsLabel = cleanValue(info?.countPartNew);

  if (catId === SET_CATEGORY_ID) {
    return [rollsLabel, pieces, weight].filter((item): item is string =>
      Boolean(item)
    );
  }

  if (catId === PIZZA_CATEGORY_ID) {
    return [pieces, weight].filter((item): item is string => Boolean(item));
  }

  if (ROLL_CATEGORY_IDS.has(catId)) {
    return [pieces, weight].filter((item): item is string => Boolean(item));
  }

  if (HIDDEN_PIECES_CAT_IDS.has(catId)) {
    return weight ? [weight] : [];
  }

  return [pieces, weight].filter((item): item is string => Boolean(item));
}

export function ProductCardInfo({
  info,
  fallback = [],
  className,
}: ProductCardInfoProps) {
  const displayItems = buildDisplayItems(info);
  const fallbackItems = fallback.filter(Boolean);
  const visibleItems = displayItems.length ? displayItems : fallbackItems;

  if (!visibleItems.length) {
    return null;
  }

  return (
    <p className={cn('ui-product-card__info', className)}>
      {visibleItems.map((item, index) => (
        <span key={item + index}>{item}</span>
      ))}
    </p>
  );
}
