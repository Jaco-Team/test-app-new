import type {
  OrderReviewAnswers,
  OrderReviewElement,
  OrderReviewResponse,
  OrderReviewTarget,
  OrderReviewValue,
} from './types';

export function orderReviewAnswerKey(targetId: number, elementId: string) {
  return `${targetId}:${elementId}`;
}

export function orderReviewText(
  data: OrderReviewElement['data'],
  keys: Array<'title' | 'label' | 'text' | 'value'>,
  fallback: string
) {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  return fallback;
}

export function getTargetRating(
  target: OrderReviewTarget,
  answers: OrderReviewAnswers
) {
  const rating = target.elements.find((element) => element.type === 'rating');

  return rating
    ? Number(answers[orderReviewAnswerKey(target.target_id, rating.id)]) || 0
    : 0;
}

export function isOrderReviewElementVisible(
  element: OrderReviewElement,
  target: OrderReviewTarget,
  rating: number
) {
  const stars = (element.data?.conditions?.stars || []).map(Number);
  const products = element.data?.conditions?.products || [];
  const categories = element.data?.conditions?.categories || [];

  if (stars.length > 0 && (!rating || !stars.includes(rating))) return false;
  if (products.length > 0 && !products.includes(target.name)) return false;
  if (
    categories.length > 0 &&
    !categories.includes(target.category_name || '')
  ) {
    return false;
  }
  if (element.data?.showWhen === 'positive' && rating < 4) return false;
  if (element.data?.showWhen === 'negative' && (rating === 0 || rating >= 4)) {
    return false;
  }
  if (
    (element.type === 'tagCloud' || element.type === 'checkboxGroup') &&
    !rating
  ) {
    return false;
  }

  return true;
}

function hasValue(value: OrderReviewValue | undefined) {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null;
}

export function buildOrderReviewResponses(
  targets: OrderReviewTarget[],
  answers: OrderReviewAnswers
): OrderReviewResponse[] {
  return targets.flatMap((target) => {
    const rating = getTargetRating(target, answers);

    return target.elements.flatMap((element) => {
      if (
        element.answerable !== true ||
        !isOrderReviewElementVisible(element, target, rating)
      ) {
        return [];
      }

      const value = answers[orderReviewAnswerKey(target.target_id, element.id)];
      if (!hasValue(value)) return [];

      return [
        {
          target_id: target.target_id,
          element_id: element.id,
          value: typeof value === 'string' ? value.trim() : value,
        },
      ];
    });
  });
}

export function validateOrderReview(
  targets: OrderReviewTarget[],
  answers: OrderReviewAnswers
) {
  const overallTarget = targets.find(
    (target) => target.target_type === 'order'
  );

  if (overallTarget) {
    const overallRating = overallTarget.elements.find(
      (element) => element.type === 'rating'
    );
    if (overallRating && getTargetRating(overallTarget, answers) === 0) {
      return 'Поставьте общую оценку заказу';
    }
  }

  for (const target of targets) {
    const rating = getTargetRating(target, answers);
    for (const element of target.elements) {
      if (
        element.answerable !== true ||
        element.data?.required !== true ||
        !isOrderReviewElementVisible(element, target, rating)
      ) {
        continue;
      }

      const value = answers[orderReviewAnswerKey(target.target_id, element.id)];
      if (!hasValue(value)) {
        return orderReviewText(
          element.data,
          ['title', 'label'],
          'Заполните обязательное поле'
        );
      }
    }
  }

  if (buildOrderReviewResponses(targets, answers).length === 0) {
    return 'Добавьте хотя бы один ответ';
  }

  return '';
}
