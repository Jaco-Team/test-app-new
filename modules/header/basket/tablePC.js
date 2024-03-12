import { useCartStore } from '@/components/store.js';

import RowPC from './rowPC';

const dopText = {
  rolly: 'Выберите столько приправ и приборов, сколько необходимо. Есть РОЛЛЫ!',
  pizza: 'Выберите столько приправ и приборов, сколько необходимо. Есть ПИЦЦА!',
  all: 'Выберите столько приправ и приборов, сколько необходимо.',
}

export default function TablePC() {

  //console.log('render Basket TablePC');

  const [itemsCount, promoInfo, allPriceWithoutPromo, promoItemsFind, itemsOffDops, dopListCart, cart_is] = useCartStore((state) => [state.itemsCount, state.promoInfo, state.allPriceWithoutPromo, state.promoItemsFind, state.itemsOffDops, state.dopListCart, state.cart_is]);

  function getWord(int, array) {
    return (array = array || ['позиция', 'позиции', 'позиций']) && array[(int % 100 > 4 && int % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(int % 10 < 5) ? int % 10 : 5]];
  }

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
            {new Intl.NumberFormat('ru-RU').format(allPriceWithoutPromo)} ₽
          </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
