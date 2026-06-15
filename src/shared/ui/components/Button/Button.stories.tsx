import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Inline } from '../../primitives';
import { Button } from './Button';

const compactViewport = {
  viewport: {
    defaultViewport: 'mobileMin',
  },
} as const;

const regularViewport = {
  viewport: {
    defaultViewport: 'tabletMin',
  },
} as const;

const expandedViewport = {
  viewport: {
    defaultViewport: 'desktopMin',
  },
} as const;

const meta = {
  title: 'UI/Компоненты/Кнопка',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: 'Оформить заказ' },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ПоУмолчанию: Story = { name: 'По умолчанию' };
export const Компактная: Story = {
  name: 'Компактная',
  args: { size: 'sm', children: 'Добавить' },
  parameters: compactViewport,
};
export const Обычная: Story = {
  name: 'Обычная',
  args: { size: 'md', children: '349 ₽' },
  parameters: regularViewport,
};
export const Расширенная: Story = {
  name: 'Расширенная',
  args: { size: 'xl', children: 'В корзину за 1 349 ₽' },
  parameters: expandedViewport,
};
export const Активная: Story = {
  name: 'Активная',
  args: { active: true, children: 'Активно' },
};
export const Недоступная: Story = {
  name: 'Недоступная',
  args: { disabled: true, children: 'Недоступно' },
};
export const ДлинныйТекст: Story = {
  name: 'Длинный текст',
  args: {
    children: 'Очень длинная кнопка для проверки переполнения текста',
    size: 'xl',
  },
};
export const Варианты: Story = {
  name: 'Варианты',
  render: () => (
    <Stack gap="sm">
      <Inline wrap>
        <Button tone="primary">Основная</Button>
        <Button tone="secondary">Вторичная</Button>
        <Button tone="neutral">Нейтральная</Button>
        <Button tone="muted">Цена</Button>
        <Button tone="cart">Корзина</Button>
      </Inline>
      <Inline wrap>
        <Button size="sm">Меньше</Button>
        <Button>База</Button>
        <Button size="xl">Больше</Button>
      </Inline>
    </Stack>
  ),
};
