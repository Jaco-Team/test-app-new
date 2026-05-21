import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
const options = [
  { value: 'samara', label: 'Самара' },
  { value: 'togliatti', label: 'Тольятти' },
];
const meta = {
  title: 'UI/Components/Select',
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
export const Default: Story = {};
export const Compact: Story = { args: { density: 'compact' } };
export const Regular: Story = { args: { density: 'regular' } };
export const Expanded: Story = { args: { density: 'expanded' } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = {
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
