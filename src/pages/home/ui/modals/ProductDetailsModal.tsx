'use client';

import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Badge,
  Button,
  ModalWrapper,
  Price,
  QuantityControl,
} from '@src/shared/ui';
import {
  PRODUCT_MODAL_IMAGE_SIZES,
  resolveProductImageSrcSet,
  resolveProductImageUrl,
} from '@src/shared/lib/mediaUrls';
import { BREAKPOINTS } from '@src/shared/ui/foundation/breakpoints';
import type { HomeProduct } from '../../model/types';
import { cn } from '@src/shared/ui/foundation/classNames';
import './ProductDetailsModal.scss';

export type ProductDetailsModalProps = {
  product: HomeProduct | null;
  count: number;
  onClose: () => void;
  onAdd: () => void;
  onQuantityChange: (value: number) => void;
};

function textValue(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim();
}

function firstText(...values: unknown[]): string {
  return values.map(textValue).find(Boolean) ?? '';
}

function productKcal(item: Record<string, unknown>): string {
  return firstText(item.kkal, item.calories);
}

function productProtein(item: Record<string, unknown>): string {
  return firstText(item.protein, item.proteins);
}

function productFat(item: Record<string, unknown>): string {
  return firstText(item.fat, item.fats);
}

function productCarbs(item: Record<string, unknown>): string {
  return firstText(item.carbohydrates);
}

function numberValue(value: unknown): number {
  const next = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(next) ? next : NaN;
}

function formatMacro(value: number): string {
  return Number.isFinite(value)
    ? new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      }).format(value)
    : '-';
}

function formatKcal(value: number): string {
  return Number.isFinite(value)
    ? new Intl.NumberFormat('ru-RU').format(Math.round(value))
    : '-';
}

function scaledValue(
  value: string,
  weight: unknown,
  mode: 'per100' | 'whole',
  kind: 'kcal' | 'macro'
): string {
  const numericValue = numberValue(value);
  if (mode === 'per100') {
    return kind === 'kcal'
      ? formatKcal(numericValue)
      : formatMacro(numericValue);
  }

  const numericWeight = numberValue(weight);
  const scaled =
    Number.isFinite(numericValue) && Number.isFinite(numericWeight)
      ? (numericValue * numericWeight) / 100
      : NaN;
  return kind === 'kcal' ? formatKcal(scaled) : formatMacro(scaled);
}

