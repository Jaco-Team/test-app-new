import type { Meta, StoryObj } from '@storybook/react';
import { ModalItem } from './ModalItem';
import {
  modalItemBadgeArgs,
  modalItemSetArgs,
  modalItemSetCountArgs,
  modalItemStart1Args,
  modalItemStart2Args,
  modalItemStart3Args,
  modalItemValue1Args,
  modalItemValue2Args,
  modalItemValue3Args,
  modalItemValueCountArgs,
} from '@stories/fixtures/product-modal';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
const meta = {
  title: 'Фичи / Модалка товара / Варианты',
  component: ModalItem,
  tags: ['autodocs'],
  argTypes: {
    img_name: {
      type: 'string',
      description: 'Картинка',
    },
    title: {
      type: 'string',
      description: 'Название картинки',
    },
    is_new: {
      type: 'string',
      description: 'Значение бейджа Новинка',
    },
    is_hit: {
      type: 'string',
      description: 'Значение бейджа Хит',
    },
    desc: {
      control: 'object',
      description: 'Описание товара для сетов',
    },
    count: {
      control: 'object',
      description: 'Данные для кнопки',
    },
    list: {
      control: 'object',
      description: 'Список товаров',
    },
    typeModal: {
      type: 'string',
      description: 'Тип модального окна',
    },
  },
} satisfies Meta<typeof ModalItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const start4Args = {
  ...modalItemStart1Args,
  title: 'Вилка',
  img_name: 'Vilka',
  desc: {
    ...modalItemStart1Args.desc,
    title_desk: 'Вилка',
    cat_id: '7',
    count_part_new: '',
    size_pizza: '0',
    count_part: '1',
    weight: '1',
    id: '237',
    marc_desc: '',
  },
};

const startCountArgs = {
  ...modalItemStart1Args,
  count: {
    variant: 'modal',
    children: '',
    count: 1,
    typeModal: 'start',
    element: 'modal',
  },
};

export const Start_1: Story = {
  args: { ...modalItemStart1Args },
};

export const Start_2: Story = {
  args: { ...modalItemStart2Args },
};

export const Start_3: Story = {
  args: { ...modalItemStart3Args },
};

export const Start_4: Story = {
  args: start4Args,
};

export const Start_count: Story = {
  args: startCountArgs,
};

export const Set: Story = {
  args: { ...modalItemSetArgs },
};

export const Set_count: Story = {
  args: { ...modalItemSetCountArgs },
};

export const Value_1: Story = {
  args: { ...modalItemValue1Args },
};

export const Value_2: Story = {
  args: { ...modalItemValue2Args },
};

export const Value_3: Story = {
  args: { ...modalItemValue3Args },
};

export const Value_count: Story = {
  args: { ...modalItemValueCountArgs },
};

export const Badge: Story = {
  args: { ...modalItemBadgeArgs },
};

export const Mobile: Story = {
  args: { ...modalItemStart1Args },
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: { ...modalItemStart1Args },
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: { ...modalItemStart1Args },
  globals: responsiveStoryGlobals.Desktop,
};
