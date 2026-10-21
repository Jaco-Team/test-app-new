import React, { useRef } from 'react';

import { getItemImageSrcSet, getItemImageUrl } from '@/utils/itemImage';
import { isRecommendationsEnabled } from '@/utils/recommendations';

function getRecommendationImageSrcSet(imageName, format) {
  return getItemImageSrcSet(imageName, format, 'thumbnail');
}

export default function RecommendationMobileList({
  recommendations = [],
  limit = 3,
  title = 'С этим блюдом заказывают',
  variant = 'product',
  requiresRecommendationsEnabled = true,
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
    startY: 0,
    lastX: 0,
    lastY: 0,
    scrollLeft: 0,
  });
  const suppressClickUntilRef = useRef(0);
  const list = Array.isArray(recommendations)
    ? recommendations.slice(0, limit)
    : [];

  if (
    (requiresRecommendationsEnabled && !isRecommendationsEnabled()) ||
    !list.length
  ) {
    return null;
  }

  const suppressClicksFor = (event, delay) => {
    suppressClickUntilRef.current = event.timeStamp + delay;
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
      startY: 0,
      lastX: 0,
      lastY: 0,
      scrollLeft: 0,
    };
  };

  const handleListPointerDown = (event) => {
    const listNode = event.currentTarget;
    const isInteractiveTarget = Boolean(
      event.target?.closest?.(
        '.RecommendationModalCardMobilePrice, .RecommendationModalCardMobileCounter'
      )
    );

    if (
      isInteractiveTarget ||
      event.isPrimary === false ||
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
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      scrollLeft: listNode.scrollLeft,
    };
  };

  const handleListPointerMove = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    const listNode = event.currentTarget;
    const deltaX = event.clientX - dragState.startX;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;

    // На сенсорном экране браузер сам прокручивает ленту и страницу.
    if (event.pointerType === 'touch') {
      return;
    }

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

    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    const totalDeltaX = Math.abs(dragState.lastX - dragState.startX);
    const totalDeltaY = Math.abs(dragState.lastY - dragState.startY);
    const wasDragging =
      dragState.dragging || totalDeltaX > 8 || totalDeltaY > 8;

    stopListDrag(event.currentTarget);

    if (wasDragging) {
      suppressClicksFor(event, 350);
    }
  };

  const handleListPointerLeave = (event) => {
    if (dragStateRef.current.active && !dragStateRef.current.dragging) {
      stopListDrag(event.currentTarget);
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
    <div
      className="RecommendationModalCardMobile"
      data-recommendation-variant={variant === 'cart' ? 'cart' : 'product'}
    >
      <div className="RecommendationModalCardMobileTitle" role="heading" aria-level={3}>
        {title}
      </div>

      <div
        className="RecommendationModalCardMobileList"
        onPointerDown={handleListPointerDown}
        onPointerMove={handleListPointerMove}
        onPointerUp={handleListPointerUp}
        onPointerCancel={handleListPointerUp}
        onPointerLeave={handleListPointerLeave}
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
          const recommendationCount = Math.max(
            0, Number(getCount?.(recommendation) ?? 0) || 0
          );
          const isSelected = recommendationCount > 0;
          const position = index + 1;

          return (
            <div
              className={`RecommendationModalCardMobileItem${isSelected ? ' RecommendationModalCardMobileItemSelected' : ''}`}
              data-selected={isSelected}
              aria-label={`Блюдо «${recommendationName}»${isSelected ? `, в корзине: ${recommendationCount}` : ''}`}
              key={recommendationId ?? index}
              role="group"
              onDragStart={preventNativeDrag}
            >
              <button
                className="RecommendationModalCardMobileOpen"
                type="button"
                aria-label={`Открыть блюдо «${recommendationName}»`}
                onClick={(event) =>
                  handleRecommendationOpen(event, recommendation, position)
                }
              >
                <span className="RecommendationModalCardMobileImage">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={getRecommendationImageSrcSet(
                        recommendationImage,
                        'webp'
                      )}
                      sizes="(max-width: 667px) 116px, (max-width: 990px) 112px, 111px"
                    />
                    <source
                      type="image/jpeg"
                      srcSet={getRecommendationImageSrcSet(
                        recommendationImage,
                        'jpg'
                      )}
                      sizes="(max-width: 667px) 116px, (max-width: 990px) 112px, 111px"
                    />
                    <img
                      alt={recommendationName || 'Рекомендованное блюдо'}
                      src={getItemImageUrl(recommendationImage, '366x366', 'jpg')}
                      width={116}
                      height={116}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </picture>
                </span>

                <span className="RecommendationModalCardMobileInfo">
                  <span className="RecommendationModalCardMobileName">
                    <span>{recommendationName}</span>
                  </span>
                </span>
              </button>

              {isSelected ? (
                <div
                  className="RecommendationModalCardMobileCounter"
                  role="group"
                  aria-label={`Количество блюда «${recommendationName}» в корзине`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    className="RecommendationModalCardMobileCounterButton"
                    type="button"
                    aria-label={`Уменьшить количество «${recommendationName}»`}
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

                  <span className="RecommendationModalCardMobileCounterValue" aria-live="polite">
                    {recommendationCount}
                  </span>

                  <button
                    className="RecommendationModalCardMobileCounterButton"
                    type="button"
                    aria-label={`Добавить «${recommendationName}» в корзину`}
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
                  aria-label={`Добавить «${recommendationName}» в корзину${recommendationPriceText ? ` за ${recommendationPriceText} ₽` : ''}`}
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
