import type { Meta, StoryObj } from '@storybook/react';
import { ContactsPage } from './ContactsPage';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import {
  contactsMapDefaultArgs,
  contactsMenuDefaultArgs,
} from '@stories/fixtures/contacts';

const meta = {
  title: 'Страницы / Контакты',
  component: ContactsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    header: {
      control: 'object',
      description: 'Данные для шапки ПК',
    },
    menu: {
      control: 'object',
      description: 'Данные для меню на странице Контакты ПК',
    },
    map: {
      control: 'object',
      description: 'Данные для карты на странице Контакты ПК',
    },
    footer: {
      control: 'object',
      description: 'Данные для футера ПК',
    },
  },
} satisfies Meta<typeof ContactsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  menu: contactsMenuDefaultArgs,
  map: contactsMapDefaultArgs,
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
