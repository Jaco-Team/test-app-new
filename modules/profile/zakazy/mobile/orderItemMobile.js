import React from 'react';

import { useProfileStore } from '@/components/store.js';

import { ArrowRightMobile, CheckOrderMobile, CalendarOrderMobile, DeleteOrderMobile, CookOrderMobile, EllipseOrderMobile, ErrorOrderMobile } from '@/ui/Icons.js';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

function areEqual(prevProps, nextProps) {
  return parseInt(nextProps.order?.is_delete) === parseInt(prevProps.order?.is_delete) || parseInt(nextProps.order?.type_status) === parseInt(prevProps.order?.type_status);
}

const testOrders = [
  {
    order: {
      order_id: '565480',
      sum_order: '979',
      sum_div: '129',
      type_order_: '1',
      status_order: '2',
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
      time_order: '2023-08-25 20:17:58',
      is_preorder: '0',
      promo_name: '7УТ4Б',
      promo_text:
        'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
      unix_time_to_client: '120-150',
      date_time_order: '2023-08-25 20:17:58',
      city_name: 'Тольятти',
      max_time_order: '22:47',
      date_time_order_new: '25 Августа 20:17',
      this_status_order: 'на кухне',
      types: {
        type1: 1,
        type2: 0,
        type3: -1,
        type4: -1,
      },
    },
    order_items: [
      {
        id: '2530881',
        name: 'Цезарь с курицей',
        item_id: '41',
        count: '2',
        price: '318',
      },
      {
        id: '2530883',
        name: 'Калифорния с лососем запечённый спайси',
        item_id: '270',
        count: '2',
        price: '12500',
      },
      {
        id: '2530882',
        name: 'Паста с курицей и беконом',
        item_id: '82',
        count: '1',
        price: '172',
      },
      {
        id: '2530883',
        name: 'Паста с беконом',
        item_id: '270',
        count: '2',
        price: '360',
      },
    ],
  },
  {
    order: {
      order_id: '565480',
      sum_order: '979',
      sum_div: '129',
      type_order_: '0',
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
      time_order: '2023-08-25 20:17:58',
      is_preorder: '0',
      promo_name: '7УТ4Б',
      promo_text:
        'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
      unix_time_to_client: '120-150',
      date_time_order: '2023-08-25 20:17:58',
      city_name: 'Тольятти',
      max_time_order: '22:47',
      date_time_order_new: '25 Августа 20:17',
      this_status_order: 'готовим',
      types: {
        type1: 1,
        type2: 1,
        type3: 0,
        type4: -1,
      },
    },
    order_items: [
      {
        id: '2530881',
        name: 'Цезарь с курицей',
        item_id: '41',
        count: '2',
        price: '318',
      },
      {
        id: '2530882',
        name: 'Жако салат',
        item_id: '82',
        count: '1',
        price: '172',
      },
      {
        id: '2530883',
        name: 'Паста с беконом',
        item_id: '270',
        count: '2',
        price: '360',
      },
    ],
  },
  {
    order: {
      order_id: '565480',
      sum_order: '979',
      sum_div: '129',
      type_order_: '0',
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
      time_order: '2023-08-25 20:17:58',
      is_preorder: '0',
      promo_name: '7УТ4Б',
      promo_text:
        'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
      unix_time_to_client: '120-150',
      date_time_order: '2023-08-25 20:17:58',
      city_name: 'Тольятти',
      max_time_order: '22:47',
      date_time_order_new: '25 Августа 20:17',
      this_status_order: 'готов',
      types: {
        type1: 1,
        type2: 1,
        type3: 1,
        type4: 0,
      },
    },
    order_items: [
      {
        id: '2530881',
        name: 'Цезарь с курицей',
        item_id: '41',
        count: '2',
        price: '318',
      },
      {
        id: '2530882',
        name: 'Жако салат',
        item_id: '82',
        count: '1',
        price: '172',
      },
      {
        id: '2530883',
        name: 'Паста с беконом',
        item_id: '270',
        count: '2',
        price: '360',
      },
    ],
  },
  {
    order: {
      order_id: '565480',
      sum_order: '979',
      sum_div: '129',
      type_order_: '1',
      status_order: '5',
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
      time_order: '2023-08-25 20:17:58',
      is_preorder: '0',
      promo_name: '7УТ4Б',
      promo_text:
        'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
      unix_time_to_client: '120-150',
      date_time_order: '2023-08-25 20:17:58',
      city_name: 'Тольятти',
      max_time_order: '22:47',
      date_time_order_new: '25 Августа 20:17',
      this_status_order: 'доставили',
      types: {
        type1: 1,
        type2: 1,
        type3: 1,
        type4: 1,
      },
    },
    order_items: [
      {
        id: '2530881',
        name: 'Цезарь с курицей',
        item_id: '41',
        count: '2',
        price: '318',
      },
      {
        id: '2530882',
        name: 'Жако салат',
        item_id: '82',
        count: '1',
        price: '172',
      },
      {
        id: '2530883',
        name: 'Паста с беконом',
        item_id: '270',
        count: '2',
        price: '360',
      },
    ],
  },
  {
    order: {
      order_id: '565480',
      sum_order: '979',
      sum_div: '129',
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
      time_order: '2023-08-25 20:17:58',
      is_preorder: '0',
      promo_name: '7УТ4Б',
      promo_text:
        'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
      unix_time_to_client: '120-150',
      date_time_order: '2023-08-25 20:17:58',
      city_name: 'Тольятти',
      max_time_order: '22:47',
      date_time_order_new: '25 Августа 20:17',
      this_status_order: 'доставлен',
      types: {
        type1: 1,
        type2: 1,
        type3: 1,
        type4: 1,
      },
    },
    order_items: [
      {
        id: '2530881',
        name: 'Цезарь с курицей',
        item_id: '41',
        count: '2',
        price: '318',
      },
      {
        id: '2530882',
        name: 'Жако салат',
        item_id: '82',
        count: '1',
        price: '172',
      },
      {
        id: '2530883',
        name: 'Паста с беконом',
        item_id: '270',
        count: '2',
        price: '360',
      },
    ],
  },
  {
    order: {
      order_id: '565480',
      sum_order: '979',
      sum_div: '129',
      type_order_: '1',
      status_order: '1',
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
      time_order: '2023-08-25 20:17:58',
      is_preorder: '0',
      promo_name: '7УТ4Б',
      promo_text:
        'скидку на всё меню, кроме напитков, соусов, приправ и палочек, в размере 20%',
      unix_time_to_client: '120-150',
      date_time_order: '2023-08-25 20:17:58',
      city_name: 'Тольятти',
      max_time_order: '22:47',
      date_time_order_new: '25 Августа 20:17',
      this_status_order: 'отменен',
      types: {
        type1: 1,
        type2: 1,
        type3: 1,
        type4: 1,
      },
    },
    order_items: [
      {
        id: '2530881',
        name: 'Цезарь с курицей',
        item_id: '41',
        count: '2',
        price: '318',
      },
      {
        id: '2530883',
        name: 'Калифорния с лососем запечённый спайси',
        item_id: '270',
        count: '2',
        price: '360',
      },
      {
        id: '2530882',
        name: 'Жако салат',
        item_id: '82',
        count: '1',
        price: '172',
      },
      {
        id: '2530883',
        name: 'Паста с беконом',
        item_id: '270',
        count: '2',
        price: '360',
      },
    ],
  },
];

