import { fn } from 'storybook/test';

import Paper from '@mui/material/Paper';

import {
  OrderReviewForm,
  OrderReviewState,
} from '@/modules/clientFeedback/orderReview';
import { orderReviewFixture } from '../model/fixtures';

export default {
  title: 'Фичи / Отзыв о заказе',
  decorators: [
    (Story: React.ComponentType) => (
      <Paper elevation={3} sx={{ margin: '24px auto', maxWidth: 640, p: 3 }}>
        <Story />
      </Paper>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export const Ready = {
  render: () => <OrderReviewForm form={orderReviewFixture} onSubmit={fn()} />,
};

export const Submitting = {
  render: () => (
    <OrderReviewForm form={orderReviewFixture} onSubmit={fn()} submitting />
  ),
};

export const SubmitError = {
  render: () => (
    <OrderReviewForm
      form={orderReviewFixture}
      onSubmit={fn()}
      submitError="Не удалось отправить отзыв. Проверьте соединение и попробуйте снова."
    />
  ),
};

export const Loading = {
  render: () => <OrderReviewState kind="loading" />,
};

export const Empty = {
  render: () => <OrderReviewState kind="empty" onClose={fn()} />,
};

export const LoadError = {
  render: () => <OrderReviewState kind="error" onClose={fn()} onRetry={fn()} />,
};

export const Submitted = {
  render: () => <OrderReviewState kind="submitted" onClose={fn()} />,
};

export const AlreadyExisted = {
  render: () => <OrderReviewState kind="already_existed" onClose={fn()} />,
};
