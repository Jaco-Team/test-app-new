import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../primitives';
import { Input } from './Input';

const meta = {
  title: 'UI/Компоненты/Поле ввода',
  component: Input,
  parameters: { layout: 'centered' },
  args: {
    label: 'Телефон',
    placeholder: '+7',
    helperText: 'Введите номер телефона',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {};
export const Компактный: Story = { args: { density: 'compact' } };
export const Обычный: Story = { args: { density: 'regular' } };
export const Крупный: Story = { args: { density: 'expanded' } };
export const Недоступный: Story = { args: { disabled: true } };
export const Ошибка: Story = {
  args: { tone: 'error', helperText: 'Проверьте значение' },
};
export const ДлинныйТекст: Story = {
  args: {
    label: 'Очень длинная подпись поля для проверки переполнения',
    placeholder: 'Очень длинное значение внутри поля',
  },
};
export const Состояния: Story = {
  render: () => (
    <Stack>
      <Input label="Обычное" placeholder="Адрес" />
      <Input label="Ошибка" tone="error" helperText="Ошибка" />
      <Input label="Успех" tone="success" helperText="Готово" />
      <Input label="Недоступно" disabled placeholder="Недоступно" />
    </Stack>
  ),
};
