import type { Meta, StoryObj } from '@storybook/react';
import { PromokodyPage } from './PromokodyPage';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { profilePromocodeDefault } from '@stories/fixtures/profile';
import { breadcrumbsProfile } from '@stories/fixtures/breadcrumbs';

const meta = {
  title: 'Профиль / Промокоды / Страница Промокоды',
  component: PromokodyPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      type: 'object',
      description: 'Данные для шапки ПК',
    },
    promokod: {
      type: 'object',
      description: 'Данные для Промокода',
    },
    data: {
      type: 'object',
      description: 'Данные для меню страницы на ПК',
    },
    footer: {
      type: 'object',
      description: 'Данные для футера ПК',
    },
  },
} satisfies Meta<typeof PromokodyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  promokod: { promokody: profilePromocodeDefault },
  data: { ...breadcrumbsProfile, activePage: 'promokody' },
};

export const Default: Story = {
  args: defaultArgs,
};

export const ArrowUp: Story = {
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
