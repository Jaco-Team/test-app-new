import type { Meta, StoryObj } from '@storybook/react';
import { ScrollTopButton } from './ScrollTopButton';
const meta = {
  title: 'UI/Components/ScrollTopButton',
  component: ScrollTopButton,
  args: { visible: true },
} satisfies Meta<typeof ScrollTopButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Hidden: Story = { args: { visible: false } };
