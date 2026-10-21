import type { Meta, StoryObj } from '@storybook/react';

import { placeholder_img } from '@/public/placeholder_img';
import {
  buildImageSrcSet,
  buildImageVariantUrl,
} from '@stories/shared/lib/image/responsiveImage';

import { ResponsiveImage } from './ResponsiveImage';

const location = {
  baseUrl: 'https://mainimg.jacofood.ru',
  imageId: 'Vodopad_set',
};
const widths = [366, 466, 585, 732];
const defaultImage = {
  src: buildImageVariantUrl({
    ...location,
    width: 585,
    format: 'jpg' as const,
  }),
  sizes: '(max-width: 800px) 50vw, 420px',
  sources: [
    {
      type: 'image/webp',
      srcSet: buildImageSrcSet({
        ...location,
        widths,
        format: 'webp',
      }),
    },
    {
      type: 'image/jpeg',
      srcSet: buildImageSrcSet({ ...location, widths, format: 'jpg' }),
    },
  ],
};

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
