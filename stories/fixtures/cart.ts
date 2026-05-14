const tableCartRowItem = {
  last: '',
  title: 'Мадейра сет',
  img_app: 'Madeira_set',
  status_promo: false,
  new_one_price: '',
  disabled: false,
  one_price: '909',
  all_price: '',
  count: '1',
};

const tableCartRowDop = {
  last: '',
  title: 'Соевый соус',
  img_app: 'Soevyi_sous_',
  status_promo: false,
  new_one_price: '',
  disabled: false,
  one_price: '14',
  all_price: '',
  count: '0',
};

const tableCartRowPromo = {
  last: '',
  title: 'Мадейра сет',
  img_app: 'Madeira_set',
  status_promo: true,
  new_one_price: '',
  disabled: true,
  one_price: '909',
  all_price: '890',
  count: '1',
};

const tableCartFootDefault = {
  itemsCount: 0,
  items_on_price: [],
  promoItemsFind: false,
  status_promo: false,
  itemsOffDops: [],
  price1: '0',
  price2: '0',
};

const tableCartFootActive = {
  itemsCount: 10,
  items_on_price: [],
  promoItemsFind: false,
  status_promo: false,
  itemsOffDops: [],
  price1: '1110',
  price2: '2220',
};

const tableCartFootPromo = {
  itemsCount: 2,
  items_on_price: ['item', 'item'],
  promoItemsFind: true,
  status_promo: false,
  itemsOffDops: [],
  price1: '500',
  price2: '600',
};

export const tableCartBodyDefaultArgs = {
  items: [],
  itemsCount: 0,
  dopItems: tableCartRowDop,
  dopItemsCount: 5,
  footerData: tableCartFootDefault,
};

export const tableCartBodyActiveArgs = {
  items: tableCartRowItem,
  itemsCount: 3,
  dopItems: tableCartRowDop,
  dopItemsCount: 5,
  footerData: tableCartFootActive,
};

export const tableCartBodyPromoArgs = {
  items: tableCartRowPromo,
  itemsCount: 3,
  dopItems: tableCartRowDop,
  dopItemsCount: 5,
  footerData: tableCartFootPromo,
};

export const tableCartDefaultArgs = {
  data: tableCartBodyDefaultArgs,
};

export const tableCartActiveArgs = {
  data: tableCartBodyActiveArgs,
};

export const tableCartPromoArgs = {
  data: tableCartBodyPromoArgs,
};

export const cartPromoInputDefaultArgs = {
  itemsCount: 0,
  items_on_price: [],
  promoItemsFind: false,
  status_promo: false,
  allPrice: '0',
  promo: '',
  checkPromo: false,
};

export const cartPromoInputTrueArgs = {
  itemsCount: 0,
  items_on_price: ['item'],
  promoItemsFind: true,
  status_promo: false,
  allPrice: '1000',
  promo: 'КОКОДЖАМБО',
  checkPromo: { st: true },
};

export const cartPromoInputFalseArgs = {
  itemsCount: 0,
  items_on_price: [],
  promoItemsFind: false,
  status_promo: false,
  allPrice: '',
  promo: 'КОКО',
  checkPromo: { st: false },
};

export const cartPromoTextTrueArgs = {
  status_promo: true,
  text: 'позиции Ветчина и сыр 1шт. за 381руб., Мадагаскар сет 1шт. за 1632руб., Гавайская 1шт. за 432руб.',
};

export const cartPromoTextFalseArgs = {
  status_promo: false,
  text: 'Данный промокод не найден или уже активирован',
};

export const cartPanelDefaultArgs = {
  data: tableCartDefaultArgs,
  promo: cartPromoInputDefaultArgs,
  openBasket: true,
  desc: {},
};

export const cartPanelActiveArgs = {
  data: tableCartActiveArgs,
  promo: cartPromoInputDefaultArgs,
  openBasket: true,
  desc: {},
};

export const cartPanelPromoTrueArgs = {
  data: tableCartPromoArgs,
  promo: cartPromoInputTrueArgs,
  openBasket: true,
  desc: cartPromoTextTrueArgs,
};

export const cartPanelPromoFalseArgs = {
  data: tableCartActiveArgs,
  promo: cartPromoInputFalseArgs,
  openBasket: true,
  desc: cartPromoTextFalseArgs,
};
