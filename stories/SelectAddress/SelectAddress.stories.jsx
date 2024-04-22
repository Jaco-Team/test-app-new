import { SelectAddress } from './SelectAddress';

export default {
  title: 'Header / Модалка выбора адреса клиента',
  component: SelectAddress,
  tags: ['autodocs'],
  argTypes: {
    list: {
      type: 'array',
      description: 'Список адресов',
    },
  },
};

const Template = (args) => <SelectAddress {...args} />;
export const Default = Template.bind({});

Default.args = {
  list: [
    { addressLine: 'Россия, Самара, посёлок Соцгород, Зелёная улица, 5, подъезд 1' },
    { addressLine: 'Россия, Самара, посёлок Сорокины Хутора, Зелёная улица, 5' },
  ],
};
