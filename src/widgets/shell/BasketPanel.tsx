'use client';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { Price, QuantityControl } from '@src/shared/ui';
import { useCartStore } from '@src/entities/cart';
import { useHeaderStore } from '@src/entities/header';
import {
  resolveProductImageUrl,
  isValidMediaKey,
} from '@src/shared/lib/mediaUrls';
import { cityPath } from '@src/shared/lib/sitePaths';
import { formatCartLabel } from '@src/features/header/model/formatCartLabel';
import { useBodyScrollLock } from '@src/shared/lib/overlay/useBodyScrollLock';
import './BasketPanel.scss';

const allergyText =
  'Блюда могут содержать ингредиенты, обладающие аллергенными свойствами. Если у вас есть аллергия на какой-либо продукт, пожалуйста, уточняйте состав в меню или на кассе. Обратите внимание, что мы не можем исключить или заменить ингредиенты, но с удовольствием поможем выбрать блюдо с подходящим составом.';

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

function lineImage(line: Record<string, unknown>): string | undefined {
  const image = line.img_app ?? line.img ?? line.image;
  if (!isValidMediaKey(image)) {
    return undefined;
  }
  const src = String(image);
  return src.startsWith('http')
    ? src
    : resolveProductImageUrl(src, '_138x138.jpg');
}

function normalizeDop(
  line: Record<string, unknown>,
  count = 0
): Record<string, unknown> {
  return {
    ...line,
    item_id: line.item_id ?? line.id,
    one_price: line.one_price ?? line.price,
    cat_id: line.cat_id ?? 7,
    count,
  };
}

function cartKind(
  items: Record<string, unknown>[],
  allItems: Record<string, unknown>[]
): 'rolls' | 'pizza' | 'all' {
  let rolls = 0;
  let pizza = 0;

  items.forEach((line) => {
    const id = lineId(line);
    const catalogItem = allItems.find((item) => String(item.id) === id);
    const catId = Number(catalogItem?.cat_id ?? line.cat_id ?? 0);
    const count = Number(line.count ?? 0);

    if (catId === 14) {
      pizza += count;
      return;
    }

    if (![5, 6, 7, 14].includes(catId)) {
      rolls += count;
    }
  });

  if (rolls > 0 && pizza === 0) {
    return 'rolls';
  }
  if (rolls === 0 && pizza > 0) {
    return 'pizza';
  }
  return 'all';
}

function buildDefaultExtras(
  needDops: unknown,
  items: Record<string, unknown>[],
  allItems: Record<string, unknown>[]
): Record<string, unknown>[] {
  const source = needDops as { rolls?: unknown[]; pizza?: unknown[] };
  const kind = cartKind(items, allItems);
  const base =
    kind === 'rolls'
      ? (source.rolls ?? [])
      : kind === 'pizza'
        ? (source.pizza ?? [])
        : [...(source.rolls ?? []), ...(source.pizza ?? [])];
  const dopsInCart = items
    .map((line) => allItems.find((item) => String(item.id) === lineId(line)))
    .filter(
      (item): item is Record<string, unknown> => Number(item?.cat_id ?? 0) === 7
    );
  const merged = [
    ...base,
    ...dopsInCart.filter(
      (dop) =>
        !base.some(
          (item) =>
            String((item as Record<string, unknown>).id) === String(dop.id)
        )
    ),
  ];

  return merged.map((item) => {
    const row = item as Record<string, unknown>;
    const cartLine = items.find((line) => lineId(line) === String(row.id));
    return normalizeDop(row, Number(cartLine?.count ?? 0));
  });
}

