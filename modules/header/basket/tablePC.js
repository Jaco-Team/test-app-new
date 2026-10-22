import { useEffect, useMemo } from 'react';

import {
  useCartStore,
  useCitiesStore,
  useHeaderStoreNew,
  useHomeStore,
} from '@/components/store.js';

import RowPC from './rowPC';
import RecommendationMobileList from '@/modules/recommendations/recommendationMobileList';
import { notifyRecommendationAdded } from '@/utils/recommendationFeedback';
import { getCartExtraGroups, getExtraCount, getExtraItemId } from '@/utils/cartExtras';

export default function TablePC() {
  const [
    items,
    itemsCount,
    itemsOffDops,
    dopListCart,
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

  const [allItems, plus, minus] = useCartStore((state) => [
    state.allItems,
    state.plus,
    state.minus,
  ]);
  const cartExtraGroups = useMemo(
    () => getCartExtraGroups(dopListCart, items, allItems, itemsOffDops),
    [dopListCart, items, allItems, itemsOffDops, itemsCount, cartUpdatedAt]
  );
  const getSauceCount = (item) => getExtraCount(items, getExtraItemId(item));
  const addSauce = (item) => {
    const id = getExtraItemId(item);
    const before = getExtraCount(useCartStore.getState().items, id);
    plus(id);
    if (getExtraCount(useCartStore.getState().items, id) > before) {
      notifyRecommendationAdded();
    }
  };
  const removeSauce = (item) => minus(getExtraItemId(item));
  const openSauce = (item) => {
    const id = getExtraItemId(item);
    setActiveBasket?.(false);
    getItem?.('home', thisCity, id, null, { forgetCurrentItem: true });
  };

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

          return !cartRecommendationIds.has(String(recommendationId)) &&
            !cartExtraGroups.ids.has(Number(recommendationId));
        }
      ),
    [cartRecommendations, cartRecommendationIds, cartExtraGroups]
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
  let price2 = [...cartExtraGroups.utensils, ...cartExtraGroups.sauces].reduce(
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

      {cartExtraGroups.utensils.length ? (
        <table className="TableMini TableMiniDops">
          <tbody>
            <tr className="dopText CartExtrasHeading">
              <th colSpan={2}>Не забудьте про приборы</th>
            </tr>
            {cartExtraGroups.utensils.map((item) => (
              <RowPC key={item.item_id} count={item.count} item={item} last="" />
            ))}
          </tbody>
        </table>
      ) : null}

      {cartExtraGroups.sauces.length ? (
        <div className="basketRecommendations">
          <RecommendationMobileList
            recommendations={cartExtraGroups.sauces}
            limit={cartExtraGroups.sauces.length}
            title="Добавим соусы и приправы?"
            variant="cart"
            requiresRecommendationsEnabled={false}
            onOpen={openSauce}
            onAdd={addSauce}
            onRemove={removeSauce}
            getCount={getSauceCount}
          />
        </div>
      ) : null}

      {visibleCartRecommendations.length ? (
        <div className="basketRecommendations">
          <RecommendationMobileList
            recommendations={visibleCartRecommendations}
            limit={5}
            title="Подобрали для вас"
            variant="cart"
            onOpen={openCartRecommendation}
            onAdd={addCartRecommendation}
          />
        </div>
      ) : null}

      <table className="TableMini TableMiniDops">
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
