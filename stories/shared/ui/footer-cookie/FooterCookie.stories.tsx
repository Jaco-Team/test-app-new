import type { Meta, StoryObj } from '@storybook/react';

import { responsiveStoryParameters } from '../../lib/storybook/responsive';
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

export const Mobile: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Mobile,
};

export const Tablet: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Tablet,
};

export const Desktop: Story = {
  args: Default.args,
  parameters: responsiveStoryParameters.Desktop,
};
