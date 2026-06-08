'use client';

import Link from 'next/link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCartStore, formatCartLabel } from '@src/entities/cart';
import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { saveUserAction } from '@src/features/telemetry';
import { reachGoal } from '@src/shared/lib/analytics/metrika';
import { cityPath } from '@src/shared/lib/sitePaths';
import { BREAKPOINTS } from '@src/shared/ui/foundation/breakpoints';
import { BasketFooterMobile } from '@src/shared/ui/icons';
import './StickyCartWidget.scss';

export function StickyCartWidget() {
  const isCompact = useMediaQuery(`(max-width: ${BREAKPOINTS.compactMax}px)`, {
    noSsr: true,
  });
  const isCompactOrRegular = useMediaQuery(
    `(max-width: ${BREAKPOINTS.regularMax}px)`,
    {
      noSsr: true,
    }
  );

  const city = useCityStore((state) => state.slug);
  const activePage = useHeaderStore((state) => state.activePage);
  const openBasket = useHeaderStore((state) => state.openBasket);
  const setActiveBasket = useHeaderStore((state) => state.setActiveBasket);

  const items = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);
  const allPriceWithoutPromo = useCartStore(
    (state) => state.allPriceWithoutPromo
  );
  const itemsCount = useCartStore((state) => state.itemsCount);

  if (
    !isCompactOrRegular ||
    !city ||
    openBasket ||
    itemsCount < 1 ||
    activePage !== 'home'
  ) {
    return null;
  }

  const cartLabel = formatCartLabel(
    items,
    dopListCart,
    checkPromo,
    allPrice,
    allPriceWithoutPromo
  );

  const handleOpenBasket = () => {
    reachGoal('open_basket', undefined, city);
    void saveUserAction({ event: 'open_card', price: 0 });
    setActiveBasket(true);
  };

  if (isCompact) {
    return (
      <Link
        className="sticky-cart-widget"
        href={cityPath(city, 'cart')}
        onClick={() => {
          reachGoal('open_basket', undefined, city);
          void saveUserAction({ event: 'open_card', price: 0 });
        }}
      >
        <span className="sticky-cart-widget__icon" aria-hidden="true">
          <BasketFooterMobile />
        </span>
        <span className="sticky-cart-widget__label">{cartLabel}</span>
      </Link>
    );
  }

  return (
    <button
      className="sticky-cart-widget sticky-cart-widget--button"
      type="button"
      onClick={handleOpenBasket}
    >
      <span className="sticky-cart-widget__icon" aria-hidden="true">
        <BasketFooterMobile />
      </span>
      <span className="sticky-cart-widget__label">{cartLabel}</span>
    </button>
  );
}
