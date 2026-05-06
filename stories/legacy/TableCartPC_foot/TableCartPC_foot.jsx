import PropTypes from 'prop-types';
import './TableCartPC_foot.scss';

export const TableCartPC_foot = ({ itemsCount, items_on_price, promoItemsFind, status_promo, itemsOffDops, price1, price2 }) => {
  function getWord(int, array) {
    return (array = array || ['позиция', 'позиции', 'позиций']) && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]];
  }

  return (
    <tfoot>
      <td>Итого: {itemsCount} {getWord(itemsCount)}</td>
      <td>
        <span className={items_on_price?.length ? promoItemsFind ? 'promoInfo' : null : status_promo && itemsOffDops.length ? 'promoInfo' : null}>
          {new Intl.NumberFormat('ru-RU').format(parseInt(price1) + parseInt(price2))}{' '}₽
        </span>
      </td>
    </tfoot>
  );
};

TableCartPC_foot.propTypes = {
  itemsCount: PropTypes.number,
  items_on_price: PropTypes.array,
  itemsOffDops: PropTypes.array,
  status_promo: PropTypes.bool,
  price1: PropTypes.string.isRequired,
  price2: PropTypes.string.isRequired,
  promoItemsFind: PropTypes.bool,
};
