const orderAddressList = [
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

const orderCityList = [
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
];

export const formOrderMessageActiveText =
  'Домофон работает. Прошу позвонить заранее. Лифт не работает.';

export const formOrderLongAddressText =
  'бульвар 50 лет Октября, д. 6, корп. 13Б, кв 45, п. 3';

export const formOrderDeliveryArgs = {
  typeOrder: 'delivery',
  summ: '0',
  itemsCount: '5',
  allPrice: '1000',
  allPriceWithoutPromo_new: '',
  hours: '',
  list: orderCityList,
  list_address: orderAddressList,
  address: '',
  online: '',
  comment: '',
};

export const formOrderDeliveryActiveArgs = {
  ...formOrderDeliveryArgs,
  summ: '149',
  online: 'Картой на сайте',
  comment: formOrderMessageActiveText,
  address: formOrderLongAddressText,
};

export const formOrderDeliveryActiveCashArgs = {
  ...formOrderDeliveryArgs,
  summ: '149',
  online: 'Наличными курьеру',
  comment: formOrderMessageActiveText,
  address: formOrderLongAddressText,
};

export const formOrderPickupArgs = {
  ...formOrderDeliveryArgs,
  typeOrder: 'pickup',
  list_address: [],
};

export const formOrderPickupActiveArgs = {
  ...formOrderPickupArgs,
  address: 'Ленинградская, 47',
};
