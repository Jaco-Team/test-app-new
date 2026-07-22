const orderPositiveOptions = [
  ['Вкус блюд', 'site_order_taste_positive'],
  ['Температура блюд', 'site_order_temperature_positive'],
  ['Внешний вид блюд', 'site_order_appearance_positive'],
  ['Размер порции', 'site_order_portion_positive'],
  ['Упаковка', 'site_order_packaging_positive'],
  ['Комплектация заказа', 'site_order_accuracy_positive'],
];

const orderNegativeOptions = [
  ['Вкус блюд', 'site_order_taste_negative'],
  ['Температуру блюд', 'site_order_temperature_negative'],
  ['Внешний вид блюд', 'site_order_appearance_negative'],
  ['Размер порции', 'site_order_portion_negative'],
  ['Упаковку', 'site_order_packaging_negative'],
  ['Комплектацию заказа', 'site_order_accuracy_negative'],
];

const productPositiveOptions = [
  ['Понравился вкус', 'site_product_taste_positive'],
  ['Подходящая температура', 'site_product_temperature_positive'],
  ['Аппетитный внешний вид', 'site_product_appearance_positive'],
  ['Хороший размер порции', 'site_product_portion_positive'],
];

const productNegativeOptions = [
  ['Не понравился вкус', 'site_product_taste_negative'],
  ['Блюдо было холодным', 'site_product_temperature_negative'],
  ['Не понравился внешний вид', 'site_product_appearance_negative'],
  ['Маленькая порция', 'site_product_portion_negative'],
];

const deliveryPositiveOptions = [
  ['Быстро доставили', 'site_delivery_speed_positive'],
  ['Вежливый курьер', 'site_delivery_courier_positive'],
  ['Заказ доставили аккуратно', 'site_delivery_care_positive'],
  ['Курьер был на связи', 'site_delivery_contact_positive'],
];

const deliveryNegativeOptions = [
  ['Долго доставляли', 'site_delivery_speed_negative'],
  ['Проблема в общении с курьером', 'site_delivery_courier_negative'],
  ['Заказ повредили при доставке', 'site_delivery_care_negative'],
  ['Не удалось связаться с курьером', 'site_delivery_contact_negative'],
];

function checkboxes(options) {
  return options.map(([label, param]) => ({
    id: `preset-${param}`,
    label,
    param,
  }));
}

function reasonGroup(id, title, stars, options) {
  return {
    id,
    type: 'checkboxGroup',
    data: {
      title,
      checkboxes: checkboxes(options),
      conditions: { stars, products: [], categories: [] },
      showWhen: stars.includes(4) ? 'positive' : 'negative',
    },
    answerable: true,
  };
}

function ratingElement(id) {
  return {
    id,
    type: 'rating',
    data: { value: 0 },
    answerable: true,
  };
}

function feedbackElements(
  prefix,
  positiveOptions,
  negativeOptions,
  withComment = false
) {
  const elements = [
    ratingElement(`${prefix}-rating`),
    reasonGroup(
      `${prefix}-positive-reasons`,
      'Что особенно понравилось?',
      [4, 5],
      positiveOptions
    ),
    reasonGroup(
      `${prefix}-negative-reasons`,
      'Что нам улучшить?',
      [1, 2, 3],
      negativeOptions
    ),
  ];

  if (withComment) {
    elements.push({
      id: `${prefix}-comment`,
      type: 'textarea',
      data: {
        title: 'Расскажите подробнее',
        placeholder: 'Комментарий необязателен',
      },
      answerable: true,
    });
  }

  return elements;
}

export const mockFeedbackForm = {
  st: true,
  submitted: false,
  feedback_ids: [],
  order: {
    point_id: 7,
    order_id: 11234,
    status_order: 6,
    type_order: 1,
  },
  targets: [
    {
      target_id: -100,
      target_type: 'order',
      name: 'Общая оценка',
      category_name: '',
      form_id: 25,
      type_id: 4,
      elements: feedbackElements(
        'site-order',
        orderPositiveOptions,
        orderNegativeOptions,
        true
      ),
    },
    {
      target_id: -1,
      target_type: 'order_type',
      name: 'Доставка',
      category_name: '',
      form_id: 26,
      type_id: 3,
      elements: feedbackElements(
        'site-delivery',
        deliveryPositiveOptions,
        deliveryNegativeOptions
      ),
    },
    {
      target_id: 321,
      target_type: 'product',
      name: 'Запечённый ролл',
      category_name: 'Роллы',
      form_id: 25,
      type_id: 4,
      image: '/feedback/roll.jpg',
      elements: feedbackElements(
        'site-product',
        productPositiveOptions,
        productNegativeOptions
      ),
    },
    {
      target_id: 322,
      target_type: 'product',
      name: 'Комбо «Хороший день»',
      category_name: 'Комбо',
      form_id: 25,
      type_id: 4,
      image: '/feedback/combo.jpg',
      elements: feedbackElements(
        'site-product',
        productPositiveOptions,
        productNegativeOptions
      ),
    },
    {
      target_id: 323,
      target_type: 'product',
      name: 'Пицца Жако',
      category_name: 'Пицца',
      form_id: 25,
      type_id: 4,
      image: '/feedback/pizza.jpg',
      elements: feedbackElements(
        'site-product',
        productPositiveOptions,
        productNegativeOptions
      ),
    },
  ],
};

export const mockOrderHistory = [
  {
    order_id: 11234,
    status: 'Доставлен сегодня в 19:03',
    rating: 0,
    total: '4 240 ₽',
  },
  {
    order_id: 11233,
    status: 'Доставлен 12 апреля в 18:40',
    rating: 5,
    total: '14 730 ₽',
  },
];

export function createMockSubmitResult() {
  return {
    st: true,
    feedback_ids: [501, 502],
    already_existed: false,
  };
}
