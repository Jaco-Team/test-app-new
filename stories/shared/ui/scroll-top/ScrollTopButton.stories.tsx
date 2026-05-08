import type { Meta, StoryObj } from '@storybook/react';

import { responsiveStoryParameters } from '../../lib/storybook/responsive';
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

export const Mobile: Story = {
  args: Visible.args,
  parameters: responsiveStoryParameters.Mobile,
};

export const Tablet: Story = {
  args: Visible.args,
  parameters: responsiveStoryParameters.Tablet,
};

export const Desktop: Story = {
  args: Visible.args,
  parameters: responsiveStoryParameters.Desktop,
};
