import PropTypes from 'prop-types';
import { OrderItemPC } from '../OrderItemPC/OrderItemPC';
import './TableOrdersPC.scss';

export const TableOrdersPC = ({ order }) => {
  const orderList = Array.from(Array(10).keys()).fill(order);

  return (
    <table className='tableOrdersPC'>
      <thead>
        <tr>
          <th>статус заказа</th>
          <th>номер</th>
          <th>дата</th>
          <th>время</th>
          <th>сумма</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orderList.map((order, key) => (
          <OrderItemPC key={key} {...order} />
        ))}
      </tbody>
    </table>
  );
};

TableOrdersPC.propTypes = {
  order: PropTypes.object,
};
