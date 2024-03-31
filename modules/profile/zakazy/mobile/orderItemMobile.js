import React from 'react';

import { useProfileStore } from '@/components/store.js';

import { ArrowRightMobile, CheckOrderMobile, CalendarOrderMobile, DeleteOrderMobile, CookOrderMobile, EllipseOrderMobile, ErrorOrderMobile, DeliveryModalOrderIcon, ReloadIcon } from '@/ui/Icons.js';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

function areEqual(prevProps, nextProps) {
  return parseInt(nextProps.order?.is_delete) === parseInt(prevProps.order?.is_delete) || parseInt(nextProps.order?.type_status) === parseInt(prevProps.order?.type_status);
}

export default React.memo(function OrderItemMobile({ order, token, this_module, city, last }) {
  const [getOrder, setActiveModalOrder] = useProfileStore((state) => [state.getOrder, state.setActiveModalOrder]);

  const openOrder = () => {
    getOrder(this_module, city, token, order?.order_id, order?.point_id)
    setActiveModalOrder(true, order);
  };

  let icon_status = false;
  let text_status = '';

  //order.type_order = 2;
  //order.status_order_ = 2;

  if( parseInt(order?.is_delete) === 1 ){
    icon_status = <DeleteOrderMobile fill="#cc0033" />;
    text_status = moment(order?.date).format('D MMM').replace('.', '');
  }else{
    if( parseInt(order?.type_order) === 1 && parseInt(order?.status_order_) === 5 ){
      icon_status = <DeliveryModalOrderIcon fill={'#cc0033'} />;
      text_status = 'Везем';
    }
    if( parseInt(order?.status_order_) < 5 ){
      icon_status = <ReloadIcon fill="#cc0033" />;

      text_status = 'Готовим';

      if( parseInt(order?.type_order) === 2 && parseInt(order?.status_order_) == 4 ){
        text_status = 'Ждем вас';
      }
    }
    if( parseInt(order?.is_pred) === 1 && parseInt(order?.status_order_) === 1 ){
      icon_status = <CalendarOrderMobile fill="#cc0033" />;
      text_status = moment(order?.date).format('D MMM').replace('.', '');
    }
    if( parseInt(order?.status_order_) === 6 ){
      icon_status = <CheckOrderMobile />;
      text_status = moment(order?.date).format('D MMM').replace('.', '');
    }
  }

  return (
    <div className="zakazyItem"
      style={{
        marginBottom: last ? '11.111111111111vw' : 0,
        background: parseInt(order?.is_delete) == 1 ? 'rgba(221, 26, 50, 0.07)' : '#fff',
      }}
      onClick={openOrder}
    >
      <span>{order?.order_id}</span>
      {icon_status}
      <span>
        {text_status}
      </span>

      <div className="zakazyGroup">
        <span>{new Intl.NumberFormat('ru-RU').format(order?.sum)} ₽</span>
        <ArrowRightMobile />
      </div>
    </div>
  );
}, areEqual)