function positionWord(count: number): string {
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

const dopText = {
  rolls: 'Не забудьте про соусы, приправы и приборы',
  pizza: 'Попробуйте необычное сочетание пиццы и соуса',
  all: 'Не забудьте про соусы, приправы и приборы',
};

export function BasketPanel({ city }: { city: string }) {
  const compact = useMediaQuery('(max-width: 667px)');
  const open = useHeaderStore((state) => state.openBasket);
  const setActiveBasket = useHeaderStore((state) => state.setActiveBasket);

  const cartItems = useCartStore((state) => state.items);
  const items = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const needDops = useCartStore((state) => state.needDops);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);
  const setCount = useCartStore((state) => state.setCount);
  const allItems = useCartStore((state) => state.allItems);

  const defaultExtras = buildDefaultExtras(
    needDops,
    cartItems as Record<string, unknown>[],
    allItems as Record<string, unknown>[]
  );
  const extraItems = defaultExtras.length ? defaultExtras : dopListCart;
  const extraKind = cartKind(
    cartItems as Record<string, unknown>[],
    allItems as Record<string, unknown>[]
  );
  const label = formatCartLabel(items, extraItems, checkPromo, allPrice);
  const itemsCount = items.reduce(
    (sum, line) => sum + Number(line.count ?? 0),
    0
  );
  const cartHref = cityPath(city, 'cart');
  useBodyScrollLock(open);

  const content = (
    <div className="basket-panel">
      <div className="basket-panel__list">
        <Accordion
          className="basket-panel__notice"
          disableGutters
          elevation={0}
        >
          <AccordionSummary
            className="basket-panel__notice-summary"
            expandIcon={<ExpandMoreIcon />}
            sx={{ fontSize: '1.2dvw' }}
          >
            Об аллергенах
          </AccordionSummary>
          <AccordionDetails className="basket-panel__notice-details">
            {allergyText}
          </AccordionDetails>
        </Accordion>
        {items.map((line, index) => {
          const id = lineId(line);
          const count = Number(line.count ?? 0);
          const image = lineImage(line);
          const catalogItem = allItems.find((item) => String(item.id) === id);
          const price = Number(line.one_price ?? catalogItem?.price ?? 0);
          return (
            <article className="basket-panel__item" key={id + '-' + index}>
              {image ? <img src={image} alt="" /> : null}
              <div className="basket-panel__item-copy">
                <h3>{lineTitle(line, catalogItem)}</h3>
                <Price value={price * count} size="sm" />
              </div>
              <QuantityControl
                className="basket-panel__extra-quantity"
                value={count}
                size="xs"
                onChange={(value) => setCount(id, value, Number(line?.cat_id))}
              />
            </article>
          );
        })}

        {extraItems.length ? (
          <section className="basket-panel__extras" aria-label="Дополнительно">
            <h3>{dopText[extraKind]}</h3>
            {extraItems.map((line, index) => {
              const id = lineId(line);
              const count = Number(line.count ?? 0);
              const price = Number(line.one_price ?? line.price ?? 0);
              const image = lineImage(line);
              return (
                <article className="basket-panel__extra" key={id + '-' + index}>
                  {image ? <img src={image} alt="" /> : null}
                  <div className="basket-panel__extra-copy">
                    <h4>{lineTitle(line)}</h4>
                    <Price value={price} size="sm" />
                  </div>
                  <QuantityControl
                    className="basket-panel__extra-quantity"
                    value={count}
                    size="xs"
                    onChange={(value) =>
                      setCount(id, value, Number(line?.cat_id))
                    }
                  />
                </article>
              );
            })}
          </section>
        ) : null}
      </div>

      <div className="basket-panel__footer">
        <div className="basket-panel__total">
          <span>{`Итого: ${itemsCount} ${positionWord(itemsCount)}`}</span>
          <strong>{label}</strong>
        </div>
        <input
          className="basket-panel__promo"
          type="text"
          placeholder="Есть промокод"
          aria-label="Промокод"
        />
        <Link
          className="ui-button ui-button--tone-primary ui-button--size-lg ui-button--density-regular basket-panel__order"
          href={cartHref}
          onClick={() => setActiveBasket(false)}
        >
          <span className="ui-button__label">Сделать заказ</span>
        </Link>
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

  if (!open) {
    return null;
  }

  return (
    <div
      className="basket-panel-sidebar"
      role="dialog"
      aria-modal="true"
      aria-label="Корзина"
    >
      <button
        className="basket-panel-sidebar__backdrop"
        type="button"
        aria-label="Закрыть корзину"
        onClick={() => setActiveBasket(false)}
      />
      <div className="basket-panel-sidebar__sheet">{content}</div>
    </div>
  );
}
