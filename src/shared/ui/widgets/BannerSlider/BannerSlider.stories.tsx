import type { Meta, StoryObj } from '@storybook/react';
import { resolveBannerImageUrl } from '@src/shared/lib/mediaUrls';
import { BannerSlider } from './BannerSlider';

const demoKey = 'Filadelfiia_opalionnaia';

const meta = {
  title: 'UI/Виджеты/Баннеры',
  component: BannerSlider,
  parameters: { layout: 'fullscreen' },
  args: {
    slides: [
      {
        id: '1',
        image: resolveBannerImageUrl(demoKey, 'compact'),
        imageWide: resolveBannerImageUrl(demoKey, 'expanded'),
        alt: 'Акция',
      },
      {
        id: '2',
        image: resolveBannerImageUrl(demoKey, 'compact'),
        imageWide: resolveBannerImageUrl(demoKey, 'expanded'),
        alt: 'Новинки',
      },
    ],
  },
} satisfies Meta<typeof BannerSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ПоУмолчанию: Story = {
  name: 'По умолчанию',
};

export const Compact: Story = {
  name: 'Компактный',
  parameters: { viewport: { defaultViewport: 'mobileMin' } },
};

export const Regular: Story = {
  name: 'Обычный',
  parameters: { viewport: { defaultViewport: 'tabletMin' } },
};

export const Expanded: Story = {
  name: 'Расширенный',
  parameters: { viewport: { defaultViewport: 'desktopMin' } },
};
