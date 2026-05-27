import type { HTMLAttributes } from 'react';
import { Badge, Button, Price, QuantityControl } from '../../components';
import type { BadgeTone } from '../../components';
import { cn } from '../../foundation/classNames';
import { ProductCardInfo } from './ProductCardInfo';
import type { ProductCardInfoData } from './ProductCardInfo';
import './ProductCard.scss';

export interface ProductCardBadge {
  tone: BadgeTone;
  label?: string;
}
export interface ProductCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  image: string;
  description?: string;
  meta?: string | string[];
  info?: ProductCardInfoData;
  price: number;
  oldPrice?: number;
  count?: number;
  badges?: ProductCardBadge[];
  onAdd?: () => void;
  onQuantityChange?: (value: number) => void;
  onDetailsClick?: () => void;
}

const metaToItems = (meta?: string | string[]) =>
  Array.isArray(meta)
    ? meta
    : meta
      ? meta
          .split('|')
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

export function ProductCard({
  title,
  image,
  description,
  meta,
  info,
  price,
  oldPrice,
  count = 0,
  badges = [],
  onAdd,
  onQuantityChange,
  onDetailsClick,
  className,
  ...props
}: ProductCardProps) {
  const hasCount = count > 0;
  const metaItems = metaToItems(meta);
  const {
    catId,
    detailText,
    composition,
    nutrition,
    raw,
    weight,
    imageKey,
    ...articleProps
  } = props as typeof props & Record<string, unknown>;

  return (
    <article
      className={cn(
        'ui-product-card',
        hasCount && 'ui-product-card--active',
        className
      )}
      {...articleProps}
    >
      <button
        className="ui-product-card__media"
        type="button"
        aria-label={title}
        onClick={onDetailsClick}
      >
        <img src={image} alt={title} loading="lazy" />
        {badges.length ? (
          <span className="ui-product-card__badges">
            {badges.map((badge) => (
              <Badge
                key={badge.tone + (badge.label ?? '')}
                tone={badge.tone}
                size="lg"
              >
                {badge.label}
              </Badge>
            ))}
          </span>
        ) : null}
      </button>
      <div className="ui-product-card__body">
        <h3 className="ui-product-card__title">{title}</h3>
        <ProductCardInfo info={info} fallback={metaItems} />
        {description ? (
          <p className="ui-product-card__description">{description}</p>
        ) : null}
        <div className="ui-product-card__action">
          {hasCount ? (
            <QuantityControl
              value={count}
              size="md"
              onChange={onQuantityChange}
            />
          ) : (
            <Button tone="muted" size="md" density="regular" onClick={onAdd}>
              <Price value={price} oldValue={oldPrice} size="md" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
