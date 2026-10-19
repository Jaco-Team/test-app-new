import type { Meta, StoryObj } from '@storybook/react';

import { placeholder_img } from '@/public/placeholder_img';
import { createProductImageSources } from '@stories/entities/product/model/productImage';

import { ResponsiveImage } from './ResponsiveImage';

const defaultImage = createProductImageSources('Vodopad_set', 'card');

const meta = {
  title: 'Общие элементы / Адаптивное изображение',
  component: ResponsiveImage,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    ...defaultImage,
    alt: 'Водопад сет',
    width: 585,
    height: 585,
    fallbackSrc: placeholder_img,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(70vw, 420px)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResponsiveImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Загружено: Story = {};

export const Ошибка: Story = {
  args: {
    src: 'https://mainimg.jacofood.ru/not-found_585x585.jpg',
    sources: [],
  },
};

export const ИзображениеОтсутствует: Story = {
  args: {
    src: undefined,
    sources: [],
  },
};
