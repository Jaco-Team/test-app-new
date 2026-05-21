import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../primitives';
import { Input } from './Input';

const meta = {
  title: 'UI/Components/Input',
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
export const Default: Story = {};
export const Compact: Story = { args: { density: 'compact' } };
export const Regular: Story = { args: { density: 'regular' } };
export const Expanded: Story = { args: { density: 'expanded' } };
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = {
  args: { tone: 'error', helperText: 'Проверьте значение' },
};
export const LongText: Story = {
  args: {
    label: 'Очень длинная подпись поля для проверки переполнения',
    placeholder: 'Очень длинное значение внутри поля',
  },
};
export const States: Story = {
  render: () => (
    <Stack>
      <Input label="Default" placeholder="Адрес" />
      <Input label="Error" tone="error" helperText="Ошибка" />
      <Input label="Success" tone="success" helperText="Готово" />
      <Input label="Disabled" disabled placeholder="Недоступно" />
    </Stack>
  ),
};
