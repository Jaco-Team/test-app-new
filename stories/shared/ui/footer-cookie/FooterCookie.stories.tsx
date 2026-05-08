import type { Meta, StoryObj } from '@storybook/react';

import { FooterCookie } from './FooterCookie';

const meta = {
  title: 'Shared/Footer/Cookie',
  component: FooterCookie,
  tags: ['autodocs'],
} satisfies Meta<typeof FooterCookie>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cityName: 'samara',
  },
};
