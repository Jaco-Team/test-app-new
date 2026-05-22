import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { productCardFixtures } from '../../fixtures/productFixtures';
import { ProductCard } from './ProductCard';
import './ProductCard.story.scss';

const sample = productCardFixtures.madeiraSet;

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
