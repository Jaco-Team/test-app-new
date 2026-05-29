'use client';

import { formatCartLabel, useCartStore } from '@src/entities/cart';
import { useCityStore } from '@src/entities/city';
import { cityBase } from '@src/shared/lib/sitePaths';
import './CartPage.scss';

export function CartPage() {
  const citySlug = useCityStore((state) => state.slug);
  const cityLabel = useCityStore((state) => state.labelRu);
  const items = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);
  const allPriceWithoutPromo = useCartStore(
    (state) => state.allPriceWithoutPromo
  );

  const totalLabel = formatCartLabel(
    items,
    dopListCart,
    checkPromo,
    allPrice,
    allPriceWithoutPromo
  );

  return (
    <div className="cart-page">
      <div className="cart-page__inner">
        <a className="cart-page__back" href={cityBase(citySlug)}>
          ← {cityLabel}
        </a>
        <h1 className="cart-page__title">Корзина</h1>
        <p className="cart-page__total">{totalLabel}</p>

        <ul className="cart-page__list">
          {items.map((line, index) => (
            <li key={`${line.item_id}-${index}`} className="cart-page__item">
              <span>{String((line as { name?: string }).name ?? 'Товар')}</span>
              <span>
                {String(line.count ?? 1)} × {String(line.one_price ?? 0)} ₽
              </span>
            </li>
          ))}
        </ul>

        {items.length === 0 ? (
          <p className="cart-page__empty">Корзина пуста</p>
        ) : null}
      </div>
    </div>
  );
}
