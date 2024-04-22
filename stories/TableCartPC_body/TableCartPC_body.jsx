import PropTypes from 'prop-types';

import './TableCartPC_body.scss';
import { TableCartPC_text } from '../TableCartPC_text/TableCartPC_text';
import { TableCartPC_row } from '../TableCartPC_row/TableCartPC_row';
import { TableCartPC_foot } from '../TableCartPC_foot/TableCartPC_foot';

export const TableCartPC_body = ({ items, dopItems, itemsCount, dopItemsCount, footerData }) => {
  const itemsOffDops = Array.from(Array(itemsCount).keys()).fill(items);
  const dopListCart = Array.from(Array(dopItemsCount).keys()).fill(dopItems);

  return (
    <tbody>
      {itemsOffDops.map((item, key) => <TableCartPC_row key={key} {...item} last={key + 1 === itemsOffDops.length ? 'last' : ''} />)}
      {dopListCart.length ? (
        <>
          <TableCartPC_text text="rolly" />
          {dopListCart.map((item, key) => <TableCartPC_row key={key} {...item} />)}
        </>
      ) : false}
      <TableCartPC_foot {...footerData} />
    </tbody>
  );
};

TableCartPC_body.propTypes = {
  itemsOffDops: PropTypes.array,
  dopListCart: PropTypes.array,
  itemsCount: PropTypes.number,
  dopItemsCount: PropTypes.number,
  footerData: PropTypes.object
};
