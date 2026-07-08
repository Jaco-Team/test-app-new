import React, { useRef } from 'react';

import { getItemImageUrl } from '@/utils/itemImage';

function getRecommendationMetaItems(item) {
  const catId = parseInt(item?.cat_id);
  const itemId = parseInt(item?.id ?? item?.item_id);
  const metaItems = [];
  const countPartNew = String(item?.count_part_new ?? '').trim();
  const countPart = String(item?.count_part ?? '').trim();
  const sizePizza = String(item?.size_pizza ?? '').trim();
  const weight = item?.weight;
  const hasHiddenSize = [5, 6, 7, 15].includes(catId);

  if (countPartNew && countPartNew !== countPart) {
    metaItems.push(countPartNew);
  }

  if (!hasHiddenSize) {
    const sizeValue = catId === 14 ? sizePizza : countPart;

    if (sizeValue) {
      metaItems.push(`${sizeValue} ${catId === 14 ? 'см' : 'шт.'}`);
    }
  }

  if (weight) {
    const weightUnit =
      itemId === 17 || itemId === 237 ? 'шт.' : catId === 6 ? 'л' : 'г';

    metaItems.push(
      `${new Intl.NumberFormat('ru-RU').format(weight)} ${weightUnit}`
    );
  }

  return metaItems;
}

