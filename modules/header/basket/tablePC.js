import { useCartStore } from '@/components/store.js';

import RowPC from './rowPC';

const dopText = {
  rolly: 'Не забудьте про соусы, приправы и приборы',
  pizza: 'Попробуйте необычное сочетание пиццы и соуса',
  all: 'Не забудьте про соусы, приправы и приборы',
}

export default function TablePC() {
  const [itemsCount, promoInfo, allPriceWithoutPromo, promoItemsFind, itemsOffDops, dopListCart, cart_is] = useCartStore((state) => [state.itemsCount, state.promoInfo, state.allPriceWithoutPromo, state.promoItemsFind, state.itemsOffDops, state.dopListCart, state.cart_is]);

  function getWord(int, array) {
    return (array = array || ['позиция', 'позиции', 'позиций']) && array[(int % 100 > 4 && int % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(int % 10 < 5) ? int % 10 : 5]];
  }

  let price1 = itemsOffDops.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);
  let price2 = dopListCart.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);

  return (
    <table className="TableMini">
      <tbody>

        {itemsOffDops.map((item, key) => 
          <RowPC key={key} count={item.count} item={item} last={item === itemsOffDops.at(-1) ? 'last' : ''} />
        )}

        {dopListCart.length ?
          <>
            <tr className='dopText'>
              <td>{dopText[cart_is]}</td>
            </tr>

            {dopListCart.map((item, key) => 
              <RowPC key={key} count={item.count} item={item} last={''}/>
            )}
          </>
            : 
          false
        }

      </tbody>
      <tfoot>
        <tr>
          <td>Итого: {itemsCount} {getWord(itemsCount)}</td>
          <td>
          <div className={promoInfo?.items_on_price?.length ? promoItemsFind ? 'promoInfo' : null : promoInfo?.status_promo && itemsOffDops.length ? 'promoInfo' : null}>
            {new Intl.NumberFormat('ru-RU').format( parseInt( price1 ) + parseInt( price2 ) )} ₽
          </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
