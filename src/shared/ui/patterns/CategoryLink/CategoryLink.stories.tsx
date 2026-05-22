import type { Meta, StoryObj } from '@storybook/react';
import { Inline } from '../../primitives';
import { CategoryLink } from './CategoryLink';
const meta = {
  title: 'UI/Паттерны/Ссылка категории',
  component: CategoryLink,
  parameters: { layout: 'centered' },
  args: { children: 'Роллы' },
} satisfies Meta<typeof CategoryLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {};
export const СГраницей: Story = { args: { tone: 'bordered' } };
export const Активная: Story = { args: { tone: 'active' } };
export const СоСтрелкой: Story = { args: { withArrow: true } };
export const Переполнение: Story = {
  args: { children: 'Очень длинное название категории для проверки' },
};
export const Варианты: Story = {
  render: () => (
    <Inline wrap>
      <CategoryLink>Пицца</CategoryLink>
      <CategoryLink tone="bordered">Роллы</CategoryLink>
      <CategoryLink tone="active">Сеты</CategoryLink>
      <CategoryLink withArrow>Еще</CategoryLink>
    </Inline>
  ),
};