function ProductSetList({
  items,
  className,
}: {
  items: Record<string, unknown>[];
  className?: string;
}) {
  return (
    <section
      className={cn('home-product-modal__set-list', className)}
      aria-label={`Сет состоит из ${items.length} роллов`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="home-product-modal__set-head">
        <h3>Сет состоит из {items.length} роллов:</h3>
      </div>
      <div className="home-product-modal__set-scroll">
        {items.map((item, index) => {
          const imageKey = firstText(item.img_app, item.img);
          const description = firstText(
            item.marc_desc,
            item.tmp_desc,
            item.text
          );
          return (
            <article
              className="home-product-modal__set-item"
              key={String(item.id ?? item.name ?? index)}
            >
              <span className="home-product-modal__set-index">
                {index + 1}.
              </span>
              <picture className="home-product-modal__set-picture">
                {imageKey ? (
                  <source
                    type="image/webp"
                    srcSet={resolveProductImageSrcSet(imageKey, 'webp')}
                    sizes="96px"
                  />
                ) : null}
                {imageKey ? (
                  <source
                    type="image/jpeg"
                    srcSet={resolveProductImageSrcSet(imageKey, 'jpg')}
                    sizes="96px"
                  />
                ) : null}
                {imageKey ? (
                  <img
                    src={resolveProductImageUrl(imageKey)}
                    alt={firstText(item.name) || 'Ролл'}
                    loading="lazy"
                  />
                ) : null}
              </picture>
              <div className="home-product-modal__set-text">
                <strong>{firstText(item.name) || 'Ролл'}</strong>
                {description ? <span>{description}</span> : null}
                {firstText(item.count_part, item.weight) ? (
                  <small>
                    {firstText(item.count_part)
                      ? `${firstText(item.count_part)} шт.`
                      : ''}
                    {firstText(item.count_part) && firstText(item.weight)
                      ? ' | '
                      : ''}
                    {firstText(item.weight)
                      ? `${firstText(item.weight)} г`
                      : ''}
                  </small>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProductValueTable({
  items,
  title = 'Пищевая ценность',
  className,
}: {
  items: Record<string, unknown>[];
  title?: string;
  className?: string;
}) {
  const [mode, setMode] = useState<'per100' | 'whole'>('per100');

  return (
    <section
      className={
        className
          ? `home-product-modal__value ${className}`
          : 'home-product-modal__value'
      }
      aria-label={title}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="home-product-modal__value-head">
        <h3>{title}</h3>
        <p>
          Полное описание состава всех блюд, калорийности и возможных аллергенов
          можно{' '}
          <a
            href="/samara/pamiatka_po_sohraneniiu_zdorovia"
            rel="noreferrer"
            target="_blank"
          >
            скачать в формате PDF
          </a>
        </p>
        <div className="home-product-modal__value-tabs">
          <button
            type="button"
            className={mode === 'per100' ? 'is-active' : undefined}
            onClick={() => setMode('per100')}
          >
            на 100 г
          </button>
          <button
            type="button"
            className={mode === 'whole' ? 'is-active' : undefined}
            onClick={() => setMode('whole')}
          >
            на всё блюдо
          </button>
        </div>
      </div>

      <div className="home-product-modal__value-list">
        {items.map((item, index) => (
          <article
            className="home-product-modal__value-row"
            key={String(item.id ?? index)}
          >
            <span className="home-product-modal__value-index">
              {index + 1}.
            </span>
            <div className="home-product-modal__value-card">
              <div className="home-product-modal__value-title">
                <strong>{firstText(item.name) || 'Блюдо'}</strong>
                <span>
                  <b>
                    {scaledValue(productKcal(item), item.weight, mode, 'kcal')}
                  </b>{' '}
                  ккал
                </span>
              </div>
              <div className="home-product-modal__value-details">
                <p>
                  Состав:{' '}
                  {firstText(item.tmp_desc, item.marc_desc, item.text) || '-'}
                </p>
                <dl>
                  <div>
                    <dt>белки</dt>
                    <dd>
                      {scaledValue(
                        productProtein(item),
                        item.weight,
                        mode,
                        'macro'
                      )}{' '}
                      г
                    </dd>
                  </div>
                  <div>
                    <dt>жиры</dt>
                    <dd>
                      {scaledValue(
                        productFat(item),
                        item.weight,
                        mode,
                        'macro'
                      )}{' '}
                      г
                    </dd>
                  </div>
                  <div>
                    <dt>углеводы</dt>
                    <dd>
                      {scaledValue(
                        productCarbs(item),
                        item.weight,
                        mode,
                        'macro'
                      )}{' '}
                      г
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProductDetailsModal({
  product,
  count,
  onClose,
  onAdd,
  onQuantityChange,
}: ProductDetailsModalProps) {
  const [mediaMode, setMediaMode] = useState<'image' | 'value' | 'set'>(
    'image'
  );
  const isCompact = useMediaQuery(`(max-width: ${BREAKPOINTS.compactMax}px)`, {
    noSsr: true,
  });

  if (!product) {
    return null;
  }

  const rawItems = Array.isArray(product.raw?.items)
    ? (product.raw.items as Record<string, unknown>[])
    : [];
  const valueItems = rawItems.length
    ? rawItems
    : [(product.raw ?? product) as Record<string, unknown>];
  const hasInfo = valueItems.some(
    (item) =>
      productKcal(item) || firstText(item.tmp_desc, item.marc_desc, item.text)
  );
  const hasSetItems = rawItems.length > 1;
  const productImageKey = product.imageKey;
  const catId = Number(product.raw?.cat_id ?? product.info?.catId);
  const countPart = firstText(product.raw?.count_part, product.info?.countPart);
  const countPartNew = firstText(
    product.raw?.count_part_new,
    product.info?.countPartNew
  );
  const sizePizza = firstText(product.raw?.size_pizza, product.info?.sizePizza);
  const weight = firstText(product.raw?.weight, product.weight);
  const showPieces = ![5, 6, 7, 15].includes(catId);
  const piecesLabel = catId === 14 ? sizePizza : countPart;
  const piecesUnit = catId === 14 ? 'см*' : catId === 6 ? 'л' : 'шт.';
  const weightUnit = ['17', '237'].includes(product.id)
    ? 'шт.'
    : catId === 6
      ? 'л'
      : 'г';
  const weightNumber = numberValue(weight);
  const weightLabel = Number.isFinite(weightNumber)
    ? new Intl.NumberFormat('ru-RU').format(weightNumber)
    : weight;
  const compactReplacementOpen = isCompact && mediaMode !== 'image';

  return (
    <>
      <ModalWrapper
        open={Boolean(product)}
        onClose={() => {
          setMediaMode('image');
          onClose();
        }}
        className={cn(
          'home-product-modal',
          mediaMode !== 'image' && !isCompact && 'home-product-modal--info-open'
        )}
        paperClassName="home-product-modal__paper"
        contentClassName="home-product-modal__content"
        closeOutside
        closeOnBackdrop
        variant="responsive"
        labelledBy="home-product-modal-title"
      >
        <div
          className={cn(
            'home-product-modal__layout',
            mediaMode !== 'image' &&
              !isCompact &&
              'home-product-modal__layout--info'
          )}
          onClick={() => {
            if (mediaMode !== 'image' && !isCompact) {
              setMediaMode('image');
            }
          }}
        >
          <div className="home-product-modal__media">
            {mediaMode === 'value' && !isCompact ? (
              <ProductValueTable
                items={valueItems}
                className="home-product-modal__value--inline"
              />
            ) : mediaMode === 'set' && !isCompact ? (
              <ProductSetList
                items={rawItems}
                className="home-product-modal__set-list--inline"
              />
            ) : (
              <picture>
                {productImageKey ? (
                  <source
                    type="image/webp"
                    srcSet={resolveProductImageSrcSet(productImageKey, 'webp')}
                    sizes={PRODUCT_MODAL_IMAGE_SIZES}
                  />
                ) : null}
                {productImageKey ? (
                  <source
                    type="image/jpeg"
                    srcSet={resolveProductImageSrcSet(productImageKey, 'jpg')}
                    sizes={PRODUCT_MODAL_IMAGE_SIZES}
                  />
                ) : null}
                <img src={product.image} alt={product.title} loading="lazy" />
                {product.badges?.length ? (
                  <span className="home-product-modal__badges">
                    {product.badges.map((badge) => (
                      <Badge
                        key={badge.tone + (badge.label ?? '')}
                        tone={badge.tone}
                      >
                        {badge.label}
                      </Badge>
                    ))}
                  </span>
                ) : null}
              </picture>
            )}
          </div>

          <div className="home-product-modal__body">
            <div className="home-product-modal__heading">
              <h2 id="home-product-modal-title">{product.title}</h2>
            </div>
            <div className="home-product-modal__info">
              <div className="home-product-modal__facts">
                {hasSetItems && countPartNew ? (
                  <button
                    type="button"
                    className="home-product-modal__fact-link"
                    onClick={(event) => {
                      event.stopPropagation();
                      setMediaMode((value) =>
                        value === 'set' ? 'image' : 'set'
                      );
                    }}
                  >
                    {countPartNew}
                  </button>
                ) : null}
                {showPieces && piecesLabel ? (
                  <span>
                    {piecesLabel} {piecesUnit}
                  </span>
                ) : null}
                {weight ? (
                  <span>
                    {weightLabel} {weightUnit}
                  </span>
                ) : null}
              </div>

              {hasInfo ? (
                <button
                  className="home-product-modal__info-button"
                  type="button"
                  aria-expanded={mediaMode === 'value'}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMediaMode((value) =>
                      value === 'value' ? 'image' : 'value'
                    );
                  }}
                >
                  i
                </button>
              ) : null}
            </div>

            {product.detailText ? (
              <p className="home-product-modal__description">
                {product.detailText}
              </p>
            ) : null}

            <div className="home-product-modal__action">
              {count > 0 ? (
                <QuantityControl
                  value={count}
                  size="md"
                  onChange={onQuantityChange}
                />
              ) : (
                <Button
                  tone="neutral"
                  size="md"
                  density="regular"
                  onClick={onAdd}
                >
                  <Price
                    value={product.price}
                    oldValue={product.oldPrice}
                    size="sm"
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      </ModalWrapper>

      {isCompact ? (
        <ModalWrapper
          open={compactReplacementOpen}
          onClose={() => setMediaMode('image')}
          className="home-product-info-modal"
          paperClassName="home-product-info-modal__paper"
          contentClassName="home-product-info-modal__content"
          closeOutside
          closeOnBackdrop
          variant="responsive"
          labelledBy="home-product-info-modal-title"
        >
          {mediaMode === 'set' ? (
            <ProductSetList
              items={rawItems}
              className="home-product-modal__set-list--standalone"
            />
          ) : (
            <ProductValueTable
              items={valueItems}
              className="home-product-modal__value--standalone"
            />
          )}
        </ModalWrapper>
      ) : null}
    </>
  );
}
