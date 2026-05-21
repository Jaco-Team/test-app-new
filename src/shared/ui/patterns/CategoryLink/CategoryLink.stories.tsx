import type { Meta, StoryObj } from '@storybook/react';
import { Inline } from '../../primitives';
import { CategoryLink } from './CategoryLink';
const meta = {
  title: 'UI/Patterns/CategoryLink',
  component: CategoryLink,
  parameters: { layout: 'centered' },
  args: { children: 'Роллы' },
} satisfies Meta<typeof CategoryLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Bordered: Story = { args: { tone: 'bordered' } };
export const Active: Story = { args: { tone: 'active' } };
export const WithArrow: Story = { args: { withArrow: true } };
export const Overflow: Story = {
  args: { children: 'Очень длинное название категории для проверки' },
};
export const Variants: Story = {
  render: () => (
    <Inline wrap>
      <CategoryLink>Пицца</CategoryLink>
      <CategoryLink tone="bordered">Роллы</CategoryLink>
      <CategoryLink tone="active">Сеты</CategoryLink>
      <CategoryLink withArrow>Еще</CategoryLink>
    </Inline>
  ),
};
