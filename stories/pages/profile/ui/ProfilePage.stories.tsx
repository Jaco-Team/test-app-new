import type { Meta, StoryObj } from '@storybook/react';
import { ProfilePage } from './ProfilePage';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import {
  profileAddressDefault,
  profileUserActive,
  profileUserDefault,
} from '@stories/fixtures/profile';
import { breadcrumbsProfile } from '@stories/fixtures/breadcrumbs';

const meta = {
  title: 'Профиль / Личные данные / Страница Личные данные',
  component: ProfilePage,
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
      description: 'Данные для меню страницы на ПК',
    },
    user: {
      control: 'object',
      description: 'Личные данные пользователя',
    },
    address: {
      control: 'object',
      description: 'Данные адреса клиента',
    },
    footer: {
      control: 'object',
      description: 'Данные для футера ПК',
    },
  },
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  user: profileUserDefault,
  data: { ...breadcrumbsProfile, activePage: 'profile' },
  address: null,
};

const activeArgs = {
  user: profileUserActive,
  data: { ...breadcrumbsProfile, activePage: 'profile' },
  address: { address: profileAddressDefault },
};

export const Default: Story = {
  args: defaultArgs,
};

export const Active: Story = {
  args: activeArgs,
};

export const ArrowUp: Story = {
  args: activeArgs,
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
