import type { Meta, StoryObj } from '@storybook/react';
import { HomePage } from './HomePage';
import {
  responsiveStoryGlobals,
  responsiveStoryParameters,
} from '@stories/shared/lib/storybook/responsive';
import { homeBannerList, homeProductCards } from '@stories/fixtures/home';

const meta = {
  title: 'Страницы / Главная',
  component: HomePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные по умолчанию для шапки ПК',
    },
    banners: {
      type: 'array',
      description: 'Данные по умолчанию для баннера ПК',
    },
    container: {
      type: 'object',
      description: 'Данные по умолчанию для контейнера карточек товара ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные по умолчанию для футера ПК',
    },
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  banners: { bannerList: homeBannerList },
  container: { cardItem: homeProductCards },
};

export const Default: Story = {
  args: defaultArgs,
};

export const Mobile: Story = {
  args: defaultArgs,
  parameters: responsiveStoryParameters.Mobile,
  globals: responsiveStoryGlobals.Mobile,
};

export const Tablet: Story = {
  args: defaultArgs,
  parameters: responsiveStoryParameters.Tablet,
  globals: responsiveStoryGlobals.Tablet,
};

export const Desktop: Story = {
  args: defaultArgs,
  parameters: responsiveStoryParameters.Desktop,
  globals: responsiveStoryGlobals.Desktop,
};
