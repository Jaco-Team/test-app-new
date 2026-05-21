import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Text } from '../../primitives';

const meta = {
  title: 'UI/Компоненты/Карточка',
  component: Card,
  parameters: { layout: 'centered' },
  args: {
    tone: 'outlined',
    padding: 'md',
    children: <Text variant="title">Карточка</Text>,
  },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = { name: 'По умолчанию' };
export const Приглушённая: Story = {
  name: 'Приглушённая',
  args: { tone: 'muted' },
};
export const СТенью: Story = { name: 'С тенью', args: { tone: 'elevated' } };
