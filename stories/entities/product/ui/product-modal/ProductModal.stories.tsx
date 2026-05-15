import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
import { morskoiProductModalArgs } from '@stories/fixtures/product-modal';
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
Default.args = morskoiProductModalArgs;

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
