import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import ProductModal from '@stories/entities/product/ui/product-modal/ProductModal';
import { ProductModalProps } from '@stories/entities/product/ui/product-modal/model/types';

export default {
  title: 'Сущности / Товар / Модалка',
  component: ProductModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
    productImage: { control: 'text' },
    productName: { control: 'text' },
    rollsCount: { control: 'number' },
    piecesCount: { control: 'number' },
    weight: { control: 'number' },
    productDescription: { control: 'text' },
    price: { control: 'number' },
    rollsData: { control: 'object' },
    relatedProducts: { control: 'object' },
  },
} as Meta<ProductModalProps>;

const Template: StoryFn<ProductModalProps> = (args) => (
  <ProductModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  onClose: () => {},
  productImage: 'https://mainimg.jacofood.ru/Morskoi_set_732x732.webp',
  productName: 'Морской сет',
  rollsCount: 4,
  piecesCount: 32,
  weight: 1122,
  productDescription:
    'Жако Люкс, Филадельфия Лайт, Цезарь с лососем запечённый унаги, Калифорния с креветкой запечённый унаги',
  price: 1489,
  rollsData: [
    {
      id: 1,
      name: 'Цезарь с курицей запечённый унаги',
      description:
        'Куринное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом',
      image: 'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg',
      calories: 191,
      ingredients:
        'куриное филе, салат айсберг, творожный сыр, соус с сыром, соус унаги, кунжут',
      nutrition: {
        proteins: 7.1,
        fats: 8.0,
        carbohydrates: 22.9,
      },
    },
    {
      id: 2,
      name: 'Филадельфия Лайт',
      description:
        'Нежное сочетание тающего во рту слабосолёного лосося и творожного сыра с приятным сливочным послевкусием',
      image: 'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg',
      calories: 175,
      ingredients: 'слабосолёный лосось, творожный сыр',
      nutrition: {
        proteins: 5.9,
        fats: 9.6,
        carbohydrates: 16.3,
      },
    },
    {
      id: 3,
      name: 'Аквиланг запечённый унаги',
      description:
        'Отборная креветка, нежный творожный сыр, румяная сырная шапочка с сладким унаги и ароматным кунжутом',
      image: 'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg',
      calories: 220,
      ingredients:
        'отборная креветка, творожный сыр, соус с сыром, соус унаги, кунжут',
      nutrition: {
        proteins: 6.7,
        fats: 11.7,
        carbohydrates: 22.1,
      },
    },
    {
      id: 4,
      name: 'Калифорния с лососем Люкс',
      description:
        'Классический ролл с лососем, авокадо и огурцом в икре тобико',
      image: 'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg',
      calories: 185,
      ingredients: 'лосось, авокадо, огурец, икра тобико, рис, нори',
      nutrition: {
        proteins: 6.2,
        fats: 7.5,
        carbohydrates: 24.3,
      },
    },
  ],
  relatedProducts: [
    {
      id: 1,
      name: 'Цезарь с курицей запечённый унаги, Коралл, Коралл запечённый унаги, Алоха',
      description: '',
      price: 1115,
      image: '/images/related-1.jpg',
      rollsCount: 4,
      piecesCount: 32,
      weight: 1115,
    },
    {
      id: 2,
      name: 'Гаваи жареный, Мачете жареный, Везувий запечённый унаги, Лава запечённый унаги',
      description: '',
      price: 1227,
      image: '/images/related-2.jpg',
      rollsCount: 4,
      piecesCount: 32,
      weight: 1227,
    },
    {
      id: 3,
      name: 'Цезарь с курицей запечённый унаги, Филадельфия Лайт, Акваванг запечённый унаги, Калифорния с лососем Люкс',
      description: '',
      price: 1129,
      image: '/images/related-3.jpg',
      rollsCount: 4,
      piecesCount: 32,
      weight: 1129,
    },
    {
      id: 4,
      name: 'Жако Люкс, Филадельфия Лайт, Цезарь с лососем запечённый унаги, Калифорния с креветкой запечённый унаги',
      description: '',
      price: 1122,
      image: '/images/related-4.jpg',
      rollsCount: 4,
      piecesCount: 32,
      weight: 1122,
    },
  ],
};

export const Closed = Template.bind({});
Closed.args = {
  ...Default.args,
  isOpen: false,
};

export const Mobile = Template.bind({});
Mobile.args = Default.args;
Mobile.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
};
Mobile.globals = responsiveStoryGlobals?.Mobile || {};

export const Tablet = Template.bind({});
Tablet.args = Default.args;
Tablet.parameters = {
  viewport: {
    defaultViewport: 'tablet',
  },
};
Tablet.globals = responsiveStoryGlobals?.Tablet || {};

export const Desktop = Template.bind({});
Desktop.args = Default.args;
Desktop.parameters = {
  viewport: {
    defaultViewport: 'desktop',
  },
};
Desktop.globals = responsiveStoryGlobals?.Desktop || {};
