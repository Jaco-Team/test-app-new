import type { Meta, StoryObj } from '@storybook/react';
import { Inline } from '../../primitives';
import { IconClose, BasketIconNew, BurgerIcon } from '../../icons';
import { IconButton } from './IconButton';
const meta = {
  title: 'UI/Компоненты/Иконка-кнопка',
  component: IconButton,
  parameters: { layout: 'centered' },
  args: { label: 'Закрыть', children: <IconClose /> },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = {};
export const Компактный: Story = { args: { size: 'sm' } };
export const Обычный: Story = { args: { size: 'md' } };
export const Крупный: Story = { args: { size: 'lg' } };
export const Активная: Story = { args: { active: true } };
export const Недоступный: Story = { args: { disabled: true } };
export const Варианты: Story = {
  render: () => (
    <Inline>
      <IconButton label="Меню">
        <BurgerIcon />
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
