import type { OrderReviewFormData } from '@/modules/clientFeedback/orderReview';

export const orderReviewFixture: OrderReviewFormData = {
  st: true,
  submitted: false,
  feedback_ids: [],
  order: {
    point_id: 7,
    order_id: 44127,
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
      elements: [
        {
          id: 'order-rating',
          type: 'rating',
          answerable: true,
          data: { title: 'Как вам заказ?', required: true },
        },
        {
          id: 'order-positive',
          type: 'tagCloud',
          answerable: true,
          data: {
            title: 'Что особенно понравилось?',
            availableTags: ['Вкус', 'Температура', 'Упаковка', 'Комплектация'],
            conditions: { stars: [4, 5] },
          },
        },
        {
          id: 'order-negative',
          type: 'checkboxGroup',
          answerable: true,
          data: {
            title: 'Что нам улучшить?',
            checkboxes: [
              { label: 'Вкус блюд', param: 'order_taste' },
              { label: 'Температуру блюд', param: 'order_temperature' },
              { label: 'Упаковку', param: 'order_packaging' },
            ],
            conditions: { stars: [1, 2, 3] },
          },
        },
        {
          id: 'order-heading',
          type: 'heading',
          answerable: false,
          data: { text: 'Ваш комментарий поможет нам стать лучше' },
        },
        {
          id: 'order-comment',
          type: 'textarea',
          answerable: true,
          data: {
            title: 'Комментарий',
            placeholder: 'Расскажите подробнее',
          },
        },
      ],
    },
    {
      target_id: -1,
      target_type: 'order_type',
      name: 'Доставка',
      category_name: '',
      form_id: 26,
      type_id: 3,
      elements: [
        {
          id: 'delivery-rating',
          type: 'rating',
          answerable: true,
          data: { title: 'Оцените доставку' },
        },
        {
          id: 'courier-contact',
          type: 'checkbox',
          answerable: true,
          data: { label: 'Курьер был вежлив' },
        },
      ],
    },
    {
      target_id: 321,
      target_type: 'product',
      name: 'Запечённый ролл',
      category_name: 'Роллы',
      form_id: 25,
      type_id: 4,
      elements: [
        {
          id: 'product-rating',
          type: 'rating',
          answerable: true,
          data: { title: 'Оцените блюдо' },
        },
        {
          id: 'product-comment',
          type: 'input',
          answerable: true,
          data: { title: 'Короткий комментарий' },
        },
        {
          id: 'product-discount',
          type: 'discount',
          answerable: false,
          data: { title: 'Скидка' },
        },
      ],
    },
  ],
};
