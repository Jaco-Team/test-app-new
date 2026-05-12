import { TableCartPC_text } from './TableCartPC_text';

import { responsiveStoryParameters } from '../../../../shared/lib/storybook/responsive';
export default {
  title: 'Cart / ПК / Корзина / Table / Text',
  component: TableCartPC_text,
  tags: ['autodocs'],
  argTypes: {
    text: {
      type: 'string',
      description: 'Текст о допах в Корзине',
    },
  },
};

const Template = (args) => <TableCartPC_text {...args} />;
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
Mobile.parameters = responsiveStoryParameters.Mobile;

export const Tablet = Template.bind({});
Tablet.args = Pizza.args;
Tablet.parameters = responsiveStoryParameters.Tablet;

export const Desktop = Template.bind({});
Desktop.args = Pizza.args;
Desktop.parameters = responsiveStoryParameters.Desktop;
