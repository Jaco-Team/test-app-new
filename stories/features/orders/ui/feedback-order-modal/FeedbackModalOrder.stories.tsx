import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FeedbackModalOrder from './FeedbackModalOrder';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';

const meta: Meta<typeof FeedbackModalOrder> = {
  title: 'Профиль / Заказы / Модалка отзыва заказа',
  component: FeedbackModalOrder,
  tags: ['autodocs'],
  argTypes: {
    more: {
      control: 'boolean',
      description: 'Показывать расширенную форму с тегами и комментарием',
      defaultValue: true,
    },
    orderNumber: {
      control: 'text',
      description: 'Номер заказа',
      defaultValue: '1234',
    },
    deliveryDate: {
      control: 'text',
      description: 'Дата доставки',
      defaultValue: '15 января',
    },
    courierName: {
      control: 'text',
      description: 'Имя курьера',
      defaultValue: 'Алексей',
    },
    onSubmit: {
      action: 'submitted',
      description: 'Колбэк при отправке формы',
    },
    onClose: {
      action: 'closed',
      description: 'Колбэк при закрытии модалки',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeedbackModalOrder>;

export const Default: Story = {
  args: {
    more: true,
    orderNumber: '1234',
    deliveryDate: '15 января',
    courierName: 'Алексей',
  },
};

export const SimpleMode: Story = {
  args: {
    more: false,
    orderNumber: '5678',
    deliveryDate: '20 января',
    courierName: 'Дмитрий',
  },
};

export const Mobile: Story = {
  args: Default.args,
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: Default.args,
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: Default.args,
  globals: responsiveStoryGlobals.Desktop,
};
