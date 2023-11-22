import React from 'react';

import { useProfileStore } from '@/components/store.js';

import { ArrowRightMobile, CheckOrderMobile, CalendarOrderMobile, DeleteOrderMobile, CookOrderMobile, EllipseOrderMobile, ErrorOrderMobile } from '@/ui/Icons.js';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

function areEqual(prevProps, nextProps) {
  return parseInt(nextProps.order?.is_delete) === parseInt(prevProps.order?.is_delete) || parseInt(nextProps.order?.type_status) === parseInt(prevProps.order?.type_status);
}

export default React.memo(function OrderItemMobile({ order, token, this_module, city, last }) {
  //console.log('render OrderItemMobile');

  const [getOrder, setActiveModalOrder] = useProfileStore((state) => [state.getOrder, state.setActiveModalOrder]);

  const openOrder = () => {
    getOrder(this_module, city, token, order?.order_id, order?.point_id)
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

        <ArrowRightMobile onClick={openOrder} />
      </div>
    </div>
  );
}, areEqual)
