'use client';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCompactLayout } from '@src/shared/lib/viewport';
import Link from 'next/link';
import { Price, QuantityControl } from '@src/shared/ui';
import {
  formatCartLabel,
  formatCartTotalLine,
  getCartExtrasIntroText,
  useCartStore,
} from '@src/entities/cart';
import { useHeaderStore } from '@src/entities/header';
import {
  resolveProductImageUrl,
  isValidMediaKey,
} from '@src/shared/lib/mediaUrls';
import { cityPath } from '@src/shared/lib/sitePaths';
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

export function BasketPanel({ city }: { city: string }) {
  const compact = useCompactLayout();
  const open = useHeaderStore((state) => state.openBasket);
  const setActiveBasket = useHeaderStore((state) => state.setActiveBasket);

  const items = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const cartIntroKind = useCartStore((state) => state.cartIntroKind);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);
  const allPriceWithoutPromo = useCartStore(
    (state) => state.allPriceWithoutPromo
  );
  const itemsCount = useCartStore((state) => state.itemsCount);
  const setCount = useCartStore((state) => state.setCount);
  const allItems = useCartStore((state) => state.allItems);

  const label = formatCartLabel(
    items,
    dopListCart,
    checkPromo,
    allPrice,
    allPriceWithoutPromo
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

        {dopListCart.length ? (
          <section className="basket-panel__extras" aria-label="Дополнительно">
            <h3>{getCartExtrasIntroText(cartIntroKind)}</h3>
            {dopListCart.map((line, index) => {
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
        <div className="basket-panel__footer">
          <div className="basket-panel__total">
            <span>{formatCartTotalLine(itemsCount)}</span>
            <strong>{label}</strong>
          </div>
          <input
            className="basket-panel__promo"
            type="text"
            placeholder="Есть промокод"
            aria-label="Промокод"
          />
          <Link
            className="ui-button ui-button--tone-primary ui-button--size-lg ui-button--range-regular basket-panel__order"
            href={cartHref}
            onClick={() => setActiveBasket(false)}
          >
            <span className="ui-button__label">Оформить заказ</span>
          </Link>
        </div>
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
