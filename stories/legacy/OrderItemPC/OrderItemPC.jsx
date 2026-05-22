import PropTypes from 'prop-types';
import { ReloadIcon, CheckIcon, CloseIcon_old } from '@/ui/Icons.js';
import './OrderItemPC.scss';

export const OrderItemPC = ({ order }) => {
  return (
    <tr className='orderItemPC'>
      <td>
          {parseInt(order.is_delete) == 1 ? <CloseIcon_old /> : parseInt(order.type_status) == 5 ? <CheckIcon /> : <ReloadIcon />}{' '}
          {order.status_order}
      </td>
      <td>{order.order_id}</td>
      <td>{order.date}</td>
      <td>{order.time}</td>
      <td>{new Intl.NumberFormat('ru-RU').format(order.sum)} ₽</td>
      <td><span>Открыть</span></td>
    </tr>
  );
};

OrderItemPC.propTypes = {
  order: PropTypes.object,
};
