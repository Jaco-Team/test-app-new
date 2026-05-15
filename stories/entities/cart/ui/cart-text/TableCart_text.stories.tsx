import { TableCart_text } from './TableCart_text';

import { responsiveStoryGlobals } from '@stories/shared/lib/storybook/responsive';
export default {
  title: 'Сущности / Корзина / Текст таблицы',
  component: TableCart_text,
  tags: ['autodocs'],
  argTypes: {
    text: {
      type: 'string',
      description: 'Текст о допах в Корзине',
    },
  },
};

const Template = (args) => <TableCart_text {...args} />;
export const Pizza = Template.bind({});
export const Rolly = Template.bind({});
export const Allergens = Template.bind({});

Pizza.args = {
  text: 'pizza',
};

Rolly.args = {
  text: 'rolly',
};

Allergens.args = {
  text: 'allergens',
};

export const Mobile = Template.bind({});
Mobile.args = Pizza.args;
Mobile.globals = responsiveStoryGlobals.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Pizza.args;
Tablet.globals = responsiveStoryGlobals.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Pizza.args;
Desktop.globals = responsiveStoryGlobals.Desktop;
