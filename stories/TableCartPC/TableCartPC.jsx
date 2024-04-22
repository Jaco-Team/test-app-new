import PropTypes from 'prop-types';

import './TableCartPC.scss';
import { TableCartPC_body } from '../TableCartPC_body/TableCartPC_body';
// import { IconPC } from '../IconPC/IconPC';
// import { MyMenu } from '../MyMenu/MyMenu';

export const TableCartPC = ({ data }) => {
  return (
    <table className="tableCartPC">
      <TableCartPC_body {...data} />
    </table>
  );
};

TableCartPC.propTypes = {
  data: PropTypes.array,
};
