import type { Meta, StoryObj } from '@storybook/react';
import { PromotionDetail } from './PromotionDetail';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import {
  promotionBannerArgs,
  promotionPageArgs,
} from '@stories/fixtures/promotions';

const meta = {
  title: 'Акции / Акция',
  component: PromotionDetail,
  tags: ['autodocs'],
  argTypes: {
    title: {
      type: 'string',
      description: 'Имя для картинки',
    },
    img: {
      type: 'string',
      description: 'Название картинки',
    },
    text: {
      type: 'string',
      description: 'Описание акции',
    },
    typePromo: {
      type: 'string',
      description: 'Тип промика',
    },
    count: {
      type: 'number',
      description: 'Количество товара',
    },
    type: {
      type: 'string',
      description: 'Компонент сайта где размещена акция',
    },
  },
} satisfies Meta<typeof PromotionDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Banner: Story = {
  args: promotionBannerArgs,
};

export const Page: Story = {
  args: promotionPageArgs,
};

export const Mobile: Story = {
  args: promotionBannerArgs,
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: promotionBannerArgs,
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: promotionBannerArgs,
  globals: responsiveStoryGlobals.Desktop,
};
