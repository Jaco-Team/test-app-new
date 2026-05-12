// @ts-nocheck

import './TableCartPC_body.scss';
import { TableCartPC_text } from '../../../../entities/cart/ui/cart-text/TableCartPC_text';
import { TableCartPC_row } from '../../../../entities/cart/ui/cart-row/TableCartPC_row';
import { TableCartPC_foot } from '../cart-table-footer/TableCartPC_foot';

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

