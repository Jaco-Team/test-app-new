import { describe, expect, it } from 'vitest';

import {
  isOrderReviewEligible,
  normalizeOrderReviewOrder,
} from '@/modules/clientFeedback/clientFeedbackEligibility';
import { createClientFeedbackRequestGuard } from '@/modules/clientFeedback/clientFeedbackRequestGuard';
import {
  buildOrderReviewResponses,
  isOrderReviewElementVisible,
  orderReviewAnswerKey,
  validateOrderReview,
} from '@/modules/clientFeedback/orderReview/model/orderReview';
import { orderReviewFixture } from '@/stories/features/order-review/model/fixtures';

describe('order review model', () => {
  it('shows the entry point only for exact numeric completed and active state', () => {
    const order = {
      status_order: 6,
      is_delete: 0,
      point_id: 7,
      order_id: 44127,
    };

    expect(isOrderReviewEligible(order)).toBe(true);
    expect(
      isOrderReviewEligible({
        status_order: ' 6 ',
        is_delete: '0',
        point_id: '7',
        order_id: '44127',
      })
    ).toBe(true);
    expect(
      normalizeOrderReviewOrder({
        status_order: ' 6 ',
        is_delete: '0',
        point_id: '7',
        order_id: '44127',
      })
    ).toMatchObject({
      status_order: 6,
      is_delete: 0,
      point_id: 7,
      order_id: 44127,
    });
    expect(isOrderReviewEligible({ ...order, status_order: 5 })).toBe(false);
    expect(isOrderReviewEligible({ ...order, is_delete: 1 })).toBe(false);
    expect(isOrderReviewEligible({ ...order, order_id: undefined })).toBe(
      false
    );
    expect(isOrderReviewEligible({ ...order, point_id: 0 })).toBe(false);
    expect(isOrderReviewEligible({ ...order, status_order: '6x' })).toBe(false);
    expect(isOrderReviewEligible({ ...order, is_delete: '0.0' })).toBe(false);
    expect(isOrderReviewEligible({ ...order, point_id: '7point' })).toBe(false);
    expect(isOrderReviewEligible({ ...order, order_id: '-1' })).toBe(false);
    expect(isOrderReviewEligible({ ...order, order_id: '0' })).toBe(false);
    expect(isOrderReviewEligible({ ...order, point_id: 7.5 })).toBe(false);
  });

  it('rejects stale responses and locks concurrent submits', () => {
    const guard = createClientFeedbackRequestGuard();
    const firstLoad = guard.begin();
    const secondLoad = guard.begin();

    expect(guard.isCurrent(firstLoad)).toBe(false);
    expect(guard.isCurrent(secondLoad)).toBe(true);

    const firstSubmit = guard.beginSubmit();
    expect(firstSubmit).not.toBeNull();
    expect(guard.beginSubmit()).toBeNull();

    guard.finishSubmit(firstSubmit);
    expect(guard.beginSubmit()).not.toBeNull();

    guard.invalidate();
    expect(guard.isCurrent(secondLoad)).toBe(false);
  });

  it('respects rating conditions and omits hidden answers', () => {
    const target = orderReviewFixture.targets[0];
    const positive = target.elements.find(
      (element) => element.id === 'order-positive'
    )!;
    const negative = target.elements.find(
      (element) => element.id === 'order-negative'
    )!;

    expect(isOrderReviewElementVisible(positive, target, 5)).toBe(true);
    expect(isOrderReviewElementVisible(negative, target, 5)).toBe(false);
  });

  it('supports positive and negative showWhen visibility', () => {
    const target = orderReviewFixture.targets[0];
    const baseElement = target.elements[1];
    const positive = {
      ...baseElement,
      data: {
        ...baseElement.data,
        conditions: undefined,
        showWhen: 'positive' as const,
      },
    };
    const negative = {
      ...baseElement,
      data: {
        ...baseElement.data,
        conditions: undefined,
        showWhen: 'negative' as const,
      },
    };

    expect(isOrderReviewElementVisible(positive, target, 5)).toBe(true);
    expect(isOrderReviewElementVisible(positive, target, 2)).toBe(false);
    expect(isOrderReviewElementVisible(positive, target, 0)).toBe(false);
    expect(isOrderReviewElementVisible(negative, target, 2)).toBe(true);
    expect(isOrderReviewElementVisible(negative, target, 5)).toBe(false);
    expect(isOrderReviewElementVisible(negative, target, 0)).toBe(false);
  });

  it('builds only current answerable responses and trims text', () => {
    const target = orderReviewFixture.targets[0];
    const answers = {
      [orderReviewAnswerKey(target.target_id, 'order-rating')]: 5,
      [orderReviewAnswerKey(target.target_id, 'order-positive')]: ['Вкус'],
      [orderReviewAnswerKey(target.target_id, 'order-negative')]: [
        'order_taste',
      ],
      [orderReviewAnswerKey(target.target_id, 'order-comment')]: '  Спасибо  ',
    };

    expect(buildOrderReviewResponses([target], answers)).toEqual([
      { target_id: -100, element_id: 'order-rating', value: 5 },
      { target_id: -100, element_id: 'order-positive', value: ['Вкус'] },
      { target_id: -100, element_id: 'order-comment', value: 'Спасибо' },
    ]);
  });

  it('requires the overall rating before submit', () => {
    expect(validateOrderReview(orderReviewFixture.targets, {})).toBe(
      'Поставьте общую оценку заказу'
    );
  });
});
