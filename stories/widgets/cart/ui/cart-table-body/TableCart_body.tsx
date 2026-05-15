// TableCart_body.tsx
import './TableCart_body.scss';
import { TableCart_text } from '@stories/entities/cart/ui/cart-text/TableCart_text';
import { TableCart_row } from '@stories/entities/cart/ui/cart-row/TableCart_row';
import { TableCart_foot } from '../cart-table-footer/TableCart_foot';
import { TableCartBodyProps } from '@stories/widgets/cart/ui/cart-table-body/model/types';

export const TableCart_body = ({
  items = [],
  itemsCount = 0,
  dopItems = [],
  dopItemsCount = 0,
  footerData = {},
}: TableCartBodyProps) => {
  // Создаем массивы нужной длины
  const itemsOffDops = Array.from({ length: itemsCount }, () => items);
  const dopListCart = Array.from({ length: dopItemsCount }, () => dopItems);

  // Флаг наличия дополнительных товаров
  const hasDopItems = dopListCart.length > 0;

  return (
    <tbody>
      {itemsOffDops.map((item, key: number) => (
        <TableCart_row
          key={key}
          {...item}
          last={key + 1 === itemsOffDops.length ? 'last' : ''}
        />
      ))}

      {hasDopItems && (
        <>
          <TableCart_text text="rolly" />
          {dopListCart.map((item, key: number) => (
            <TableCart_row key={key} {...item} />
          ))}
        </>
      )}

      <TableCart_foot {...footerData} />
    </tbody>
  );
};
