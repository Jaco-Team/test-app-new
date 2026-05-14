import type { Meta, StoryObj } from '@storybook/react';
import { FormOrder } from './FormOrder';
import {
  formOrderDeliveryActiveArgs,
  formOrderDeliveryActiveCashArgs,
  formOrderDeliveryArgs,
  formOrderPickupActiveArgs,
  formOrderPickupArgs,
} from '@stories/fixtures/checkout';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
const meta = {
  title: 'Фичи / Оформление заказа / Форма',
  component: FormOrder,
  tags: ['autodocs'],
  argTypes: {
    typeOrder: {
      type: 'string',
      description: 'Тип заказа',
    },
    summ: {
      type: 'string',
      description: 'Сумма доставки',
    },
    itemsCount: {
      type: 'string',
      description: 'Количестов позиций товаров',
    },
    allPrice: {
      type: 'string',
      description: 'Сумма заказа',
    },
    hours: {
      type: 'string',
      description: 'Время заказа',
    },
    address: {
      type: 'string',
      description: 'Адрес клиента или точки',
    },
    list: {
      control: 'object',
      description: 'Список для выбора',
    },
    list_address: {
      control: 'object',
      description: 'Список адресов для выбора',
    },
    online: {
      type: 'string',
      description: 'Оплата онлайн',
    },
    comment: {
      type: 'string',
      description: 'Сообщение курьеру',
    },
  },
} satisfies Meta<typeof FormOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Delivery: Story = {
  args: {
    ...formOrderDeliveryArgs,
  },
};

export const Delivery_Active: Story = {
  args: {
    ...formOrderDeliveryActiveArgs,
  },
};

export const Delivery_Active_Sdacha: Story = {
  args: {
    ...formOrderDeliveryActiveCashArgs,
  },
};

export const Pikcup: Story = {
  args: {
    ...formOrderPickupArgs,
  },
};

export const Pikcup_Active: Story = {
  args: {
    ...formOrderPickupActiveArgs,
  },
};

export const Mobile: Story = {
  args: {
    ...formOrderDeliveryArgs,
  },
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: {
    ...formOrderDeliveryArgs,
  },
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: {
    ...formOrderDeliveryArgs,
  },
  globals: responsiveStoryGlobals.Desktop,
};
