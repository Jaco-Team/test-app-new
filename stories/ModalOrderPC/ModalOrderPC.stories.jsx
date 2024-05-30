import { ModalOrderPC } from './ModalOrderPC';

export default {
  title: 'Профиль / Заказы / Модалка заказа',
  component: ModalOrderPC,
  tags: ['autodocs'],
  argTypes: {
    city: {
      type: 'string',
      description: 'Название города',
    },
    modalOrder: {
      type: 'object',
      description: 'Данные заказа',
    },
    isShowAddr: {
      type: 'boolean',
      description: 'Видимость адреса доставки',
    },
  },
};

const modalOrder = {
  order: {
    order_id: '609332',
    point_name: 'Ленинградская 47',
    sum_order: '1286',
    sum_div: '149',
    close_date_time: '17:01',
    del_date_time: null,
    type_order_: '1',
    status_order: '6',
    point_id: '1',
    is_delete: '0',
    online_pay: '1',
    street: 'бульвар 50 лет Октября',
    home: '6',
    pd: '3',
    kv: '45',
    et: '4',
    fake_dom: '1',
    comment: '',
    sdacha: '0',
    time_order: '2024-01-02 15:32:13',
    is_preorder: '0',
    promo_name: '7УТ4Б',
    promo_id: '1307414',
    promo_text:
      'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
    unix_time_to_client: '60-90',
    date_time_order: '2024-01-02 15:32:13',
    city_name: 'Тольятти',
    max_time_order: '17:02',
    date_time_order_new: '02 Января 15:32',
    this_status_order: 'доставлен',
    types: {
      type1: 1,
      type2: 1,
      type3: 1,
      type4: 1,
    },
    street_info: {
      id: '304972',
      name_street: 'бульвар 50 лет Октября',
      street: 'бульвар 50 лет Октября',
      home: '6',
      point_id: '1',
      xy: '["53.529744","49.400729"]',
      kv: '45',
      pd: '3',
      et: '4',
      dom_true: '1',
      fake_dom: '1',
      addr_name: '',
      city_name: 'Тольятти',
      sum_div: '149',
      free_drive: '0',
      name: 'бульвар 50 лет Октября, 6, кв 45',
    },
  },
  order_items: [
    {
      id: '2740515',
      name: 'Соевый соус ',
      item_id: '19',
      count: '1',
      price: '14',
    },
    {
      id: '2740516',
      name: 'Жако салат',
      item_id: '82',
      count: '1',
      price: '188',
    },
    {
      id: '2740517',
      name: 'Скала сет',
      item_id: '126',
      count: '1',
      price: '935',
    },
    {
      id: '2740517',
      name: 'Калифорния с лососем запечённый спайси',
      item_id: '126',
      count: '15',
      price: '535',
    },
  ],
};

const modalOrder_active = {
  order: {
    order_id: '609332',
    point_name: 'Ленинградская 47',
    sum_order: '1286',
    sum_div: '149',
    close_date_time: '17:01',
    del_date_time: null,
    type_order_: '1',
    status_order: '3',
    point_id: '1',
    is_delete: '0',
    online_pay: '1',
    street: 'бульвар 50 лет Октября',
    home: '6',
    pd: '3',
    kv: '45',
    et: '4',
    fake_dom: '1',
    comment: '',
    sdacha: '0',
    time_order: '2024-01-02 15:32:13',
    is_preorder: '0',
    promo_name: '7УТ4Б',
    promo_id: '1307414',
    promo_text:
      'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
    unix_time_to_client: '60-90',
    date_time_order: '2024-01-02 15:32:13',
    city_name: 'Тольятти',
    max_time_order: '17:02',
    date_time_order_new: '02 Января 15:32',
    this_status_order: 'везем',
    types: {
      type1: 1,
      type2: 1,
      type3: 1,
      type4: 2,
    },
    street_info: {
      id: '304972',
      name_street: 'бульвар 50 лет Октября',
      street: 'бульвар 50 лет Октября',
      home: '6',
      point_id: '1',
      xy: '["53.529744","49.400729"]',
      kv: '45',
      pd: '3',
      et: '4',
      dom_true: '1',
      fake_dom: '1',
      addr_name: '',
      city_name: 'Тольятти',
      sum_div: '149',
      free_drive: '0',
      name: 'бульвар 50 лет Октября, 6, кв 45',
    },
  },
  order_items: [
    {
      id: '2740515',
      name: 'Соевый соус ',
      item_id: '19',
      count: '1',
      price: '14',
    },
    {
      id: '2740516',
      name: 'Жако салат',
      item_id: '82',
      count: '1',
      price: '188',
    },
    {
      id: '2740517',
      name: 'Скала сет',
      item_id: '126',
      count: '1',
      price: '935',
    },
    {
      id: '2740517',
      name: 'Калифорния с лососем запечённый спайси',
      item_id: '126',
      count: '15',
      price: '535',
    },
  ],
};