export default React.memo(function OrderItemMobile({ order, token, this_module, city, last }) {
  //console.log('render OrderItemMobile');

  const [getOrder, setActiveModalOrder] = useProfileStore((state) => [state.getOrder, state.setActiveModalOrder]);

  // для тестирования
  const openOrder = (num) => {
    const order = testOrders.find(
      (order) => parseInt(order.order.status_order) === num
    );
    setActiveModalOrder(true, order);
  };

  return (
    <div className="zakazyItem"
      style={{
        marginBottom: last ? '11.111111111111vw' : null,
        background: parseInt(order?.type_status) === 1 || parseInt(order?.type_status) === 2 || parseInt(order?.type_status) === 3 ? 'rgba(221, 26, 50, 0.07)' : null,
      }}
    >
      <span>{order?.order_id}</span>

      {parseInt(order?.type_order) === 2 ? (
        <ErrorOrderMobile />
      ) : parseInt(order?.is_pred) === 1 ? (
        <CalendarOrderMobile />
      ) : parseInt(order?.is_delete) === 1 ? (
        <DeleteOrderMobile />
      ) : parseInt(order?.type_status) === 1 || parseInt(order?.type_status) === 2 || parseInt(order?.type_status) === 3 ? (
        <CookOrderMobile />
      ) : (
        <CheckOrderMobile />
      )}

      <span
        style={{ color: parseInt(order?.type_status) === 1 || parseInt(order?.type_status) === 2 || parseInt(order?.type_status) === 3 ? '#DD1A32' : 'rgba(0, 0, 0, 0.80)' }}
      >
        {parseInt(order?.type_status) === 1 || parseInt(order?.type_status) === 2
          ? 'Готовим'
          : parseInt(order?.type_status) === 3
          ? 'Везем'
          : moment(order?.date).format('D MMM').replace('.', '')}
      </span>

      <div className="zakazyGroup">
        {parseInt(order?.type_status) === 1 || parseInt(order?.type_status) === 2 || parseInt(order?.type_status) === 3 ? (
          <div className="zakazyEllipse">
            <EllipseOrderMobile />
            <EllipseOrderMobile />
            <EllipseOrderMobile />
          </div>
        ) : (
          <span>{new Intl.NumberFormat('ru-RU').format(order?.sum)} ₽</span>
        )}

        <ArrowRightMobile
          onClick={() => openOrder(2)} // для тестирования измеяешь цифру с 1 до 6 и разные данные в модалку заказа приходят
          //onClick={() => getOrder(this_module, city, token, order?.order_id, order?.point_id)}
        />
      </div>
    </div>
  );
}, areEqual)
