import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagFilter } from './TagFilter';

const meta = {
  title: 'shared/patterns/TagFilter',
  component: TagFilter,
  args: {
    items: [
      { label: 'Новинка', active: true },
      { label: 'Много рыбки' },
      { label: 'Много креветки' },
      { label: 'Слабосолёный лосось' },
      { label: 'Отборная креветка' },
      { label: 'Жареный угорь' },
      { label: 'Куриное филе' },
      { label: 'Копчёный бекон' },
      { label: 'Свежий огурец' },
    ],
  },
} satisfies Meta<typeof TagFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ПоУмолчанию: Story = {};
