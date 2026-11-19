import { beforeEach, describe, expect, it, vi } from 'vitest';

const { api } = vi.hoisted(() => ({ api: vi.fn() }));

vi.mock('@/components/api', () => ({ api }));

import {
  getClientFeedbackForm,
  submitClientFeedback,
} from '@/modules/clientFeedback/clientFeedbackApi';

describe('client feedback API', () => {
  beforeEach(() => {
    api.mockReset();
  });

  it('requests the form from the Site client_feedback endpoint', async () => {
    const response = { st: true, submitted: false, targets: [] };
    api.mockResolvedValue(response);

    await expect(
      getClientFeedbackForm({ pointId: 7, orderId: 44127, token: 'token' })
    ).resolves.toBe(response);
    expect(api).toHaveBeenCalledWith('client_feedback', {
      type: 'get_form',
      point_id: 7,
      order_id: 44127,
      token: 'token',
      __preserveErrorText: true,
    });
  });

  it('submits serialized responses once without automatic mutation retry', async () => {
    const responses = [{ target_id: -100, element_id: 'rating', value: 5 }];
    const response = {
      st: true,
      feedback_ids: [101],
      already_existed: false,
    };
    api.mockResolvedValue(response);

    await expect(
      submitClientFeedback({
        pointId: 7,
        orderId: 44127,
        responses,
        token: 'token',
      })
    ).resolves.toBe(response);
    expect(api).toHaveBeenCalledTimes(1);
    expect(api).toHaveBeenCalledWith('client_feedback', {
      type: 'submit_feedback',
      point_id: 7,
      order_id: 44127,
      responses: JSON.stringify(responses),
      token: 'token',
      __disableRetry: true,
      __preserveErrorText: true,
    });
  });

  it('rejects unsuccessful backend responses', async () => {
    api.mockResolvedValue({ st: false, text: 'Заказ недоступен' });

    await expect(
      getClientFeedbackForm({ pointId: 7, orderId: 44127, token: 'token' })
    ).rejects.toThrow('Заказ недоступен');
  });
});
