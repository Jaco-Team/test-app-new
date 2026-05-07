import React from 'react';

import { MyMenu } from './MyMenu';

export default {
  title: 'Элементы / Меню',
  component: MyMenu,
  tags: ['autodocs'],
  argTypes: {
    list: {
      type: 'object',
      description: 'Список ссылок',
    },
    isOpen: {
      type: 'boolean',
      description: 'Отслеживание открытия меню',
    },
    anchorEl: {
      type: 'node',
      description: 'Открытое меню',
    },
    type: {
      type: 'string',
      description: 'Тип элемента',
    },
  },
};

const list_address = [
  {
    addr_name: '',
    dom_true: '1',
    et: '4',
    free_drive: '0',
    home: '6',
    id: '304972',
    is_main: '0',
    kv: '45',
    name: 'бульвар 50 лет Октября, 6, кв 45',
    name_street: 'бульвар 50 лет Октября',
    pay_active: '1',
    pd: '3',
    point_id: '1',
    street: 'бульвар 50 лет Октября',
    sum_div: '149',
    xy: '["53.529744","49.400729"]',
  },
  {
    addr_name: 'РодителиrrrrfffffffffwW',
    dom_true: '0',
    et: '1',
    free_drive: '0',
    home: '87',
    id: '224908',
    is_main: '1',
    kv: '22',
    name: 'улица Голосова, 87, кв 22',
    pay_active: '1',
    pd: '2',
    point_id: '1',
    street: 'улица Голосоваrrrrrrrrrrrrrrrrrrrrrr',
    sum_div: '149',
    xy: '["53.511237","49.428586"]',
  },
  {
    addr_name: '',
    dom_true: '0',
    et: '1',
    free_drive: '0',
    home: '87',
    id: '224911',
    is_main: '1',
    kv: '22',
    name: 'улица Голосова, 87, кв 22',
    pay_active: '1',
    pd: '2',
    point_id: '1',
    street: 'улица Голосова',
    sum_div: '149',
    xy: '["53.511237","49.428586"]',
  },
  {
    id: '4',
    name: 'Добавить новый адрес',
  },
];

const Template = (args) => <MyMenu {...args} />;
export const Category = Template.bind({});
export const City = Template.bind({});
export const Form_Order_Basic = Template.bind({});
export const Form_Order_Address = Template.bind({});

Category.args = {
  list: [
    { link: 'https://example.com', title: 'Сеты' },
    { link: 'https://example.com', title: 'Фирменные роллы' },
    { link: 'https://example.com', title: 'Жаренные роллы' },
    { link: 'https://example.com', title: 'Запеченные роллы' },
  ],
  onClose: () => {},
  isOpen: true,
  anchorEl: null,
  type: 'cat',
};

City.args = {
  list: [
    { title: 'Тольятти' },
    { title: 'Самара' },
    { title: 'Комсомольск-на-Амуре' },
  ],
  onClose: () => {},
  isOpen: true,
  anchorEl: null,
  type: 'city',
};

Form_Order_Basic.args = {
  list: [
    {
      id: '1',
      name: 'Тольятти',
      link: 'togliatti',
    },
    {
      id: '2',
      name: 'Самара',
      link: 'samara',
    },
  ],
  onClose: () => {},
  isOpen: true,
  anchorEl: null,
  type: 'form_order',
};

Form_Order_Address.args = {
  list: list_address,
  onClose: () => {},
  isOpen: true,
  anchorEl: null,
  type: 'form_order',
};
