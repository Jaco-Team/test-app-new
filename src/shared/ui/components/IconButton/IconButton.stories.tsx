import type { Meta, StoryObj } from '@storybook/react';
import { Inline } from '../../primitives';
import { IconClose, BasketIconNew, BurgerIconPC } from '../../icons';
import { IconButton } from './IconButton';
const meta = {
  title: 'UI/Components/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  args: { label: 'Закрыть', children: <IconClose /> },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { size: 'sm' } };
export const Regular: Story = { args: { size: 'md' } };
export const Expanded: Story = { args: { size: 'lg' } };
export const Active: Story = { args: { active: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Variants: Story = {
  render: () => (
    <Inline>
      <IconButton label="Меню">
        <BurgerIconPC />
      </IconButton>
      <IconButton label="Корзина" tone="brand">
        <BasketIconNew />
      </IconButton>
      <IconButton label="Закрыть" tone="inverse">
        <IconClose />
      </IconButton>
    </Inline>
  ),
};
