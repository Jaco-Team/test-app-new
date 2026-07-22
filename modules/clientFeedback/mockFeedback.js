const commonPositiveTags = [
  'Вкус и качество блюд',
  'Быстрая доставка',
  'Внешний вид блюда',
  'Общение с курьером',
  'Температура блюда',
  'Удобство упаковки',
];

const commonNegativeTags = [
  'Долго ждал заказ',
  'Блюда были холодными',
  'Неудобная упаковка',
  'Внешний вид блюда',
  'Общение с курьером',
];

function feedbackElements(prefix, positiveTags = commonPositiveTags) {
  return [
    {
      id: `${prefix}-rating`,
      type: 'rating',
      data: { value: 0 },
      answerable: true,
    },
    {
      id: `${prefix}-positive-tags`,
      type: 'tagCloud',
      data: {
        title: 'Спасибо! Что вам особенно понравилось?',
        availableTags: positiveTags,
        showWhen: 'positive',
      },
      answerable: true,
    },
    {
      id: `${prefix}-negative-tags`,
      type: 'tagCloud',
      data: {
        title: 'Расскажите, что не понравилось',
        availableTags: commonNegativeTags,
        showWhen: 'negative',
      },
      answerable: true,
    },
    {
      id: `${prefix}-comment`,
      type: 'textarea',
      data: {
        label: 'Ваш комментарий',
        placeholder: 'Напишите подробнее',
      },
      answerable: true,
    },
  ];
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
      form_id: 24,
      type_id: 4,
      elements: feedbackElements('order'),
    },
    {
      target_id: -1,
      target_type: 'order_type',
      name: 'Доставка',
      category_name: '',
      form_id: 25,
      type_id: 3,
      elements: feedbackElements('delivery', [
        'Быстро доставили',
        'Вежливый курьер',
        'Заказ был горячим',
        'Аккуратная доставка',
      ]),
    },
    {
      target_id: 321,
      target_type: 'product',
      name: 'Запечённый ролл',
      category_name: 'Роллы',
      form_id: 26,
      type_id: 1,
      image: '/feedback/roll.jpg',
      elements: feedbackElements('dish-321', [
        'Вкусно',
        'Красивая подача',
        'Свежие ингредиенты',
        'Хорошая порция',
      ]),
    },
    {
      target_id: 322,
      target_type: 'product',
      name: 'Комбо «Хороший день»',
      category_name: 'Комбо',
      form_id: 24,
      type_id: 4,
      image: '/feedback/combo.jpg',
      elements: feedbackElements('dish-322'),
    },
    {
      target_id: 323,
      target_type: 'product',
      name: 'Пицца Жако',
      category_name: 'Пицца',
      form_id: 24,
      type_id: 4,
      image: '/feedback/pizza.jpg',
      elements: feedbackElements('dish-323'),
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
    feedback_ids: [501, 502, 503],
    already_existed: false,
  };
}
