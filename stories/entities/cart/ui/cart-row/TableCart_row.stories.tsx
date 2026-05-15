// TableCart_row.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { TableCart_row } from './TableCart_row';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { TableCartRowProps } from '@stories/entities/cart/ui/cart-row/model/types';

// Тип для аргументов Storybook
type StoryArgs = TableCartRowProps;

// Мета-информация с типами
const meta: Meta<typeof TableCart_row> = {
  title: 'Сущности / Корзина / Строка таблицы',
  component: TableCart_row,
  tags: ['autodocs'],
  argTypes: {
    last: {
      type: 'string',
      description: 'Последний товар в таблице корзины',
      control: { type: 'text' },
      options: ['', 'last'],
    },
    title: {
      type: 'string',
      description: 'Наименование товара',
      control: { type: 'text' },
    },
    img_app: {
      type: 'string',
      description: 'Картинка товара',
      control: { type: 'text' },
    },
    status_promo: {
      type: 'boolean',
      description: 'Статус промокода',
      control: { type: 'boolean' },
    },
    new_one_price: {
      type: 'string',
      description: 'Измененная цена товара',
      control: { type: 'text' },
    },
    disabled: {
      type: 'boolean',
      description: 'Отключение изменений в товаре',
      control: { type: 'boolean' },
    },
    one_price: {
      type: 'string',
      description: 'Цена товара',
      control: { type: 'text' },
    },
    all_price: {
      type: 'string',
      description: 'Цена товара в зависимости от количества товара',
      control: { type: 'text' },
    },
    count: {
      type: 'string',
      description: 'Количество товара',
      control: { type: 'text' },
    },
  },
};

export default meta;

// Типизированный тип истории
type Story = StoryObj<typeof TableCart_row>;

// История для обычного товара
export const Item: Story = {
  args: {
    last: '',
    title: 'Мадейра сет',
    img_app: 'Madeira_set',
    status_promo: false,
    new_one_price: '',
    disabled: false,
    one_price: '909',
    all_price: '',
    count: '1',
  },
};

// История для дополнительного товара
export const Dop: Story = {
  args: {
    last: '',
    title: 'Соевый соус',
    img_app: 'Soevyi_sous_',
    status_promo: false,
    new_one_price: '',
    disabled: false,
    one_price: '14',
    all_price: '',
    count: '0',
  },
};

// История для промо-товара
export const Promo: Story = {
  args: {
    last: '',
    title: 'Мадейра сет',
    img_app: 'Madeira_set',
    status_promo: true,
    new_one_price: '',
    disabled: true,
    one_price: '909',
    all_price: '890',
    count: '1',
  },
};

// История с максимальным количеством
export const Count: Story = {
  args: {
    last: '',
    title: 'Соевый соус',
    img_app: 'Soevyi_sous_',
    status_promo: false,
    new_one_price: '',
    disabled: false,
    one_price: '14',
    all_price: '',
    count: '99',
  },
};

// Адаптивные версии
export const Mobile: Story = {
  args: Item.args,
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: Item.args,
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: Item.args,
  globals: responsiveStoryGlobals.Desktop,
};
