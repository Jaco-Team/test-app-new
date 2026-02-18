
import React from 'react';
import { useProfileStore } from '@/components/store.js';
import { ArrowRightMobile, CheckOrderMobile, DeleteOrderMobile } from '@/ui/Icons.js';
import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

function areEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps.order) === JSON.stringify(nextProps.order);
}

export default React.memo(function OrderItemMobile({ order, token, this_module, city, last }) {

  const [getOrder] = useProfileStore((state) => [state.getOrder]);
  const openOrder = () => getOrder(this_module, city, token, order?.order_id, order?.point_id);

  const isDeleted = parseInt(order?.is_delete) === 1;
  const isReady = parseInt(order?.status_order_) === 6;

  let icon = null;
  let statusText = '';

  if (isReady) {
    icon = <CheckOrderMobile />;
    statusText = moment(order?.date).format('D MMM').replace('.', '');
  } else if (isDeleted) {
    icon = <DeleteOrderMobile fill="#cc0033" />;
    statusText = moment(order?.date).format('D MMM').replace('.', '');
  } 

  const showIconStatus = isReady || isDeleted;

  return (
   <>
    {showIconStatus ? (
      <div
        className="zakazyItem"
        style={{
          marginBottom: last ? '11.111111111111vw' : 0,
          background: isDeleted ? 'rgba(221, 26, 50, 0.07)' : '#fff',
        }}
        onClick={openOrder}
      >
        <span>{order?.order_id}</span>
        {icon}
        <span>{statusText}</span>
        <div className="zakazyGroup">
          <span>{new Intl.NumberFormat('ru-RU').format(order?.sum)} ₽</span>
          <ArrowRightMobile />
        </div>
      </div>
    ) : (
      <div
        className="zakazyItemСol"
        style={{
          marginBottom: last ? '11.111111111111vw' : 0,
        }}
        onClick={openOrder}
      >
        <span>{order?.order_id}</span>
        <div className="zakazyGroupСol">
          <span>{order.status_order}</span>
          <span>{new Intl.NumberFormat('ru-RU').format(order?.sum)} ₽</span>
          <ArrowRightMobile />
        </div>
      </div>
    )}
   </>
  );
}, areEqual);
