import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
const options = [
  { value: 'samara', label: 'Самара' },
  { value: 'togliatti', label: 'Тольятти' },
];
const meta = {
  title: 'UI/Компоненты/Список',
  component: Select,
  parameters: { layout: 'centered' },
  args: { label: 'Город', placeholder: 'Выберите город', options },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {};
export const Компактный: Story = { args: { density: 'compact' } };
export const Обычный: Story = { args: { density: 'regular' } };
export const Крупный: Story = { args: { density: 'expanded' } };
export const Недоступный: Story = { args: { disabled: true } };
export const ДлинныйТекст: Story = {
  args: {
    label: 'Очень длинная подпись селекта',
    options: [
      {
        value: 'long',
        label: 'Очень длинное значение пункта для проверки переполнения',
      },
    ],
  },
};
