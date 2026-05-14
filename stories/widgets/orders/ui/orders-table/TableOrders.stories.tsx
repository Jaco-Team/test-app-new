import type { Meta, StoryObj } from '@storybook/react';
import { TableOrders } from './TableOrders';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { profileOrderCheck } from '@stories/fixtures/profile';

const meta = {
  title: 'Профиль / Заказы / Таблица заказов',
  component: TableOrders,
  tags: ['autodocs'],
  argTypes: {
    order: {
      type: 'array',
      description: 'Заказ клиента',
    },
  },
} satisfies Meta<typeof TableOrders>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  order: { order: profileOrderCheck },
};

export const Default: Story = {
  args: defaultArgs,
};

export const Mobile: Story = {
  args: defaultArgs,
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: defaultArgs,
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: defaultArgs,
  globals: responsiveStoryGlobals.Desktop,
};
