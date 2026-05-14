import type { Meta, StoryObj } from '@storybook/react';
import { PromotionsPage } from './PromotionsPage';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { promotionPageArgs } from '@stories/fixtures/promotions';

const meta = {
  title: 'Страницы / Акции',
  component: PromotionsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      control: 'object',
      description: 'Данные для шапки',
    },
    actia: {
      control: 'object',
      description: 'Данные для акции',
    },
    footer: {
      control: 'object',
      description: 'Данные для футера',
    },
  },
} satisfies Meta<typeof PromotionsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  actia: promotionPageArgs,
  viewport: 'desktop' as const,
};

export const Default: Story = {
  args: defaultArgs,
};

export const ArrowUp: Story = {
  args: defaultArgs,
};

export const Cookie: Story = {
  args: defaultArgs,
};

export const Mobile: Story = {
  args: {
    ...defaultArgs,
    viewport: 'mobile',
  },
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: {
    ...defaultArgs,
    viewport: 'tablet',
  },
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: {
    ...defaultArgs,
    viewport: 'desktop',
  },
  globals: responsiveStoryGlobals.Desktop,
};
