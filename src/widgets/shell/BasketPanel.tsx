'use client';

import Popover from '@mui/material/Popover';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { Price, QuantityControl } from '@src/shared/ui';
import { useCartStore } from '@src/entities/cart';
import { useHeaderStore } from '@src/entities/header';
import { cityPath } from '@src/shared/lib/sitePaths';
import { formatCartLabel } from '@src/features/header/model/formatCartLabel';
import './BasketPanel.scss';

const allergyText =
  'Блюда могут содержать ингредиенты с аллергенными свойствами. Если у вас есть аллергия, уточните состав перед заказом.';

function lineTitle(
  line: Record<string, unknown>,
  catalogItem?: Record<string, unknown>
): string {
  return String(
    line.name ?? line.item_name ?? line.title ?? catalogItem?.name ?? 'Товар'
  );
}

function lineId(line: Record<string, unknown>): string {
  return String(line.item_id ?? line.id ?? '');
}

export function BasketPanel({ city }: { city: string }) {
  const compact = useMediaQuery('(max-width: 667px)');
  const open = useHeaderStore((state) => state.openBasket);
  const anchor = useHeaderStore((state) => state.targetBasket);
  const setActiveBasket = useHeaderStore((state) => state.setActiveBasket);

  const items = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);
  const setCount = useCartStore((state) => state.setCount);
  const allItems = useCartStore((state) => state.allItems);

  const label = formatCartLabel(items, dopListCart, checkPromo, allPrice);
  const cartHref = cityPath(city, 'cart');

  const content = (
    <div className="basket-panel">
      <div className="basket-panel__head">
        <h2>Корзина</h2>
        <button type="button" onClick={() => setActiveBasket(false)}>
          Закрыть
        </button>
      </div>

      <details className="basket-panel__notice">
        <summary>Об аллергенах</summary>
        <p>{allergyText}</p>
      </details>

      {items.length ? (
        <div className="basket-panel__list">
          {items.map((line, index) => {
            const id = lineId(line);
            const count = Number(line.count ?? 0);
            const catalogItem = allItems.find((item) => String(item.id) === id);
            const price = Number(line.one_price ?? catalogItem?.price ?? 0);
            return (
              <article className="basket-panel__item" key={id + '-' + index}>
                <div className="basket-panel__item-copy">
                  <h3>{lineTitle(line, catalogItem)}</h3>
                  <Price value={price * count} size="sm" />
                </div>
                <QuantityControl
                  value={count}
                  onChange={(value) => setCount(id, value, line.cat_id)}
                />
              </article>
            );
          })}
        </div>
      ) : (
        <div className="basket-panel__empty">
          <h3>Пока пусто</h3>
          <p>Добавьте блюда из меню, и они появятся здесь.</p>
        </div>
      )}

      <div className="basket-panel__footer">
        <div className="basket-panel__total">
          <span>Итого</span>
          <strong>{label}</strong>
        </div>
        {items.length ? (
          <Link
            className="ui-button ui-button--tone-primary ui-button--size-lg ui-button--density-regular"
            href={cartHref}
            onClick={() => setActiveBasket(false)}
          >
            <span className="ui-button__label">Оформить заказ</span>
          </Link>
        ) : (
          <button
            className="ui-button ui-button--tone-primary ui-button--size-lg ui-button--density-regular"
            type="button"
            disabled
          >
            <span className="ui-button__label">Оформить заказ</span>
          </button>
        )}
      </div>
    </div>
  );

  if (compact && open) {
    return (
      <div
        className="basket-panel-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
      >
        <button
          className="basket-panel-drawer__backdrop"
          type="button"
          aria-label="Закрыть корзину"
          onClick={() => setActiveBasket(false)}
        />
        <div className="basket-panel-drawer__sheet">{content}</div>
      </div>
    );
  }

  return (
    <Popover
      open={open}
      anchorEl={anchor}
      onClose={() => setActiveBasket(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      marginThreshold={12}
      slotProps={{ paper: { className: 'basket-panel-popover' } }}
    >
      {content}
    </Popover>
  );
}
