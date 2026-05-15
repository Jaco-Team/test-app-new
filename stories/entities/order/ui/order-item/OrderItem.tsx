import {
  ReloadIcon,
  CheckIcon,
  CloseIcon_old,
} from '@stories/shared/compat/CoreIcons';
import './OrderItem.scss';

export const OrderItem = ({ order }: Record<string, any>) => {
  return (
    <tr className="order-item-row">
      <td>
        {parseInt(order.is_delete) == 1 ? (
          <CloseIcon_old />
        ) : parseInt(order.type_status) == 5 ? (
          <CheckIcon />
        ) : (
          <ReloadIcon />
        )}{' '}
        {order.status_order}
      </td>
      <td>{order.order_id}</td>
      <td>{order.date}</td>
      <td>{order.time}</td>
      <td>{new Intl.NumberFormat('ru-RU').format(order.sum)} ₽</td>
      <td>
        <span>Открыть</span>
      </td>
    </tr>
  );
};
