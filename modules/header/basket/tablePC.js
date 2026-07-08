import { useEffect, useMemo } from 'react';

import {
  useCartStore,
  useCitiesStore,
  useHeaderStoreNew,
  useHomeStore,
} from '@/components/store.js';

import RowPC from './rowPC';
import RecommendationMobileList from '@/modules/recommendations/recommendationMobileList';

const dopText = {
  rolly: 'Не забудьте про соусы, приправы и приборы',
  pizza: 'Попробуйте необычное сочетание пиццы и соуса',
  all: 'Не забудьте про соусы, приправы и приборы',
};

export default function TablePC() {
  const [
    items,
    itemsCount,
    itemsOffDops,
    dopListCart,
    cart_is,
    checkPromo,
    cartUpdatedAt,
    getCartRecommendations,
    cartRecommendations,
    cartRecommendationsRecUuid,
    addRecommendationToCart,
    trackRecommendationAction,
  ] = useCartStore((state) => [
    state.items,
    state.itemsCount,
    state.itemsOffDops,
    state.dopListCart,
    state.cart_is,
    state.checkPromo,
    state.cartUpdatedAt,
    state.getCartRecommendations,
    state.cartRecommendations,
    state.cartRecommendationsRecUuid,
    state.addRecommendationToCart,
    state.trackRecommendationAction,
  ]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  const [openBasket, setActiveBasket] = useHeaderStoreNew((state) => [
    state?.openBasket,
    state?.setActiveBasket,
  ]);
  const [getItem] = useHomeStore((state) => [state.getItem]);

  const cartRecommendationKey = useMemo(
    () =>
      (items || [])
        .filter((item) => Number(item?.count ?? 0) > 0)
        .map((item) => `${item?.item_id ?? item?.id}:${item?.count ?? 0}`)
        .sort()
        .join(','),
    [items, itemsCount, cartUpdatedAt]
  );
  const cartRecommendationIds = useMemo(
    () =>
      new Set(
        (items || [])
          .filter((item) => Number(item?.count ?? 0) > 0)
          .map((item) => String(item?.item_id ?? item?.id))
      ),
    [items, itemsCount, cartUpdatedAt]
  );
  const visibleCartRecommendations = useMemo(
    () =>
      (Array.isArray(cartRecommendations) ? cartRecommendations : []).filter(
        (recommendation) => {
          const recommendationId =
            recommendation?.item_id ?? recommendation?.id;

          return !cartRecommendationIds.has(String(recommendationId));
        }
      ),
    [cartRecommendations, cartRecommendationIds]
  );

  useEffect(() => {
    if (
      !openBasket ||
      !thisCity ||
      typeof getCartRecommendations !== 'function'
    ) {
      return;
    }

    getCartRecommendations(thisCity);
  }, [openBasket, thisCity, cartRecommendationKey, getCartRecommendations]);

  const addCartRecommendation = (recommendation, event, position) => {
    addRecommendationToCart?.(recommendation, {
      city: thisCity,
      recUuid: cartRecommendationsRecUuid,
      surface: 'cart_upsell',
      position,
    });
  };

  const openCartRecommendation = (recommendation, event, position) => {
    const recommendationId = recommendation?.item_id ?? recommendation?.id;

    if (!recommendationId) {
      return;
    }

    setActiveBasket?.(false);
    trackRecommendationAction?.({
      city: thisCity,
      itemId: recommendationId,
      recUuid: cartRecommendationsRecUuid,
      action: 'opened',
      surface: 'cart_upsell',
      position,
    });

    getItem?.('home', thisCity, recommendationId, null, {
      forgetCurrentItem: true,
    });
  };

  function getWord(int, array) {
    return (
      (array = array || ['позиция', 'позиции', 'позиций']) &&
      array[
        int % 100 > 4 && int % 100 < 20
          ? 2
          : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]
      ]
    );
  }

  let price1 = itemsOffDops.reduce(
    (all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price),
    0
  );
  let price2 = dopListCart.reduce(
    (all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price),
    0
  );

  return (
    <>
      <table className="TableMini TableMiniMain">
        <tbody>
          {(itemsOffDops ?? []).map((item, idx, arr) => (
            <RowPC
              key={idx}
              count={item?.count ?? 0}
              item={item}
              last={idx === arr.length - 1 ? 'last' : ''}
            />
          ))}
        </tbody>
      </table>

      {visibleCartRecommendations.length ? (
        <div className="basketRecommendations">
          <RecommendationMobileList
            recommendations={visibleCartRecommendations}
            limit={5}
            onOpen={openCartRecommendation}
            onAdd={addCartRecommendation}
          />
        </div>
      ) : null}

      <table className="TableMini TableMiniDops">
        <tbody>
          {dopListCart.length ? (
            <>
              <tr className="dopText">
                <th>{dopText[cart_is]}</th>
              </tr>

              {dopListCart.map((item, key) => (
                <RowPC key={key} count={item.count} item={item} last="" />
              ))}
            </>
          ) : null}
        </tbody>

        <tfoot>
          <tr>
            <td>
              Итого: {itemsCount} {getWord(itemsCount)}
            </td>
            <td>
              {/* <div className={promoInfo?.items_on_price?.length ? promoItemsFind ? 'promoInfo' : null : promoInfo?.status_promo && itemsOffDops.length ? 'promoInfo' : null}> */}
              <div
                className={
                  checkPromo
                    ? checkPromo.st && itemsOffDops.length
                      ? 'promoInfo'
                      : null
                    : null
                }
              >
                {new Intl.NumberFormat('ru-RU').format(
                  parseInt(price1) + parseInt(price2)
                )}{' '}
                ₽
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
