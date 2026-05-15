// TableCart.tsx
import './TableCart.scss';
import { TableCart_body } from '../cart-table-body/TableCart_body';
import { TableCartProps } from '@stories/widgets/cart/ui/cart-table/model/types';

// Интерфейс для пропсов компонента TableCart

export const TableCart = ({ data = {} }: TableCartProps) => {
  return (
    <table className="tableCartPC">
      <TableCart_body {...data} />
    </table>
  );
};
