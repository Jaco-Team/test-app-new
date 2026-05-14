import './TableCart_body.scss';
import { TableCart_text } from '@stories/entities/cart/ui/cart-text/TableCart_text';
import { TableCart_row } from '@stories/entities/cart/ui/cart-row/TableCart_row';
import { TableCart_foot } from '../cart-table-footer/TableCart_foot';

export const TableCart_body = ({
  items,
  dopItems,
  itemsCount,
  dopItemsCount,
  footerData,
}: Record<string, any>) => {
  const itemsOffDops = Array.from({ length: itemsCount }, () => items);
  const dopListCart = Array.from({ length: dopItemsCount }, () => dopItems);

  return (
    <tbody>
      {itemsOffDops.map((item, key) => (
        <TableCart_row
          key={key}
          {...item}
          last={key + 1 === itemsOffDops.length ? 'last' : ''}
        />
      ))}
      {dopListCart.length ? (
        <>
          <TableCart_text text="rolly" />
          {dopListCart.map((item, key) => (
            <TableCart_row key={key} {...item} />
          ))}
        </>
      ) : (
        false
      )}
      <TableCart_foot {...footerData} />
    </tbody>
  );
};
