import type { Meta, StoryObj } from '@storybook/react';

import { ScrollTopButton } from './ScrollTopButton';

const meta = {
  title: 'Shared/Footer/ScrollTopButton',
  component: ScrollTopButton,
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollTopButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  args: {
    visible: true,
  },
};
