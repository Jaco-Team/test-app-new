import { ProfileAddrPC } from './ProfileAddrPC';

export default {
  title: 'Профиль / Личные данные / Адрес клиента',
  component: ProfileAddrPC,
  tags: ['autodocs'],
  argTypes: {
    address: {
      type: 'object',
      description: 'Данные адреса клиента',
    },
  },
};

const address = {
  id: '369252',
  city: 'togliatti',
  name_street: 'бульвар 50 лет Октября',
  street: 'бульвар 50 лет Октября',
  home: '6',
  kv: '45',
  city_name: 'Тольятти',
  city_name_dop: '',
  is_main: '0',
};

const address_main = {
  id: '224908',
  city: 'togliatti',
  name_street: 'улица Голосова',
  street: 'улица Голосова',
  home: '87',
  kv: '22',
  city_name: 'Тольятти',
  city_name_dop: '',
  is_main: '1',
};

const Template = (args) => <ProfileAddrPC {...args} />;
export const Default = Template.bind({});
export const Main = Template.bind({});

Default.args = {
  address,
};

Main.args = {
  address: address_main,
};