export default function RecommendationMobileList({
  recommendations = [],
  limit = 3,
  title = 'Добавим к заказу?',
  onSelect,
  onOpen,
  onAdd,
  onRemove,
  getCount,
}) {
  const dragStateRef = useRef({
    active: false,
    dragging: false,
    pointerId: null,
    startX: 0,
    lastX: 0,
    scrollLeft: 0,
  });
  const suppressClickUntilRef = useRef(0);
  const list = Array.isArray(recommendations)
    ? recommendations.slice(0, limit)
    : [];

  if (!list.length) {
    return null;
  }

  const suppressClicksFor = (event, delay) => {
    suppressClickUntilRef.current = event.timeStamp + delay;
  };

  const handleKeyDown = (event, recommendation, position) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRecommendationOpen(event, recommendation, position);
    }
  };

  const stopListDrag = (listNode, shouldReleasePointer = true) => {
    const dragState = dragStateRef.current;

    if (
      shouldReleasePointer &&
      dragState.pointerId !== null &&
      listNode.hasPointerCapture?.(dragState.pointerId)
    ) {
      listNode.releasePointerCapture?.(dragState.pointerId);
    }

    listNode.classList.remove('RecommendationModalCardMobileListDragging');

    dragStateRef.current = {
      active: false,
      dragging: false,
      pointerId: null,
      startX: 0,
      lastX: 0,
      scrollLeft: 0,
    };
  };

  const handleListPointerDown = (event) => {
    const listNode = event.currentTarget;
    const isInteractiveTarget = Boolean(
      event.target?.closest?.(
        '.RecommendationModalCardMobilePrice, .RecommendationModalCardMobileCounter, button'
      )
    );

    if (
      isInteractiveTarget ||
      (event.button !== undefined && event.button !== 0) ||
      listNode.scrollWidth <= listNode.clientWidth
    ) {
      return;
    }

    dragStateRef.current = {
      active: true,
      dragging: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      scrollLeft: listNode.scrollLeft,
    };
  };

  const handleListPointerMove = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.active) {
      return;
    }

    const listNode = event.currentTarget;
    const deltaX = event.clientX - dragState.startX;
    dragState.lastX = event.clientX;

    if (Math.abs(deltaX) < 8 && !dragState.dragging) {
      return;
    }

    if (!dragState.dragging) {
      listNode.setPointerCapture?.(event.pointerId);
    }

    dragState.dragging = true;
    suppressClicksFor(event, 350);
    listNode.classList.add('RecommendationModalCardMobileListDragging');
    event.preventDefault();
    listNode.scrollLeft = dragState.scrollLeft - deltaX;
  };

  const handleListPointerUp = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.active) {
      return;
    }

    const totalDeltaX = Math.abs(
      (dragState.lastX || event.clientX) - dragState.startX
    );
    const wasDragging = dragState.dragging || totalDeltaX > 8;

    stopListDrag(event.currentTarget);

    if (wasDragging) {
      suppressClicksFor(event, 350);
    }
  };

  const handleListLostPointerCapture = (event) => {
    stopListDrag(event.currentTarget, false);
  };

  const handleListScroll = (event) => {
    suppressClicksFor(event, 250);
  };

  const shouldSuppressClick = (event) => {
    if (event.timeStamp < suppressClickUntilRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }

    return false;
  };

  const handleRecommendationOpen = (event, recommendation, position) => {
    if (shouldSuppressClick(event)) {
      return;
    }

    (onOpen || onSelect)?.(recommendation, event, position);
  };

  const handleRecommendationAdd = (event, recommendation, position) => {
    event.preventDefault();
    event.stopPropagation();

    if (shouldSuppressClick(event)) {
      return;
    }

    (onAdd || onSelect || onOpen)?.(recommendation, event, position);
  };

  const handleRecommendationRemove = (event, recommendation, position) => {
    event.preventDefault();
    event.stopPropagation();

    if (shouldSuppressClick(event)) {
      return;
    }

    onRemove?.(recommendation, event, position);
  };

  const preventNativeDrag = (event) => {
    event.preventDefault();
  };

  return (
    <div className="RecommendationModalCardMobile">
      <div className="RecommendationModalCardMobileTitle">{title}</div>

      <div
        className="RecommendationModalCardMobileList"
        onPointerDown={handleListPointerDown}
        onPointerMove={handleListPointerMove}
        onPointerUp={handleListPointerUp}
        onPointerCancel={handleListPointerUp}
        onLostPointerCapture={handleListLostPointerCapture}
        onScroll={handleListScroll}
        onDragStart={preventNativeDrag}
      >
        {list.map((recommendation, index) => {
          const recommendationId =
            recommendation?.item_id ?? recommendation?.id;
          const recommendationImage = recommendation?.img_app;
          const recommendationName = recommendation?.name ?? '';
          const recommendationPrice =
            recommendation?.one_price ?? recommendation?.price;
          const recommendationPriceValue = Number(recommendationPrice);
          const recommendationPriceText = Number.isFinite(
            recommendationPriceValue
          )
            ? new Intl.NumberFormat('ru-RU').format(recommendationPriceValue)
            : '';
          const recommendationMetaItems =
            getRecommendationMetaItems(recommendation);
          const position = index + 1;

          return (
            <div
              className="RecommendationModalCardMobileItem"
              key={recommendationId ?? index}
              role="button"
              tabIndex={0}
              onClick={(event) =>
                handleRecommendationOpen(event, recommendation, position)
              }
              onKeyDown={(event) =>
                handleKeyDown(event, recommendation, position)
              }
              onDragStart={preventNativeDrag}
            >
              <div className="RecommendationModalCardMobileImage">
                <img
                  alt={recommendationName || 'Рекомендованное блюдо'}
                  src={getItemImageUrl(recommendationImage, '292x292', 'jpg')}
                  loading="lazy"
                  draggable={false}
                />
              </div>

              <div className="RecommendationModalCardMobileInfo">
                <div className="RecommendationModalCardMobileName">
                  <span>{recommendationName}</span>
                </div>

                <div className="RecommendationModalCardMobileMeta">
                  {recommendationMetaItems.map((metaItem, metaIndex) => (
                    <React.Fragment key={`${metaItem}-${metaIndex}`}>
                      {metaIndex > 0 ? (
                        <span className="RecommendationModalCardMobileDivider">
                          |
                        </span>
                      ) : null}

                      <span>{metaItem}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {Number(getCount?.(recommendation) ?? 0) > 0 ? (
                <div
                  className="RecommendationModalCardMobileCounter"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    className="RecommendationModalCardMobileCounterButton"
                    type="button"
                    onClick={(event) =>
                      handleRecommendationRemove(
                        event,
                        recommendation,
                        position
                      )
                    }
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    –
                  </button>

                  <span className="RecommendationModalCardMobileCounterValue">
                    {Number(getCount?.(recommendation) ?? 0)}
                  </span>

                  <button
                    className="RecommendationModalCardMobileCounterButton"
                    type="button"
                    onClick={(event) =>
                      handleRecommendationAdd(event, recommendation, position)
                    }
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="RecommendationModalCardMobilePrice"
                  type="button"
                  onClick={(event) =>
                    handleRecommendationAdd(event, recommendation, position)
                  }
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  {recommendationPriceText
                    ? `${recommendationPriceText} ₽`
                    : ''}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
