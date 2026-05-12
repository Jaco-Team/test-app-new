
import './TableCartPC.scss';
import { TableCartPC_body } from '../cart-table-body/TableCartPC_body';
// import { IconPC } from '../IconPC/IconPC';
// import { MyMenu } from '../MyMenu/MyMenu';

export const TableCartPC = ({ data }: Record<string, any>) => {
  return (
    <table className="tableCartPC">
      <TableCartPC_body {...data} />
    </table>
  );
};

