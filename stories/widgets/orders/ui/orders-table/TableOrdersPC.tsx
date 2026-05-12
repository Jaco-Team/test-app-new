import { OrderItemPC } from '@stories/entities/order/ui/order-item/OrderItemPC';
import './TableOrdersPC.scss';

export const TableOrdersPC = ({ order }: Record<string, any>) => {
  const orderList = Array.from({ length: 10 }, () => order);

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

