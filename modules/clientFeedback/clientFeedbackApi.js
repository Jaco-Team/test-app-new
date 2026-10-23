import { api } from '@/components/api';

function assertSuccessfulResponse(result) {
  if (!result || result.st !== true) {
    throw new Error(result?.text || 'Не удалось выполнить запрос');
  }

  return result;
}

export async function getClientFeedbackForm({ pointId, orderId, token }) {
  const result = await api('client_feedback', {
    type: 'get_form',
    point_id: pointId,
    order_id: orderId,
    token,
    __preserveErrorText: true,
  });

  return assertSuccessfulResponse(result);
}

export async function submitClientFeedback({
  pointId,
  orderId,
  responses,
  token,
}) {
  const result = await api('client_feedback', {
    type: 'submit_feedback',
    point_id: pointId,
    order_id: orderId,
    responses: JSON.stringify(responses),
    token,
    __disableRetry: true,
    __preserveErrorText: true,
  });

  return assertSuccessfulResponse(result);
}