const modalOrder_picup = {
  order: {
    order_id: '609332',
    point_name: 'Ленинградская 47',
    sum_order: '1286',
    sum_div: '149',
    close_date_time: '17:01',
    del_date_time: null,
    type_order_: '',
    status_order: '4',
    point_id: '1',
    is_delete: '0',
    online_pay: '1',
    street: 'бульвар 50 лет Октября',
    home: '6',
    pd: '3',
    kv: '45',
    et: '4',
    fake_dom: '1',
    comment: '',
    sdacha: '0',
    time_order: '2024-01-02 15:32:13',
    is_preorder: '0',
    promo_name: '7УТ4Б',
    promo_id: '1307414',
    promo_text:
      'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
    unix_time_to_client: '60-90',
    date_time_order: '2024-01-02 15:32:13',
    city_name: 'Тольятти',
    max_time_order: '17:02',
    date_time_order_new: '02 Января 15:32',
    this_status_order: 'готов',
    types: {
      type1: 1,
      type2: 1,
      type3: 1,
      type4: 1,
    },
    street_info: {
      id: '304972',
      name_street: 'бульвар 50 лет Октября',
      street: 'бульвар 50 лет Октября',
      home: '6',
      point_id: '1',
      xy: '["53.529744","49.400729"]',
      kv: '45',
      pd: '3',
      et: '4',
      dom_true: '1',
      fake_dom: '1',
      addr_name: '',
      city_name: 'Тольятти',
      sum_div: '149',
      free_drive: '0',
      name: 'бульвар 50 лет Октября, 6, кв 45',
    },
  },
  order_items: [
    {
      id: '2740515',
      name: 'Соевый соус ',
      item_id: '19',
      count: '1',
      price: '14',
    },
    {
      id: '2740516',
      name: 'Жако салат',
      item_id: '82',
      count: '1',
      price: '188',
    },
    {
      id: '2740517',
      name: 'Скала сет',
      item_id: '126',
      count: '1',
      price: '935',
    },
    {
      id: '2740517',
      name: 'Калифорния с лососем запечённый спайси',
      item_id: '126',
      count: '15',
      price: '535',
    },
  ],
};

const Template = (args) => <ModalOrderPC {...args} />;
export const Delivery = Template.bind({});
export const Pikcup = Template.bind({});
export const Active = Template.bind({});
export const Long_title_city = Template.bind({});
export const Show_address = Template.bind({});

Delivery.args = {
  modalOrder,
  isShowAddr: false,
  city: 'Тольятти',
};

Pikcup.args = {
  modalOrder: modalOrder_picup,
  isShowAddr: true,
  city: 'Тольятти',
};

Active.args = {
  modalOrder: modalOrder_active,
  isShowAddr: false,
  city: 'Тольятти',
};

Long_title_city.args = {
  modalOrder,
  isShowAddr: false,
  city: 'Комсомольск-на-Амуре',
};

Show_address.args = {
  modalOrder,
  isShowAddr: true,
  city: 'Комсомольск-на-Амуре',
};
