import { TableCartPC } from './TableCartPC';
import * as TableCartPC_body from '../TableCartPC_body/TableCartPC_body.stories';

export default {
  title: 'Cart / Корзина / Table',
  component: TableCartPC,
  tags: ['autodocs'],
  argTypes: {
    data: {
      type: 'array',
      description: 'Данные для коризны',
    },
  },
};

const Template = (args) => <TableCartPC {...args} />;
export const Default = Template.bind({});
export const Active = Template.bind({});
export const Promo = Template.bind({});

Default.args = {
  data: TableCartPC_body.Default.args,
};

Active.args = {
  data: TableCartPC_body.Active.args,
};

Promo.args = {
  data: TableCartPC_body.Promo.args,
};
