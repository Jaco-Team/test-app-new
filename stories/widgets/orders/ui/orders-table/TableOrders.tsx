import { OrderItem } from '@stories/entities/order/ui/order-item/OrderItem';
import './TableOrders.scss';

interface OrderPayload {
  [key: string]: unknown;
}

interface TableOrdersProps {
  order: {
    order: OrderPayload;
  };
}

export const TableOrders = ({ order }: TableOrdersProps) => {
  const orderList = Array.from({ length: 10 }, () => order);

  return (
    <table className="tableOrdersPC">
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
          <OrderItem key={key} {...order} />
        ))}
      </tbody>
    </table>
  );
};
