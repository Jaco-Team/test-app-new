import { TableCartPC_text } from './TableCartPC_text';

export default {
  title: 'Cart / Корзина / Table / Text',
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

Pizza.args = {
  text: 'pizza',
};

Rolly.args = {
  text: 'rolly',
};
