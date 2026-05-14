import './TableCart.scss';
import { TableCart_body } from '../cart-table-body/TableCart_body';
// import { Icon } from '../Icon/Icon';
// import { MyMenu } from '../MyMenu/MyMenu';

export const TableCart = ({ data }: Record<string, any>) => {
  return (
    <table className="tableCart">
      <TableCart_body {...data} />
    </table>
  );
};
