// TableCart_foot.tsx
import './TableCart_foot.scss';
import {
  TableCartFootProps,
  WordVariants,
} from '@stories/widgets/cart/ui/cart-table-footer/model/types';

// Функция для склонения слов с типами
function getWord(int: number, array?: WordVariants): string {
  const variants = array || ['позиция', 'позиции', 'позиций'];
  const remainder100 = int % 100;
  const remainder10 = int % 10;

  if (remainder100 > 4 && remainder100 < 20) {
    return variants[2];
  }

  const index = remainder10 < 5 ? remainder10 : 5;
  const mapping: Record<number, number> = { 1: 0, 2: 1, 3: 1, 4: 1, 5: 2 };

  return variants[mapping[index] ?? 2];
}

export const TableCart_foot = ({
  itemsCount = 0,
  items_on_price = [],
  promoItemsFind = false,
  status_promo = false,
  itemsOffDops = [],
  price1 = '0',
  price2 = '0',
}: TableCartFootProps) => {
  const totalPrice = Number(price1) + Number(price2);
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(totalPrice);

  const showPromoInfo =
    (items_on_price?.length && promoItemsFind) ||
    (status_promo && itemsOffDops?.length);

  return (
    <tfoot>
      <td>
        Итого: {itemsCount} {getWord(itemsCount)}
      </td>
      <td>
        <span className={showPromoInfo ? 'promoInfo' : undefined}>
          {formattedPrice} ₽
        </span>
      </td>
    </tfoot>
  );
};
