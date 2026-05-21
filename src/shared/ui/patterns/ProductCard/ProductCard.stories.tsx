import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ProductCard } from './ProductCard';
import './ProductCard.story.scss';

const sample = {
  title: 'Мадейра сет',
  image: 'https://cdnimg.jacofood.ru/menu/product/madejra-set_732x732.jpg',
  meta: ['4 ролла', '32 шт.', '1 115 г'],
  description:
    'Цезарь с курицей запечённый унаги, Коралл, Коралл запечённый унаги, Алоха',
  price: 1349,
  badges: [{ tone: 'new' as const, label: 'НОВИНКА' }],
};

const meta = {
  title: 'UI/Паттерны/Карточка продукта',
  component: ProductCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="ui-product-card-story">
        <Story />
      </div>
    ),
  ],
  args: sample,
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ПоУмолчанию: Story = { name: 'По умолчанию' };
export const ВКорзине: Story = {
  name: 'В корзине',
  render: (args) => {
    const [count, setCount] = useState(1);
    return <ProductCard {...args} count={count} onQuantityChange={setCount} />;
  },
};
export const Скидка: Story = {
  name: 'Скидка',
  args: {
    price: 1299,
    oldPrice: 1499,
    badges: [{ tone: 'sale', label: 'СКИДКА' }],
  },
};
