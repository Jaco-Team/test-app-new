import type { Meta, StoryObj } from '@storybook/react';
import { ModalItemList } from './ModalItemList';
import {
  modalItemListSetArgs,
  modalItemListValueArgs,
} from '@stories/fixtures/product-modal';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
const meta = {
  title: 'Фичи / Модалка товара / Список товаров',
  component: ModalItemList,
  tags: ['autodocs'],
  argTypes: {
    set: {
      control: 'object',
      description: 'Список товаров сета',
    },
    value: {
      control: 'object',
      description: 'Список товаров сета',
    },
    type: {
      type: 'string',
      description: 'Тип списка товаров',
    },
    link_allergens: {
      type: 'string',
      description: 'Ссылка на скачивание',
    },
  },
} satisfies Meta<typeof ModalItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Set: Story = {
  args: {
    ...modalItemListSetArgs,
  },
};

export const Value: Story = {
  args: {
    ...modalItemListValueArgs,
  },
};

export const Mobile: Story = {
  args: {
    ...modalItemListSetArgs,
  },
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: {
    ...modalItemListSetArgs,
  },
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: {
    ...modalItemListSetArgs,
  },
  globals: responsiveStoryGlobals.Desktop,
};
