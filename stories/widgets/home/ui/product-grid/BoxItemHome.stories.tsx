import type { Meta, StoryObj } from '@storybook/react';
import { BoxItemHome } from './BoxItemHome';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { homeProductCards } from '@stories/fixtures/home';

const meta = {
  title: 'Виджеты / Главная / Список товаров',
  component: BoxItemHome,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    cardItem: {
      type: 'object',
      description: 'Данные по умолчанию для карточки товара ПК',
    },
  },
} satisfies Meta<typeof BoxItemHome>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  cardItem: homeProductCards,
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
