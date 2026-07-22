import { api } from '@/components/api';
import { createMockSubmitResult, mockFeedbackForm } from './mockFeedback';

function cloneMockForm(pointId, orderId) {
  return {
    ...mockFeedbackForm,
    order: {
      ...mockFeedbackForm.order,
      point_id: pointId,
      order_id: orderId,
    },
  };
}

function assertSuccessfulResponse(result) {
  if (!result || result.st !== true) {
    throw new Error(result?.text || 'Не удалось выполнить запрос');
  }

  return result;
}

export async function getClientFeedbackForm({
  pointId,
  orderId,
  token,
  useMocks,
}) {
  if (useMocks) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return cloneMockForm(pointId, orderId);
  }

  const result = await api('client_feedback', {
    type: 'get_form',
    point_id: pointId,
    order_id: orderId,
    token,
  });

  return assertSuccessfulResponse(result);
}

export async function submitClientFeedback({
  pointId,
  orderId,
  responses,
  token,
  useMocks,
}) {
  if (useMocks) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return createMockSubmitResult();
  }

  const result = await api('client_feedback', {
    type: 'submit_feedback',
    point_id: pointId,
    order_id: orderId,
    responses: JSON.stringify(responses),
    token,
    __disableRetry: true,
  });

  return assertSuccessfulResponse(result);
}
