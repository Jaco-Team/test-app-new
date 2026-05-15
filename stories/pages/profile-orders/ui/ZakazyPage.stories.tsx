import type { Meta, StoryObj } from '@storybook/react';
import { ZakazyPage } from './ZakazyPage';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { profileOrderCheck } from '@stories/fixtures/profile';
import { breadcrumbsProfile } from '@stories/fixtures/breadcrumbs';

const meta = {
  title: 'Профиль / Заказы / Страница заказы',
  component: ZakazyPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      control: 'object',
      description: 'Данные для шапки ПК',
    },
    orders: {
      control: 'object',
      description: 'Список заказов клиента на ПК',
    },
    data: {
      control: 'object',
      description: 'Данные для меню страницы на ПК',
    },
    footer: {
      control: 'object',
      description: 'Данные для футера ПК',
    },
  },
} satisfies Meta<typeof ZakazyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  orders: { order: { order: profileOrderCheck } },
  data: { ...breadcrumbsProfile, activePage: 'zakazy' },
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
