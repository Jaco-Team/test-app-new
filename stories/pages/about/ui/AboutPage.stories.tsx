import type { Meta, StoryObj } from '@storybook/react';
import { AboutPage } from './AboutPage';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { breadcrumbsAbout } from '@stories/fixtures/breadcrumbs';

const meta = {
  title: 'Страницы / О компании',
  component: AboutPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      control: 'object',
      description: 'Данные для шапки ПК',
    },
    data: {
      control: 'object',
      description: 'Данные для оглавления страницы',
    },
    footer: {
      control: 'object',
      description: 'Данные для футера ПК',
    },
    cityName: {
      type: 'string',
      description: 'Город в URL (для мобильной ссылки «назад»)',
    },
    viewport: {
      control: 'inline-radio',
      options: ['mobile', 'tablet', 'desktop'],
      description: 'Вариант вёрстки (как на странице акций)',
    },
  },
} satisfies Meta<typeof AboutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  data: breadcrumbsAbout,
  cityName: 'togliatti',
  viewport: 'desktop' as const,
};

export const Default: Story = {
  args: defaultArgs,
};

export const ArrowUp: Story = {
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
